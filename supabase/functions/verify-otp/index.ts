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

    // 5. Link with Supabase Auth or Profile
    const identifier = isPhone ? cleanPhone : cleanEmail;

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP successfully verified.",
        identifier,
        verified_at: nowIso,
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
