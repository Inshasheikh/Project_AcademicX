import re
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile, OTPVerification
from .serializers import (
    UserProfileSerializer, UserSerializer, SendOTPSerializer, VerifyOTPSerializer,
    RegisterSerializer, ResetPasswordSerializer, RoleSelectionSerializer
)
from django.conf import settings
from .utils import (
    generate_otp_code, send_otp_email, send_fast2sms_otp,
    normalize_phone, check_rate_limit, find_user_by_identifier
)

class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = SendOTPSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({"success": False, "error": serializer.errors, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            raw_target = str(serializer.validated_data.get('email') or serializer.validated_data.get('identifier') or request.data.get('phone') or '').strip()
            purpose = serializer.validated_data.get('purpose', 'login')
            req_type = request.data.get('type') or serializer.validated_data.get('type')

            clean_digits = re.sub(r'\D', '', raw_target)
            has_at = '@' in raw_target

            if has_at:
                is_email = True
            elif len(clean_digits) >= 10 and not any(c.isalpha() for c in raw_target):
                is_email = False
            else:
                is_email = (req_type != 'phone')

            clean_target = raw_target if is_email else normalize_phone(raw_target)
            print(f"\n[BACKEND OTP REQUEST] Raw: '{raw_target}' | Resolved Type: {'EMAIL' if is_email else 'PHONE (Fast2SMS)'} | Target: {clean_target} | Purpose: {purpose}")

            # 0. User existence check for 'login' and 'reset_password'
            if purpose in ['login', 'reset_password']:
                user, _ = find_user_by_identifier(clean_target)
                if not user:
                    try:
                        from api.supabase_client import get_profile_by_phone, get_profile_by_email
                        sb_profile = get_profile_by_email(clean_target) if is_email else get_profile_by_phone(clean_target)
                        if sb_profile:
                            user = True
                    except Exception:
                        pass

                if not user:
                    target_desc = "email address" if is_email else "mobile phone number"
                    return Response({
                        "success": False,
                        "error": f"No account found with this {target_desc}. Please register first.",
                        "message": f"No account found with this {target_desc}. Please register first.",
                        "user_not_found": True
                    }, status=status.HTTP_404_NOT_FOUND)

            # 1. Rate Limiting Check (60s Cooldown, Max 5/hr)
            allowed, retry_after, rl_msg = check_rate_limit(clean_target, action="send_otp")
            if not allowed:
                return Response({
                    "success": False,
                    "error": rl_msg,
                    "message": rl_msg,
                    "retry_after": retry_after
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

            # 2. Invalidate old active OTPs for this target and purpose
            OTPVerification.objects.filter(email=clean_target, purpose=purpose).delete()

            # 3. Generate 6-digit OTP and 5-minute expiry
            otp_code = generate_otp_code()
            expires_at = timezone.now() + timedelta(minutes=5)

            # 4. Store in database
            OTPVerification.objects.create(
                email=clean_target,
                phone=clean_target if not is_email else None,
                otp_code=otp_code,
                expires_at=expires_at,
                purpose=purpose,
                verified=False,
                attempts=0
            )

            response_payload = {
                "success": True,
                "identifier": clean_target,
                "purpose": purpose,
                "expires_in_minutes": 5
            }

            # Enable demo OTP in Debug or Sandbox mode
            if getattr(settings, 'DEBUG', True) or getattr(settings, 'DIGILOCKER_SANDBOX_MODE', True):
                response_payload["demo_otp"] = otp_code
                response_payload["demo_code"] = otp_code

            if is_email:
                send_success, send_msg = send_otp_email(clean_target, otp_code)
                response_payload["email"] = clean_target
                response_payload["email_dispatched"] = send_success

                if send_success:
                    response_payload["message"] = f"OTP sent successfully to {clean_target}."
                else:
                    response_payload["message"] = f"Notice: Outbound SMTP port blocked on cloud host. (Code: {otp_code})"
                    if getattr(settings, 'DEBUG', True) or getattr(settings, 'DIGILOCKER_SANDBOX_MODE', True):
                        response_payload["demo_otp"] = otp_code
                        response_payload["demo_code"] = otp_code

                return Response(response_payload, status=status.HTTP_200_OK)
            else:
                # Real Phone / Fast2SMS SMS Delivery
                sms_success, sms_msg, sms_data = send_fast2sms_otp(clean_target, otp_code)
                response_payload["phone"] = clean_target
                response_payload["sms_dispatched"] = sms_success
                response_payload["gateway_message"] = sms_msg

                if sms_success:
                    response_payload["message"] = f"OTP dispatched to mobile +91 {clean_target} via Fast2SMS."
                else:
                    response_payload["message"] = f"Fast2SMS Notice: {sms_msg}"
                    if getattr(settings, 'DEBUG', True) or getattr(settings, 'DIGILOCKER_SANDBOX_MODE', True):
                        response_payload["message"] += f" (Demo OTP: {otp_code})"

                return Response(response_payload, status=status.HTTP_200_OK)
        except Exception as exc:
            import traceback
            traceback.print_exc()
            return Response({
                "success": False,
                "error": f"Server processing error: {str(exc)}",
                "message": "Internal server error occurred while sending OTP."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"success": False, "error": serializer.errors, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        raw_target = serializer.validated_data['email']
        otp = str(serializer.validated_data['otp']).strip()
        purpose = serializer.validated_data.get('purpose', 'login')
        is_email = '@' in raw_target
        clean_target = raw_target if is_email else normalize_phone(raw_target)

        now = timezone.now()

        # Check for unexpired, unverified OTP record
        otp_record = OTPVerification.objects.filter(
            email=clean_target,
            purpose=purpose,
            verified=False
        ).first()

        if not otp_record or otp_record.expires_at <= now:
            return Response({
                "success": False,
                "error": "Invalid or expired OTP code. Please request a new OTP."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Anti-Brute-Force Check
        if otp_record.attempts >= 5:
            otp_record.delete()
            return Response({
                "success": False,
                "error": "Maximum verification attempts exceeded. This OTP has been permanently invalidated."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check code match
        if otp_record.otp_code != otp:
            otp_record.attempts += 1
            otp_record.save()
            remaining = 5 - otp_record.attempts
            if remaining <= 0:
                otp_record.delete()
                return Response({
                    "success": False,
                    "error": "Maximum verification attempts exceeded. This OTP has been permanently invalidated."
                }, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "success": False,
                "error": f"Incorrect verification code. {remaining} attempt(s) remaining.",
                "remaining_attempts": remaining
            }, status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as verified
        otp_record.verified = True
        otp_record.save()

        # -------------------------------------------------------------
        # Branch 1: Purpose = 'login'
        # -------------------------------------------------------------
        if purpose == 'login':
            user, profile = find_user_by_identifier(clean_target)
            if not user:
                return Response({
                    "success": False,
                    "error": "User does not exist in the database. Please register first.",
                    "message": "User does not exist in the database. Please register first.",
                    "user_not_found": True
                }, status=status.HTTP_404_NOT_FOUND)

            # Ensure profile exists
            if not profile:
                profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.is_verified = True
            if '@' not in clean_target and not profile.phone:
                profile.phone = clean_target
            profile.save()

            # Generate SimpleJWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            full_name = f"{user.first_name} {user.last_name}".strip() or user.username

            return Response({
                "success": True,
                "message": "Login successful via OTP.",
                "token": access_token,
                "access_token": access_token,
                "refresh_token": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": full_name,
                    "role": profile.role,
                    "profile": UserProfileSerializer(profile).data
                },
                "role": profile.role
            }, status=status.HTTP_200_OK)

        # -------------------------------------------------------------
        # Branch 2: Purpose = 'register'
        # -------------------------------------------------------------
        elif purpose == 'register':
            return Response({
                "success": True,
                "message": "Identifier verified successfully.",
                "email_verified": True,
                "email": clean_target,
                "identifier": clean_target
            }, status=status.HTTP_200_OK)

        # -------------------------------------------------------------
        # Branch 3: Purpose = 'reset_password'
        # -------------------------------------------------------------
        elif purpose == 'reset_password':
            return Response({
                "success": True,
                "message": "OTP verified. You may now reset your password.",
                "reset_allowed": True,
                "email": clean_target,
                "identifier": clean_target
            }, status=status.HTTP_200_OK)

        return Response({"success": True, "message": "OTP verified."}, status=status.HTTP_200_OK)


class LoginView(APIView):
    """
    Handles both Password Login and Instant OTP Login for LoginPage.jsx
    """
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        is_otp_login = data.get('isOtpLogin', False)

        if is_otp_login:
            otp = str(data.get('otp', '')).strip()
            raw_id = (data.get('email') or data.get('phone') or data.get('identifier') or '').strip().lower()

            if not raw_id:
                return Response({"success": False, "error": "Email or phone number is required."}, status=status.HTTP_400_BAD_REQUEST)
            if not otp or len(otp) != 6:
                return Response({"success": False, "error": "A valid 6-digit OTP code is required."}, status=status.HTTP_400_BAD_REQUEST)

            is_email = '@' in raw_id
            clean_id = raw_id if is_email else normalize_phone(raw_id)

            now = timezone.now()
            otp_record = OTPVerification.objects.filter(
                email=clean_id,
                purpose='login',
                verified=False
            ).first()

            if not otp_record or otp_record.expires_at <= now:
                return Response({
                    "success": False,
                    "error": "Invalid or expired OTP code. Please request a new OTP."
                }, status=status.HTTP_400_BAD_REQUEST)

            # Brute-force protection
            if otp_record.attempts >= 5:
                otp_record.delete()
                return Response({
                    "success": False,
                    "error": "Maximum verification attempts exceeded. This OTP has been permanently invalidated."
                }, status=status.HTTP_400_BAD_REQUEST)

            if otp_record.otp_code != otp:
                otp_record.attempts += 1
                otp_record.save()
                remaining = 5 - otp_record.attempts
                if remaining <= 0:
                    otp_record.delete()
                    return Response({
                        "success": False,
                        "error": "Maximum verification attempts exceeded. This OTP has been permanently invalidated."
                    }, status=status.HTTP_400_BAD_REQUEST)

                return Response({
                    "success": False,
                    "error": f"Incorrect verification code. {remaining} attempt(s) remaining.",
                    "remaining_attempts": remaining
                }, status=status.HTTP_400_BAD_REQUEST)

            otp_record.verified = True
            otp_record.save()

            user, profile = find_user_by_identifier(clean_id)
            if not user:
                return Response({
                    "success": False,
                    "error": "User does not exist in the database. Please register first.",
                    "message": "User does not exist in the database. Please register first.",
                    "user_not_found": True
                }, status=status.HTTP_404_NOT_FOUND)

            if not profile:
                profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.is_verified = True
            if not is_email and not profile.phone:
                profile.phone = clean_id
            profile.save()

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            full_name = f"{user.first_name} {user.last_name}".strip() or user.username

            return Response({
                "success": True,
                "message": "OTP Login successful.",
                "token": access_token,
                "access_token": access_token,
                "refresh_token": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": full_name,
                    "role": profile.role,
                    "profile": UserProfileSerializer(profile).data
                },
                "role": profile.role
            }, status=status.HTTP_200_OK)

        # Standard Email & Password Login
        email = (data.get('email') or '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return Response({"success": False, "error": "Both email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user, profile = find_user_by_identifier(email)
        if not user:
            return Response({
                "success": False,
                "error": "No account found with this email or username. Please register first.",
                "message": "No account found with this email or username. Please register first.",
                "user_not_found": True
            }, status=status.HTTP_404_NOT_FOUND)

        if not user.check_password(password):
            return Response({"success": False, "error": "Invalid credentials. Please check your password."}, status=status.HTTP_401_UNAUTHORIZED)

        profile, _ = UserProfile.objects.get_or_create(user=user)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        full_name = f"{user.first_name} {user.last_name}".strip() or user.username

        return Response({
            "success": True,
            "message": "Login successful.",
            "token": access_token,
            "access_token": access_token,
            "refresh_token": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": full_name,
                "role": profile.role,
                "profile": UserProfileSerializer(profile).data
            },
            "role": profile.role
        }, status=status.HTTP_200_OK)



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        first_name = serializer.validated_data.get('first_name', '')
        last_name = serializer.validated_data.get('last_name', '')
        role = serializer.validated_data.get('role', 'student')
        college = serializer.validated_data.get('college', '')
        department = serializer.validated_data.get('department', '')
        phone = serializer.validated_data.get('phone', '')

        # Verify that an OTP was verified for registration in the last 15 minutes
        recent_cutoff = timezone.now() - timedelta(minutes=15)
        clean_phone = normalize_phone(phone) if phone else ''

        otp_filter = Q(email=email)
        if clean_phone:
            otp_filter |= Q(email=clean_phone) | Q(phone=clean_phone)

        has_verified_otp = OTPVerification.objects.filter(
            otp_filter,
            purpose='register',
            verified=True,
            created_at__gte=recent_cutoff
        ).exists()

        if not has_verified_otp:
            return Response({
                "success": False,
                "error": "Verification via OTP has not been completed. Please verify your email or mobile phone first."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create Django User
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Create UserProfile
        profile = UserProfile.objects.create(
            user=user,
            role=role,
            college=college,
            department=department,
            phone=phone,
            is_verified=True
        )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            "success": True,
            "message": "Registration completed successfully.",
            "token": access_token,
            "access_token": access_token,
            "refresh_token": str(refresh),
            "user": UserSerializer(user).data,
            "role": profile.role
        }, status=status.HTTP_201_CREATED)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']

        # Verify that an OTP was verified for reset_password in the last 15 minutes
        recent_cutoff = timezone.now() - timedelta(minutes=15)
        clean_target = normalize_phone(email) if ('@' not in email) else email.lower()

        has_verified_otp = OTPVerification.objects.filter(
            Q(email=email) | Q(email=clean_target) | Q(phone=clean_target),
            purpose='reset_password',
            verified=True,
            created_at__gte=recent_cutoff
        ).exists()

        if not has_verified_otp:
            return Response({
                "success": False,
                "error": "OTP verification required before resetting password."
            }, status=status.HTTP_400_BAD_REQUEST)

        user, _ = find_user_by_identifier(email)
        if not user:
            return Response({"success": False, "error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()

        # Invalidate used OTPs for security
        OTPVerification.objects.filter(
            Q(email=email) | Q(email=clean_target) | Q(phone=clean_target),
            purpose='reset_password'
        ).delete()

        return Response({
            "success": True,
            "message": "Password updated successfully. You can now login with your new password."
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"success": True, "message": "Logged out successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": True, "message": "Logged out locally."}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response({
            "success": True,
            "user": UserSerializer(request.user).data,
            "role": profile.role
        }, status=status.HTTP_200_OK)


class RoleSelectionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RoleSelectionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.role = serializer.validated_data['role']
        if serializer.validated_data.get('college'):
            profile.college = serializer.validated_data['college']
        if serializer.validated_data.get('department'):
            profile.department = serializer.validated_data['department']
        if serializer.validated_data.get('phone'):
            profile.phone = serializer.validated_data['phone']
        profile.save()

        return Response({
            "success": True,
            "message": f"Role updated to {profile.role}.",
            "user": UserSerializer(request.user).data,
            "role": profile.role
        }, status=status.HTTP_200_OK)
