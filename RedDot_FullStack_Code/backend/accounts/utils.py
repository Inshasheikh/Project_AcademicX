import secrets
import re
import os
import time
import requests
from datetime import datetime, timedelta, timezone
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

# In-memory rate limiting store: { target_identifier: [timestamp1, timestamp2, ...] }
_RATE_LIMIT_STORE = {}
COOLDOWN_SECONDS = 60
HOURLY_WINDOW_SECONDS = 3600
MAX_REQUESTS_PER_WINDOW = 5

def normalize_phone(phone: str) -> str:
    """Extracts the exact 10-digit Indian mobile number."""
    clean = re.sub(r'[^0-9]', '', str(phone or ''))
    if len(clean) >= 10:
        return clean[-10:]
    return clean

def find_user_by_identifier(identifier: str):
    """
    Looks up a User by email, username, or phone number in UserProfile.
    Handles exact, normalized, +91 prefixed, and stripped phone variants.
    Returns (user, profile) tuple or (None, None).
    """
    from django.contrib.auth.models import User
    from .models import UserProfile

    if not identifier:
        return None, None

    raw = str(identifier).strip()
    is_email = '@' in raw

    if is_email:
        clean_email = raw.lower()
        user = User.objects.filter(email__iexact=clean_email).first() or User.objects.filter(username__iexact=clean_email).first()
        if user:
            profile = getattr(user, 'profile', None) or UserProfile.objects.filter(user=user).first()
            return user, profile
        return None, None
    else:
        clean_phone = normalize_phone(raw)
        if not clean_phone or len(clean_phone) < 10:
            return None, None

        phone_queries = [
            clean_phone,
            f"+91{clean_phone}",
            f"91{clean_phone}",
            f"0{clean_phone}",
        ]
        # 1. Check UserProfile by phone variations or ending with 10 digits
        profile = (
            UserProfile.objects.filter(phone__in=phone_queries).first() or
            UserProfile.objects.filter(phone__endswith=clean_phone).first()
        )
        if profile and profile.user:
            return profile.user, profile

        # 2. Check User username
        user = (
            User.objects.filter(username__in=phone_queries).first() or
            User.objects.filter(username__endswith=clean_phone).first()
        )
        if user:
            prof = getattr(user, 'profile', None) or UserProfile.objects.filter(user=user).first()
            return user, prof

        return None, None

def generate_otp_code() -> str:
    """Generates a cryptographically secure 6-digit numeric OTP code."""
    rng = secrets.SystemRandom()
    return f"{rng.randint(100000, 999999)}"

def check_rate_limit(target: str, action: str = "send_otp") -> tuple[bool, int, str]:
    """
    Enforces a 60-second cooldown and a maximum of 5 requests per hour.
    Protects Fast2SMS wallet balance from automated SMS bombing attacks.
    """
    key = f"{action}:{str(target).strip().lower()}"
    now = time.time()

    timestamps = _RATE_LIMIT_STORE.get(key, [])
    # Remove timestamps older than 1 hour
    timestamps = [t for t in timestamps if now - t < HOURLY_WINDOW_SECONDS]
    _RATE_LIMIT_STORE[key] = timestamps

    if timestamps:
        # Check cooldown
        last_request = timestamps[-1]
        elapsed = now - last_request
        if elapsed < COOLDOWN_SECONDS:
            retry_after = int(COOLDOWN_SECONDS - elapsed)
            return False, retry_after, f"Please wait {retry_after} seconds before requesting a new OTP."

        # Check hourly cap
        if len(timestamps) >= MAX_REQUESTS_PER_WINDOW:
            return False, int(HOURLY_WINDOW_SECONDS - (now - timestamps[0])), "Hourly OTP limit exceeded. Please try again in an hour."

    # Record current timestamp
    timestamps.append(now)
    _RATE_LIMIT_STORE[key] = timestamps
    return True, 0, ""

