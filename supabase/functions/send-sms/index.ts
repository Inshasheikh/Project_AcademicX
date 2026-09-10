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
const APP_NAME = Deno.env.get("APP_NAME") || "Academia";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();
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

    // 0. Rate limiting check (1 min cooldown, 5 max requests per hour)
    try {
      const { data: rlData } = await supabase.rpc("check_rate_limit", {
        p_key: cleanPhone,
        p_action: "send_phone_otp",
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
              : "Hourly SMS limit exceeded. Please try again later.",
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
    if (FAST2SMS_API_KEY) {
      const smsMessage = `Your ${APP_NAME} verification code is: ${otpCode}. Valid for 5 minutes. Do not share.`;
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
      }
    }

    // Fallback in case of out of credits or local testing
    return new Response(
      JSON.stringify({
        success: true,
        simulated: true,
        otp: otpCode,
        message: "OTP generated (Gateway notice: Fast2SMS simulated mode).",
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
