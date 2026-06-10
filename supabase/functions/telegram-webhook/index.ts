import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!botToken) {
      return new Response(
        JSON.stringify({ error: "TELEGRAM_BOT_TOKEN not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();

    // Handle pre_checkout_query - MUST respond within 10 seconds
    if (body.pre_checkout_query) {
      const queryId = body.pre_checkout_query.id;

      // Answer pre_checkout_query to approve payment
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pre_checkout_query_id: queryId,
            ok: true,
          }),
        }
      );

      const result = await response.json();
      console.log("Answered pre_checkout_query:", result);

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle successful payment
    if (body.message?.successful_payment) {
      const payment = body.message.successful_payment;
      const telegramId = body.message.from?.id;

      console.log("Received successful_payment:", payment);

      // Find user by telegram_id
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("telegram_id", telegramId)
        .maybeSingle();

      if (user) {
        const amount = payment.total_amount || 0;
        const currency = payment.currency || "XTR";
        const transactionId = payment.telegram_payment_charge_id || `stars_${Date.now()}`;

        // Check if donation already recorded
        const { data: existing } = await supabase
          .from("donations")
          .select("id")
          .eq("transaction_id", transactionId)
          .maybeSingle();

        if (!existing) {
          // Record donation
          await supabase.from("donations").insert([{
            user_id: user.id,
            amount,
            currency,
            payment_method: "telegram_stars",
            transaction_id: transactionId,
            status: "completed",
          }]);

          // Add XP
          const { data: userData } = await supabase
            .from("users")
            .select("total_xp")
            .eq("id", user.id)
            .maybeSingle();

          if (userData) {
            await supabase
              .from("users")
              .update({ total_xp: (userData.total_xp || 0) + Math.floor(amount) })
              .eq("id", user.id);
          }

          // Award achievements
          const { data: existingFirst } = await supabase
            .from("achievements")
            .select("id")
            .eq("user_id", user.id)
            .eq("achievement_key", "FIRST_DONATION")
            .maybeSingle();

          if (!existingFirst) {
            await supabase.from("achievements").insert([{
              user_id: user.id,
              achievement_key: "FIRST_DONATION"
            }]);
          }

          // Check donation milestones
          const { data: dons } = await supabase
            .from("donations")
            .select("amount")
            .eq("user_id", user.id)
            .eq("status", "completed");

          const total = (dons || []).reduce((s: number, d: { amount: number }) => s + Number(d.amount), 0);

          if (total >= 100) {
            const { data: e } = await supabase
              .from("achievements")
              .select("id")
              .eq("user_id", user.id)
              .eq("achievement_key", "DONATED_100")
              .maybeSingle();
            if (!e) {
              await supabase.from("achievements").insert([{
                user_id: user.id,
                achievement_key: "DONATED_100"
              }]);
            }
          }

          if (total >= 1000) {
            const { data: e } = await supabase
              .from("achievements")
              .select("id")
              .eq("user_id", user.id)
              .eq("achievement_key", "DONATED_1000")
              .maybeSingle();
            if (!e) {
              await supabase.from("achievements").insert([{
                user_id: user.id,
                achievement_key: "DONATED_1000"
              }]);
            }
          }
        }
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle other updates (just acknowledge)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

