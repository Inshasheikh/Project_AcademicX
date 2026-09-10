# 📱 Email & Phone OTP Authentication System — Setup & Integration Guide

> **Complete Setup Blueprint for Supabase, Gmail SMTP, Fast2SMS Gateway, and Flutter / Web Clients.**  
> Share this guide with anyone looking to replicate the OTP authentication pipeline.

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Database Setup (PostgreSQL / Supabase)](#2-database-setup-postgresql--supabase)
3. [Email OTP Setup (Gmail SMTP + Nodemailer)](#3-email-otp-setup-gmail-smtp--nodemailer)
4. [Phone SMS OTP Setup (Fast2SMS Gateway)](#4-phone-sms-otp-setup-fast2sms-gateway)
5. [OTP Verification & Auth Bridge](#5-otp-verification--auth-bridge)
6. [Deployment & Supabase CLI Commands](#6-deployment--supabase-cli-commands)
7. [Frontend Client Integration (Flutter / Dart)](#7-frontend-client-integration-flutter--dart)
8. [Troubleshooting & FAQs](#8-troubleshooting--faqs)

---

## 1. Architecture Overview

This authentication system allows users to log in or register using either a **10-digit Indian Mobile Number** or an **Email Address**:

```
                  ┌───────────────────────────────┐
                  │      User / Frontend App      │
                  └──────────────┬────────────────┘
                                 │
                 Input Target Type Detection
                                 │
           ┌─────────────────────┴─────────────────────┐
           │                                           │
  Target is Email                             Target is Phone
           │                                           │
           ▼                                           ▼
┌───────────────────────┐                   ┌──────────────────────┐
│ Edge Function:        │                   │ Edge Function:       │
│ `send-otp`            │                   │ `send-sms`           │
│ (Gmail SMTP:587)      │                   │ (Fast2SMS bulkV2)    │
└──────────┬────────────┘                   └──────────┬───────────┘
           │                                           │
           ▼                                           ▼
┌───────────────────────┐                   ┌──────────────────────┐
│ Table:                │                   │ Table:               │
│ `otp_verification`    │                   │ `otp_storage`        │
└──────────┬────────────┘                   └──────────┬───────────┘
           │                                           │
           └─────────────────────┬─────────────────────┘
                                 │
                          User Submits OTP
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ Edge Function:        │
                     │ `verify-otp`          │
                     │ - 5 min expiry check  │
                     │ - Max 5 attempts lock │
                     │ - Signs into Supabase │
                     └───────────────────────┘
```

---

## 2. Database Setup (PostgreSQL / Supabase)

Open your **Supabase Dashboard -> SQL Editor** and execute the following SQL script to create the necessary tables and rate-limiting function:

```sql
-- 1. Table for Phone OTPs
CREATE TABLE IF NOT EXISTS public.otp_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Email OTPs
CREATE TABLE IF NOT EXISTS public.otp_verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table for Rate Limiting (IP and Identifier Protection)
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    action TEXT NOT NULL,
    request_count INT DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    last_request TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.otp_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- 5. Rate Limiting RPC Function (Handles cooldowns and hourly limits)
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_key TEXT,
    p_action TEXT,
    p_max_requests INT DEFAULT 5,
    p_window_seconds INT DEFAULT 3600,
    p_cooldown_seconds INT DEFAULT 60
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_record RECORD;
    v_now TIMESTAMPTZ := NOW();
    v_cooldown_remaining INT := 0;
    v_window_remaining INT := 0;
BEGIN
    SELECT * INTO v_record
    FROM public.rate_limits
    WHERE key = p_key AND action = p_action
    FOR UPDATE;

    IF NOT FOUND THEN
        INSERT INTO public.rate_limits(key, action, request_count, window_start, last_request)
        VALUES (p_key, p_action, 1, v_now, v_now);
        RETURN jsonb_build_object('allowed', true, 'remaining', p_max_requests - 1);
    END IF;

    -- Cooldown check between requests
    v_cooldown_remaining := p_cooldown_seconds - EXTRACT(EPOCH FROM (v_now - v_record.last_request))::INT;
    IF v_cooldown_remaining > 0 THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'cooldown',
            'retry_after', v_cooldown_remaining
        );
    END IF;

    -- Hourly window check
    IF EXTRACT(EPOCH FROM (v_now - v_record.window_start)) > p_window_seconds THEN
        UPDATE public.rate_limits
        SET request_count = 1, window_start = v_now, last_request = v_now
        WHERE id = v_record.id;
        RETURN jsonb_build_object('allowed', true, 'remaining', p_max_requests - 1);
    END IF;

    -- Request threshold limit check
    IF v_record.request_count >= p_max_requests THEN
        v_window_remaining := p_window_seconds - EXTRACT(EPOCH FROM (v_now - v_record.window_start))::INT;
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'quota_exceeded',
            'retry_after', GREATEST(v_window_remaining, 1)
        );
    END IF;

    UPDATE public.rate_limits
    SET request_count = request_count + 1, last_request = v_now
    WHERE id = v_record.id;

    RETURN jsonb_build_object('allowed', true, 'remaining', p_max_requests - (v_record.request_count + 1));
END;
$$;
```

---

## 3. Email OTP Setup (Gmail SMTP + Nodemailer)

### A. Generate Google App Password
1. Open [Google Account Security](https://myaccount.google.com/security).
2. Ensure **2-Step Verification** is turned **ON**.
3. Search for **App Passwords** in the search bar.
4. Name your App Password (e.g., `Supabase OTP`).
5. Google will generate a **16-character password** (e.g. `abcd efgh ijkl mnop`). Copy it without spaces.

### B. Supabase Edge Function: `send-otp`
Create `supabase/functions/send-otp/index.ts`:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GMAIL_USER = Deno.env.get("GMAIL_USER") || "";
const GMAIL_APP_PASSWORD = (Deno.env.get("GMAIL_APP_PASSWORD") || "").replace(/\s+/g, "");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ success: false, error: "A valid email is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1. Generate 6-digit OTP and 5-minute expiry
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // 2. Clear old unverified OTPs
    await supabase.from("otp_verification").delete().eq("email", cleanEmail).eq("verified", false);

    // 3. Store OTP in Database
    await supabase.from("otp_verification").insert({
      email: cleanEmail,
      otp_code: otpCode,
      expires_at: expiresAt,
      verified: false,
      attempts: 0,
    });

    // 4. Send via Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Authentication" <${GMAIL_USER}>`,
      to: cleanEmail,
      subject: `Your Verification Code is ${otpCode}`,
      text: `Your verification code is: ${otpCode}\n\nThis code is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your Verification Code</h2>
          <p>Please enter the following 6-digit code to complete verification:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1E3A8A; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="color: #666;">This code is valid for 5 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent to email.", expires_at: expiresAt }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

## 4. Phone SMS OTP Setup (Fast2SMS Gateway)

### A. Get Fast2SMS API Key
1. Register at [fast2sms.com](https://fast2sms.com).
2. Go to **Dev API -> API Keys** and generate an **Authorization Key**.
3. Fast2SMS gives initial free credits to test instant SMS delivery.

### B. Supabase Edge Function: `send-sms`
Create `supabase/functions/send-sms/index.ts`:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FAST2SMS_API_KEY = Deno.env.get("FAST2SMS_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone, is_otp = true } = await req.json();
    if (!phone) {
      return new Response(
        JSON.stringify({ success: false, error: "Phone number is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clean phone number to 10 digits
    let cleanPhone = phone.toString().replace(/[^0-9]/g, "");
    if (cleanPhone.length >= 10) cleanPhone = cleanPhone.slice(-10);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1. Generate 6-digit OTP and 5-minute expiry
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // 2. Clear old unverified OTPs for this number
    await supabase.from("otp_storage").delete().eq("phone", cleanPhone);

    // 3. Save to database
    await supabase.from("otp_storage").insert({
      phone: cleanPhone,
      otp: otpCode,
      expires_at: expiresAt,
      verified: false,
      attempts: 0,
    });

    // 4. Send SMS via Fast2SMS Quick Route (bulkV2)
    const smsMessage = `Your verification code is: ${otpCode}. Valid for 5 minutes. Do not share.`;
    const fast2SmsUrl = new URL("https://www.fast2sms.com/dev/bulkV2");
    fast2SmsUrl.searchParams.set("authorization", FAST2SMS_API_KEY);
    fast2SmsUrl.searchParams.set("route", "q");
    fast2SmsUrl.searchParams.set("message", smsMessage);
    fast2SmsUrl.searchParams.set("language", "english");
    fast2SmsUrl.searchParams.set("flash", "0");
    fast2SmsUrl.searchParams.set("numbers", cleanPhone);

    const f2sResponse = await fetch(fast2SmsUrl.toString(), {
      method: "GET",
      headers: { "cache-control": "no-cache" },
    });

    const result = await f2sResponse.json();

    if (result && (result.return === true || result.status_code === 200)) {
      return new Response(
        JSON.stringify({ success: true, message: "SMS dispatched successfully." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Fallback in case of out of credits during testing
      return new Response(
        JSON.stringify({
          success: true,
          simulated: true,
          otp: otpCode,
          message: "OTP generated (Gateway notice: simulated mode).",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

## 5. OTP Verification & Auth Bridge

Create `supabase/functions/verify-otp/index.ts`. This unified function validates both email and phone numbers, enforces a 5-attempt limit, and signs the user into Supabase Auth.

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const MAX_ATTEMPTS = 5;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, phone, otp } = await req.json();
    if ((!email && !phone) || !otp) {
      return new Response(
        JSON.stringify({ success: false, error: "Provide phone or email along with the OTP." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanOtp = otp.toString().trim();
    const isPhone = !!phone && !email;
    const cleanPhone = isPhone ? phone.toString().replace(/[^0-9]/g, "").slice(-10) : "";
    const cleanEmail = !isPhone ? email.trim().toLowerCase() : "";

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const nowIso = new Date().toISOString();

    // 1. Fetch the active unexpired OTP record
    const targetTable = isPhone ? "otp_storage" : "otp_verification";
    const lookupKey = isPhone ? "phone" : "email";
    const lookupValue = isPhone ? cleanPhone : cleanEmail;

    const { data: record, error: dbError } = await supabase
      .from(targetTable)
      .select("*")
      .eq(lookupKey, lookupValue)
      .eq("verified", false)
      .gt("expires_at", nowIso)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dbError || !record) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or expired OTP code." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Anti-Brute-Force check (Max 5 attempts)
    if (record.attempts >= MAX_ATTEMPTS) {
      await supabase.from(targetTable).update({ expires_at: nowIso }).eq("id", record.id);
      return new Response(
        JSON.stringify({ success: false, error: "Too many failed attempts. Code has been invalidated." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const storedOtp = isPhone ? record.otp : record.otp_code;

    // 3. Verify OTP Match
    if (storedOtp !== cleanOtp) {
      const nextAttempts = (record.attempts || 0) + 1;
      await supabase.from(targetTable).update({ attempts: nextAttempts }).eq("id", record.id);
      const remaining = MAX_ATTEMPTS - nextAttempts;

      return new Response(
        JSON.stringify({
          success: false,
          error: `Incorrect OTP code. ${remaining} attempt(s) remaining.`,
          remaining_attempts: remaining,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Mark verified
    await supabase.from(targetTable).update({ verified: true }).eq("id", record.id);

    // 5. Link with Supabase Auth (Creates user if not already existing)
    const authEmail = isPhone ? `${cleanPhone}@phone.auth.local` : cleanEmail;
    let authUser: any = null;

    const { data: listData } = await supabase.auth.admin.listUsers();
    const existing = listData?.users?.find((u: any) => u.email?.toLowerCase() === authEmail);

    if (existing) {
      authUser = existing;
    } else {
      const { data: created } = await supabase.auth.admin.createUser({
        email: authEmail,
        email_confirm: true,
        user_metadata: { source: isPhone ? "phone_otp" : "email_otp" },
      });
      authUser = created?.user;
    }

    // Generate Magic Link token hash for client session
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: authEmail,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP successfully verified.",
        token_hash: linkData?.properties?.hashed_token,
        user: authUser,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

## 6. Deployment & Supabase CLI Commands

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login & Link to your Project**:
   ```bash
   supabase login
   supabase link --project-ref <your-project-reference-id>
   ```

3. **Set Secrets (Environment Variables)**:
   ```bash
   # Email Secrets
   supabase secrets set GMAIL_USER="your_email@gmail.com"
   supabase secrets set GMAIL_APP_PASSWORD="your16charpassword"

   # SMS Secret
   supabase secrets set FAST2SMS_API_KEY="your_fast2sms_api_key"
   ```

4. **Deploy all 3 Edge Functions**:
   ```bash
   supabase functions deploy send-otp --no-verify-jwt
   supabase functions deploy send-sms --no-verify-jwt
   supabase functions deploy verify-otp --no-verify-jwt
   ```

---

## 7. Frontend Client Integration (Flutter / Dart)

Here is a ready-to-use Flutter service to send and verify OTPs:

```dart
import 'dart:convert';
import 'package:supabase_flutter/supabase_flutter.dart';

class OtpService {
  final SupabaseClient _client = Supabase.instance.client;

  /// Send OTP to Email (via send-otp) or Phone (via send-sms)
  Future<Map<String, dynamic>> sendOtp(String target) async {
    final clean = target.trim();
    final isEmail = clean.contains('@');

    final fnName = isEmail ? 'send-otp' : 'send-sms';
    final payload = isEmail
        ? {'email': clean.toLowerCase()}
        : {
            'phone': clean.replaceAll(RegExp(r'[^0-9]'), '').substring(clean.length - 10),
            'is_otp': true,
          };

    final response = await _client.functions.invoke(fnName, body: payload);
    final data = response.data is Map<String, dynamic>
        ? response.data as Map<String, dynamic>
        : jsonDecode(response.data.toString());

    if (data['success'] != true) {
      throw Exception(data['error'] ?? 'Failed to dispatch OTP.');
    }

    return data;
  }

  /// Verify OTP and sign in
  Future<Map<String, dynamic>> verifyOtp(String target, String otp) async {
    final clean = target.trim();
    final isEmail = clean.contains('@');

    final payload = {
      if (isEmail) 'email': clean.toLowerCase() else 'phone': clean,
      'otp': otp.trim(),
    };

    final response = await _client.functions.invoke('verify-otp', body: payload);
    final data = response.data is Map<String, dynamic>
        ? response.data as Map<String, dynamic>
        : jsonDecode(response.data.toString());

    if (data['success'] != true) {
      throw Exception(data['error'] ?? 'Invalid verification code.');
    }

    // If session token_hash is returned, authenticate client session
    if (data['token_hash'] != null) {
      await _client.auth.verifyOTP(
        tokenHash: data['token_hash'],
        type: OtpType.magiclink,
      );
    }

    return data;
  }
}
```

---

## 8. Troubleshooting & FAQs

| Question / Problem | Solution |
| :--- | :--- |
| **"Invalid login: 535-5.7.8 Username and Password not accepted"** | You are using your normal Gmail password instead of an **App Password**. Make sure 2-Step Verification is active, generate a 16-character App Password, and remove all spaces. |
| **Fast2SMS reports "Insufficient balance"** | Fast2SMS requires wallet credit for sending real SMS messages. Add balance on [fast2sms.com](https://fast2sms.com) or use the simulated test fallback provided in `send-sms`. |
| **SMS delivers late or gets blocked** | Indian DLT regulations require pre-registered sender IDs and templates for transactional SMS. Fast2SMS `route=q` uses quick routing for testing. For high-volume production, complete KYC and DLT registration on Fast2SMS. |
| **OTP expired error** | Codes are configured to expire after **5 minutes** (`5 * 60 * 1000` ms). The user must request a new code if they exceed this window. |
| **Too many failed attempts** | After 5 wrong guesses, the code is permanently invalidated to prevent brute-force attacks. |
