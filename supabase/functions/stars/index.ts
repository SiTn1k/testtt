import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { amount, userId } = await req.json();
    console.log("[stars] Request received:", { amount, userId });

    if (!amount || amount <= 0) {
      console.log("[stars] Invalid amount:", amount);
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!userId) {
      console.log("[stars] Missing userId");
      return new Response(
        JSON.stringify({ error: "Missing userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    console.log("[stars] BOT_TOKEN exists:", !!BOT_TOKEN);

    if (!BOT_TOKEN) {
      console.log("[stars] TELEGRAM_BOT_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "TELEGRAM_BOT_TOKEN not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[stars] Calling Telegram API...");
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Museum Donation",
          description: `Donation from user ${userId}`,
          payload: `donation_${userId}_${Date.now()}`,
          currency: "XTR",
          prices: [{ label: "Donation", amount }],
          provider_token: "",
        }),
      }
    );

    const tgData = await tgResponse.json();
    console.log("[stars] Telegram response:", { ok: tgData.ok, error: tgData.error_code, desc: tgData.description });

    if (!tgData.ok) {
      console.log("[stars] Telegram API error:", tgData);
      return new Response(
        JSON.stringify({ error: tgData.description || "Telegram createInvoiceLink failed" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[stars] Success, returning invoice link");
    return new Response(
      JSON.stringify({ invoice_link: tgData.result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[stars] Exception:", String(err));
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
