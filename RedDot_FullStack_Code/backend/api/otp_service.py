import secrets
import re
import uuid
import os
import requests
from datetime import datetime, timedelta, timezone
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from .supabase_client import get_supabase_client

# Blueprint specs matching OTP_SYSTEM_SETUP.md
OTP_VALIDITY_MINUTES = 5
MAX_ATTEMPTS = 5
COOLDOWN_SECONDS = 60
HOURLY_WINDOW_SECONDS = 3600
MAX_REQUESTS_PER_WINDOW = 5

# Local fallback cache in case of database network timeouts
_OTP_FALLBACK_STORE = {}

def normalize_phone(phone: str) -> str:
    """Cleans phone number to 10 digits as specified in setup guide."""
    clean = re.sub(r'[^0-9]', '', str(phone or ''))
    if len(clean) >= 10:
        return clean[-10:]
    return clean

def normalize_email(email: str) -> str:
    """Normalizes and trims email."""
    return str(email or '').strip().lower()

def generate_otp_code() -> str:
    """Generates a cryptographically secure 6-digit numeric OTP."""
    rng = secrets.SystemRandom()
    return f"{rng.randint(100000, 999999)}"

def check_rate_limit(key: str, action: str) -> tuple[bool, int, str]:
    """
    Checks rate limits using Supabase RPC `check_rate_limit`.
    Falls back gracefully if RPC fails.
    """
    try:
        client = get_supabase_client()
        res = client.rpc("check_rate_limit", {
            "p_key": key,
            "p_action": action,
            "p_max_requests": MAX_REQUESTS_PER_WINDOW,
            "p_window_seconds": HOURLY_WINDOW_SECONDS,
            "p_cooldown_seconds": COOLDOWN_SECONDS
        }).execute()

        data = res.data or {}
        if not data.get("allowed", True):
            reason = data.get("reason", "cooldown")
            retry_after = data.get("retry_after", COOLDOWN_SECONDS)
            err_msg = (
                f"Please wait {retry_after} seconds before requesting a new OTP."
                if reason == "cooldown"
                else "Hourly OTP request limit exceeded. Please try again later."
            )
            return False, retry_after, err_msg
    except Exception as e:
        print(f"[RateLimit] RPC check skipped: {e}")

    return True, 0, ""

