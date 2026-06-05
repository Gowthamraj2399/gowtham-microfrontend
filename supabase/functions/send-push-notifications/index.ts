import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Verify cron secret
  const cronSecret = Deno.env.get("CRON_SECRET");
  const incomingSecret = req.headers.get("x-cron-secret");
  if (!cronSecret || incomingSecret !== cronSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const VAPID_PUBLIC_KEY  = Deno.env.get("VAPID_PUBLIC_KEY")!;
  const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
  const VAPID_SUBJECT     = Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@financeapp.com";

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const today = new Date().toISOString().split("T")[0];

  const { data: subs, error: subsError } = await supabase
    .from("push_subscriptions")
    .select("*");

  if (subsError || !subs?.length) {
    return new Response(JSON.stringify({ sent: 0, error: subsError?.message }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const sub of subs) {
    const [{ data: recurring }, { data: emis }] = await Promise.all([
      supabase
        .from("recurring_payments")
        .select("id, title, amount")
        .eq("user_id", sub.user_id)
        .eq("is_active", true)
        .lte("next_due_date", today),
      supabase
        .from("emis")
        .select("id, title, emi_amount")
        .eq("user_id", sub.user_id)
        .eq("is_active", true)
        .lte("next_due_date", today),
    ]);

    const overdueCount = (recurring?.length ?? 0) + (emis?.length ?? 0);
    if (overdueCount === 0) continue;

    const items = [
      ...(recurring ?? []).map((r: any) => `${r.title} (Rs.${Number(r.amount).toLocaleString("en-IN")})`),
      ...(emis ?? []).map((e: any) => `${e.title} EMI (Rs.${Number(e.emi_amount).toLocaleString("en-IN")})`),
    ];

    const payload = JSON.stringify({
      title: `${overdueCount} payment${overdueCount > 1 ? "s" : ""} overdue`,
      body: items.slice(0, 3).join(", ") + (items.length > 3 ? ` +${items.length - 3} more` : ""),
      icon: "/icons/icon-192x192.png",
      tag: "overdue-payments",
      url: "/notifications",
    });

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sent++;
    } catch (err: any) {
      errors.push(`sub ${sub.id}: ${err.message}`);
      if (err.statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
  }

  return new Response(JSON.stringify({ sent, total: subs.length, errors }), {
    headers: { "Content-Type": "application/json" },
  });
});
