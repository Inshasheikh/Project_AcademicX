from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, OTPVerification

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'phone', 'college', 'department', 'is_verified', 'created_at', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

class SendOTPSerializer(serializers.Serializer):
    email = serializers.CharField(required=False, allow_blank=True)
    identifier = serializers.CharField(required=False, allow_blank=True)
    purpose = serializers.CharField(required=False, default='login')
    type = serializers.CharField(required=False, default='email')

    def validate(self, attrs):
        target = attrs.get('email') or attrs.get('identifier')
        if not target:
            raise serializers.ValidationError("An email or phone identifier is required.")
        
        clean_target = str(target).strip().lower()
        attrs['email'] = clean_target
        attrs['identifier'] = clean_target
        
        purpose = attrs.get('purpose')
        if not purpose or purpose not in ['login', 'register', 'reset_password']:
            attrs['purpose'] = 'login'
        return attrs

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.CharField(required=False, allow_blank=True)
    identifier = serializers.CharField(required=False, allow_blank=True)
    otp = serializers.CharField(required=False, allow_blank=True)
    otp_code = serializers.CharField(required=False, allow_blank=True)
    purpose = serializers.CharField(required=False, default='login')
    type = serializers.CharField(required=False, default='email')

    def validate(self, attrs):
        target = attrs.get('email') or attrs.get('identifier')
        code = attrs.get('otp') or attrs.get('otp_code')
        
        if not target:
            raise serializers.ValidationError("Email or identifier is required.")
        if not code or len(str(code).strip()) != 6:
            raise serializers.ValidationError("A valid 6-digit numeric OTP is required.")
        
        clean_target = str(target).strip().lower()
        attrs['email'] = clean_target
        attrs['identifier'] = clean_target
        attrs['otp'] = str(code).strip()
        
        purpose = attrs.get('purpose')
        if not purpose or purpose not in ['login', 'register', 'reset_password']:
            attrs['purpose'] = 'login'
        return attrs

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=4)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    fullName = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    role = serializers.CharField(required=False, default='student')
    college = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    department = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    institutionOrCompany = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    degreeOrDept = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    studentRollNo = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, default='')

    def validate_email(self, value):
        clean = value.strip().lower()
        if User.objects.filter(email=clean).exists():
            raise serializers.ValidationError(f"An account with email '{clean}' already exists.")
        return clean

    def validate(self, attrs):
        # Support both fullName and first_name/last_name
        full_name = attrs.get('fullName') or ''
        if full_name and not attrs.get('first_name'):
            parts = full_name.split(' ', 1)
            attrs['first_name'] = parts[0]
            attrs['last_name'] = parts[1] if len(parts) > 1 else ''
        
        # Support both college/department and institutionOrCompany/degreeOrDept
        if not attrs.get('college') and attrs.get('institutionOrCompany'):
            attrs['college'] = attrs.get('institutionOrCompany')
        if not attrs.get('department') and attrs.get('degreeOrDept'):
            attrs['department'] = attrs.get('degreeOrDept')
            
        return attrs

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True, min_length=4)
    confirm_password = serializers.CharField(write_only=True, min_length=4, required=False)

    def validate_email(self, value):
        clean = value.strip().lower()
        if not User.objects.filter(email=clean).exists():
            raise serializers.ValidationError("No registered user found with this email address.")
        return clean

    def validate(self, attrs):
        if attrs.get('confirm_password') and attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

class RoleSelectionSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=['student', 'faculty', 'recruiter', 'admin'])
    college = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    department = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, default='')