def send_fast2sms_otp(phone: str, otp_code: str) -> tuple[bool, str, dict]:
    """
    Dispatches real SMS OTP via Fast2SMS Quick Route (bulkV2).
    """
    api_key = os.environ.get("FAST2SMS_API_KEY", "").strip()
    clean_phone = normalize_phone(phone)
    app_name = getattr(settings, 'DEFAULT_FROM_NAME', 'REDDOT')

    # Always log clearly in server console for SIH demonstration
    print("\n" + "=" * 60)
    print(" [FAST2SMS GATEWAY] OUTBOUND SMS DISPATCH")
    print(f" Target Mobile : +91 {clean_phone}")
    print(f" OTP Code      : {otp_code}")
    print(f" Valid For     : 5 Minutes")
    print(f" Fast2SMS Key  : {'Configured (' + api_key[:8] + '...)' if api_key else 'NOT CONFIGURED'}")
    print("=" * 60 + "\n")

    if not api_key:
        return True, "SMS simulated (FAST2SMS_API_KEY not set in .env).", {"simulated": True}

    if len(clean_phone) != 10 or not clean_phone.isdigit():
        return False, f"Invalid Indian phone number: '{phone}'. Must be a 10-digit mobile number.", {}

    sms_message = f"Your {app_name} verification code is: {otp_code}. Valid for 5 minutes. Do not share this OTP."
    url = "https://www.fast2sms.com/dev/bulkV2"
    headers = {
        "authorization": api_key
    }
    payload = {
        "route": "q",
        "message": sms_message,
        "language": "english",
        "flash": 0,
        "numbers": clean_phone
    }

    try:
        res = requests.post(url, data=payload, headers=headers, timeout=10)
        data = res.json()
        print(f"[Fast2SMS Response] Status: {res.status_code}, Body: {data}")

        if data.get("return") is True:
            print(f"[Fast2SMS Success] Real SMS dispatched to +91{clean_phone} (Request ID: {data.get('request_id')})")
            return True, "SMS dispatched successfully via Fast2SMS.", data

        # Check for specific Fast2SMS error notices (e.g. DND or approval)
        status_code = data.get("status_code")
        raw_msg = data.get("message")
        msg_str = " ".join(raw_msg) if isinstance(raw_msg, list) else str(raw_msg or '')

        if status_code == 427 or "DND" in msg_str:
            notice = f"Mobile number is registered on TRAI DND (Do Not Disturb). Fast2SMS blocked promotional routing. Use console/dev OTP."
            print(f"[Fast2SMS Warning] {notice}")
            return False, notice, data

        if status_code == 996:
            notice = "Fast2SMS requires website domain verification for OTP route. Using console/dev OTP."
            print(f"[Fast2SMS Warning] {notice}")
            return False, notice, data

        return False, f"Fast2SMS gateway error: {msg_str}", data

    except Exception as e:
        err_str = f"Fast2SMS connection error: {str(e)}"
        print(f"[Fast2SMS Error] {err_str}")
        return False, err_str, {}

def send_otp_email(email: str, otp_code: str) -> tuple[bool, str]:
    """
    Renders the REDDOT HTML template and dispatches OTP email via Django's SMTP backend.
    Falls back gracefully to console output in development if SMTP credentials are being configured.
    """
    subject = "Your REDDOT OTP Code"
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'REDDOT <noreply@reddot.edu>')

    context = {
        'email': email,
        'otp_code': otp_code,
    }

    try:
        html_content = render_to_string('email/otp_email.html', context)
        text_content = strip_tags(html_content)
    except Exception as e:
        html_content = f"<h2>Your REDDOT OTP Code is {otp_code}</h2><p>Valid for 5 minutes.</p>"
        text_content = f"Hello {email},\n\nYour REDDOT OTP Code is: {otp_code}\nThis OTP is valid for 5 minutes.\n\nTeam REDDOT"

    host_user = getattr(settings, 'EMAIL_HOST_USER', '')

    print("\n" + "=" * 60)
    print(" [REDDOT AUTH GATEWAY] EMAIL OTP DISPATCHED")
    print(f" Target Email : {email}")
    print(f" OTP Code     : {otp_code}")
    print(f" Valid For    : 5 Minutes")
    print("=" * 60 + "\n")

    if not host_user:
        print("[Notice] EMAIL_HOST_USER is not set in .env. Console simulation active.")
        return True, "OTP simulated in server console (EMAIL_HOST_USER pending in .env)."

    try:
        msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        print(f"[Success] Real email delivered to {email} via Gmail SMTP.")
        return True, "Email sent successfully."
    except Exception as e:
        err_msg = f"[SMTP Error] Failed to send email to {email}: {str(e)}"
        print(err_msg)

        # Fallback to Resend HTTPS API if SMTP port 587 is blocked by cloud provider (e.g. Render Free)
        resend_key = os.environ.get('RESEND_API_KEY', '').strip()
        if resend_key:
            try:
                r = requests.post(
                    "https://api.resend.com/emails",
                    headers={"Authorization": f"Bearer {resend_key}", "Content-Type": "application/json"},
                    json={
                        "from": f"{getattr(settings, 'DEFAULT_FROM_NAME', 'AcademicX')} <onboarding@resend.dev>",
                        "to": [email],
                        "subject": f"Your AcademicX Verification Code: {otp_code}",
                        "html": f"<p>Your AcademicX verification code is: <strong>{otp_code}</strong>. Valid for 5 minutes.</p>"
                    },
                    timeout=8
                )
                if r.status_code in (200, 201):
                    print(f"[Success] Real email delivered to {email} via Resend HTTPS API.")
                    return True, "Email sent successfully via Resend HTTPS."
            except Exception as re_err:
                print(f"[Resend Fallback Error] {re_err}")

        return False, err_msg