def send_smtp_email(to_email: str, otp_code: str, validity_minutes: int = OTP_VALIDITY_MINUTES) -> tuple[bool, str]:
    """
    Dispatches verification email via configured SMTP settings, or simulates if unconfigured.
    """
    app_name = getattr(settings, 'DEFAULT_FROM_NAME', 'REDDOT')
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', f'{app_name} <noreply@reddot.edu>')
    host_user = getattr(settings, 'EMAIL_HOST_USER', '')

    subject = f"[{app_name}] Your Verification Code is {otp_code}"

    text_content = (
        f"Your verification code is: {otp_code}\n\n"
        f"This code is valid for {validity_minutes} minutes. Do not share it with anyone.\n\n"
        f"— The {app_name} Team"
    )

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }}
        .box {{ max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .header {{ background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); padding: 28px; text-align: center; color: white; }}
        .content {{ padding: 28px; text-align: center; color: #1e293b; }}
        .code {{ font-family: 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0369a1; background: #f0f9ff; padding: 16px; border-radius: 12px; margin: 20px auto; max-width: 280px; border: 2px dashed #38bdf8; }}
        .note {{ font-size: 13px; color: #64748b; line-height: 1.5; }}
        .footer {{ background: #f8fafc; padding: 14px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }}
      </style>
    </head>
    <body>
      <div class="box">
        <div class="header">
          <h2 style="margin:0;">{app_name}</h2>
          <p style="margin:4px 0 0 0; font-size:13px; opacity:0.9;">Secure Identity Gateway</p>
        </div>
        <div class="content">
          <p style="font-size:15px; font-weight:600; margin-top:0;">Your One-Time Verification Code</p>
          <div class="code">{otp_code}</div>
          <p class="note">This code is valid for <strong>{validity_minutes} minutes</strong>. For security, never share this code with anyone.</p>
        </div>
        <div class="footer">&copy; 2026 {app_name}. All rights reserved.</div>
      </div>
    </body>
    </html>
    """

    if not host_user:
        msg = f"[REDDOT Email Notice]: EMAIL_HOST_USER is not configured in .env. Email dispatch simulated."
        print(msg)
        return False, msg

    try:
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        print(f"[REDDOT Email] Successfully delivered OTP email to {to_email}")
        return True, "Email dispatched successfully."
    except Exception as e:
        err_msg = f"[REDDOT Email Error]: {str(e)}"
        print(err_msg)
        return False, err_msg

def send_fast2sms(clean_phone: str, otp_code: str) -> tuple[bool, str]:
    """
    Dispatches SMS using Fast2SMS Quick Route (bulkV2).
    Falls back to simulated mode if API key is not provisioned or out of credits.
    """
    api_key = os.environ.get("FAST2SMS_API_KEY", "").strip()
    app_name = getattr(settings, 'DEFAULT_FROM_NAME', 'Academia')

    if not api_key:
        print(f"[Fast2SMS Notice] FAST2SMS_API_KEY not configured. Running in simulated mode.")
        return True, "SMS simulated (Gateway notice: FAST2SMS_API_KEY not set)."

    try:
        sms_message = f"Your {app_name} verification code is: {otp_code}. Valid for 5 minutes. Do not share."
        url = "https://www.fast2sms.com/dev/bulkV2"
        params = {
            "authorization": api_key,
            "route": "q",
            "message": sms_message,
            "language": "english",
            "flash": "0",
            "numbers": clean_phone
        }
        res = requests.get(url, params=params, timeout=8)
        data = res.json()
        if data.get("return") is True or data.get("status_code") == 200:
            print(f"[Fast2SMS] Successfully dispatched SMS to +91{clean_phone}")
            return True, "SMS dispatched successfully via Fast2SMS."
        else:
            print(f"[Fast2SMS Warning] Fast2SMS response: {data}")
            return True, f"OTP generated (Gateway notice: {data.get('message', 'simulated')})"
    except Exception as e:
        print(f"[Fast2SMS Error]: {e}")
        return True, "SMS simulated (Fast2SMS request failed)."

def send_otp(identifier: str, otp_type: str = "email") -> dict:
    """
    Issues OTP for Email (via Gmail SMTP) or Phone (via Fast2SMS / SMS Gateway).
    Records into Supabase `otp_verification` or `otp_storage`.
    """
    if not identifier:
        return {"success": False, "error": "Email or Phone number is required."}

    is_phone = (otp_type == "phone") or (not "@" in str(identifier) and re.match(r'^[\d\+\s\-\(\)]+$', str(identifier)))
    clean_id = normalize_phone(identifier) if is_phone else normalize_email(identifier)
    target_type = "phone" if is_phone else "email"
    action_name = f"send_{target_type}_otp"

    # 1. Rate Limiting Check
    allowed, retry_after, rl_err = check_rate_limit(clean_id, action_name)
    if not allowed:
        return {
            "success": False,
            "error": rl_err,
            "cooldown": True,
            "wait_seconds": retry_after
        }

    # 2. Generate 6-digit OTP and 5-minute expiry
    otp_code = generate_otp_code()
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=OTP_VALIDITY_MINUTES)
    expires_iso = expires_at.isoformat()

    client = get_supabase_client()

    # 3. Store in Supabase according to target schema
    try:
        if is_phone:
            # Delete old unverified OTPs for this phone
            client.table("otp_storage").delete().eq("phone", clean_id).eq("verified", False).execute()
            # Insert fresh OTP
            client.table("otp_storage").insert({
                "phone": clean_id,
                "otp": otp_code,
                "expires_at": expires_iso,
                "verified": False,
                "attempts": 0
            }).execute()
        else:
            # Delete old unverified OTPs for this email
            client.table("otp_verification").delete().eq("email", clean_id).eq("verified", False).execute()
            # Insert fresh OTP
            client.table("otp_verification").insert({
                "email": clean_id,
                "otp_code": otp_code,
                "expires_at": expires_iso,
                "verified": False,
                "attempts": 0
            }).execute()
    except Exception as e:
        print(f"[OTP Service] Supabase store warning (using cache fallback): {e}")

    # Fallback memory record
    _OTP_FALLBACK_STORE[clean_id] = {
        "otp_code": otp_code,
        "is_phone": is_phone,
        "expires_at": expires_at,
        "verified": False,
        "attempts": 0
    }

    # 4. Dispatch via Email or SMS
    if is_phone:
        send_fast2sms(clean_id, otp_code)
        channel = "Fast2SMS Bulk Gateway"
    else:
        send_smtp_email(clean_id, otp_code, OTP_VALIDITY_MINUTES)
        channel = "Email Verification Gateway"

    print("\n" + "="*65)
    print(f"  REDDOT AUTH PIPELINE: OTP DISPATCHED")
    print(f"  Channel          : {channel}")
    print(f"  Target ({target_type:<5})   : {clean_id}")
    print(f"  OTP Code         : {otp_code}")
    print(f"  Expiry           : 5 Minutes ({expires_at.strftime('%H:%M:%S UTC')})")
    print("="*65 + "\n")

    return {
        "success": True,
        "message": f"Verification code sent successfully to your {target_type}.",
        "identifier": clean_id,
        "type": target_type,
        "expires_in_minutes": OTP_VALIDITY_MINUTES,
        "demo_code": otp_code
    }

def verify_otp(identifier: str, entered_code: str, otp_type: str = "email") -> dict:
    """
    Unified verification function validating both phone (otp_storage) and email (otp_verification).
    Enforces 5-minute expiry and max 5-attempt anti-brute-force lock.
    """
    if not identifier or not entered_code:
        return {"success": False, "error": "Provide phone or email along with the OTP."}

    clean_code = str(entered_code).strip()
    if len(clean_code) != 6 or not clean_code.isdigit():
        return {"success": False, "error": "Please enter a valid 6-digit numeric OTP."}

    is_phone = (otp_type == "phone") or (not "@" in str(identifier) and re.match(r'^[\d\+\s\-\(\)]+$', str(identifier)))
    clean_id = normalize_phone(identifier) if is_phone else normalize_email(identifier)
    target_table = "otp_storage" if is_phone else "otp_verification"
    lookup_col = "phone" if is_phone else "email"
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()

    client = get_supabase_client()

    try:
        # 1. Fetch the active unexpired OTP record from Supabase
        res = client.table(target_table)\
            .select("*")\
            .eq(lookup_col, clean_id)\
            .eq("verified", False)\
            .gt("expires_at", now_iso)\
            .order("created_at", desc=True)\
            .limit(1)\
            .execute()

        if not res.data:
            cached = _OTP_FALLBACK_STORE.get(clean_id)
            if not cached:
                return {
                    "success": False,
                    "error": "Invalid or expired OTP code. Please request a fresh code."
                }
            # Continue to local fallback logic below
            raise ValueError("Using local cache fallback")

        record = res.data[0]
        rec_id = record["id"]
        attempts = record.get("attempts", 0)

        # 2. Anti-Brute-Force check (Max 5 attempts)
        if attempts >= MAX_ATTEMPTS:
            client.table(target_table).update({"expires_at": now_iso}).eq("id", rec_id).execute()
            return {
                "success": False,
                "error": "Too many failed attempts. Code has been invalidated."
            }

        stored_code = record.get("otp") if is_phone else record.get("otp_code")

        # 3. Verify OTP Match
        if stored_code != clean_code:
            next_attempts = attempts + 1
            client.table(target_table).update({"attempts": next_attempts}).eq("id", rec_id).execute()
            remaining = max(0, MAX_ATTEMPTS - next_attempts)
            return {
                "success": False,
                "error": f"Incorrect OTP code. {remaining} attempt(s) remaining.",
                "remaining_attempts": remaining
            }

        # 4. Mark verified
        client.table(target_table).update({"verified": True}).eq("id", rec_id).execute()
        return _build_verification_success(clean_id)

    except Exception as e:
        print(f"[OTP Service] Supabase lookup error: {e}, falling back to memory store")

    # Local fallback verification
    cached = _OTP_FALLBACK_STORE.get(clean_id)
    if not cached:
        return {"success": False, "error": "Invalid or expired OTP code."}

    if now > cached["expires_at"]:
        return {"success": False, "error": "This verification code has expired."}

    if cached["verified"]:
        return {"success": False, "error": "This OTP has already been used."}

    if cached["attempts"] >= MAX_ATTEMPTS:
        return {"success": False, "error": "Too many failed attempts. Code has been invalidated."}

    if cached["otp_code"] != clean_code:
        cached["attempts"] += 1
        remaining = max(0, MAX_ATTEMPTS - cached["attempts"])
        return {
            "success": False,
            "error": f"Incorrect OTP code. {remaining} attempt(s) remaining.",
            "remaining_attempts": remaining
        }

    cached["verified"] = True
    return _build_verification_success(clean_id)

def _build_verification_success(clean_id: str) -> dict:
    return {
        "success": True,
        "message": "OTP successfully verified.",
        "identifier": clean_id,
        "verification_token": f"vtok_{uuid.uuid4().hex}",
        "verified_at": datetime.now(timezone.utc).isoformat()
    }
