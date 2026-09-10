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
const APP_NAME = Deno.env.get("APP_NAME") || "REDDOT";

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

    // 0. Rate limiting check (1 min cooldown, 5 max requests per hour)
    try {
      const { data: rlData } = await supabase.rpc("check_rate_limit", {
        p_key: cleanEmail,
        p_action: "send_email_otp",
        p_max_requests: 5,
        p_window_seconds: 3600,
        p_cooldown_seconds: 60,
      });
      if (rlData && !rlData.allowed) {
        return new Response(
          JSON.stringify({
            success: false,
            error: rlData.reason === "cooldown"
              ? `Please wait ${rlData.retry_after} seconds before requesting a new OTP.`
              : "Hourly OTP limit exceeded. Please try again later.",
            cooldown: true,
            retry_after: rlData.retry_after,
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (_rlErr) {
      // Continue if RPC skipped
    }

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
    if (GMAIL_USER) {
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
        from: `"${APP_NAME}" <${GMAIL_USER}>`,
        to: cleanEmail,
        subject: `Your Verification Code is ${otpCode}`,
        text: `Your verification code is: ${otpCode}\n\nThis code is valid for 5 minutes. Do not share it with anyone.\n\n— The ${APP_NAME} Team`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0284c7; margin-top: 0;">${APP_NAME} Verification</h2>
            <p>Please enter the following 6-digit code to complete verification:</p>
            <div style="font-size: 34px; font-weight: bold; letter-spacing: 6px; color: #0369a1; margin: 20px 0; background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center;">
              ${otpCode}
            </div>
            <p style="color: #64748b; font-size: 13px;">This code is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
          </div>
        `,
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent to email.", expires_at: expiresAt, demo_code: otpCode }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
