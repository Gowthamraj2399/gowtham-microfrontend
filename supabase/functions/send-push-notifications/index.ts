/**
 * Supabase Edge Function: send-push-notifications
 *
 * Called every 8 hours by cron-job.org.
 * Reads all push subscriptions, checks each user's overdue items,
 * and sends a VAPID Web Push notification.
 *
 * Required Edge Function secrets (set via `supabase secrets set`):
 *   VAPID_PUBLIC_KEY   - base64url public key (from npx web-push generate-vapid-keys)
 *   VAPID_PRIVATE_KEY  - base64url private key (keep secret!)
 *   VAPID_SUBJECT      - mailto:your@email.com
 *   CRON_SECRET        - a random secret string you put in cron-job.org headers
 *   SUPABASE_URL       - auto-injected by Supabase
 *   SUPABASE_SERVICE_ROLE_KEY - auto-injected by Supabase
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── VAPID JWT signing (Web Crypto — no Node built-ins needed) ─────────────────

function base64UrlToUint8Array(base64url: string): Uint8Array {
  const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

function uint8ArrayToBase64Url(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function buildVapidJwt(audience: string, subject: string, privateKeyB64: string): Promise<string> {
  const header = { alg: "ES256", typ: "JWT" };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: subject,
  };

  const enc = new TextEncoder();
  const headerB64  = uint8ArrayToBase64Url(enc.encode(JSON.stringify(header)));
  const payloadB64 = uint8ArrayToBase64Url(enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const privateKeyBytes = base64UrlToUint8Array(privateKeyB64);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    privateKeyBytes,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    cryptoKey,
    enc.encode(signingInput)
  );

  return `${signingInput}.${uint8ArrayToBase64Url(new Uint8Array(signature))}`;
}

// ── Web Push encryption (RFC 8291 / RFC 8188) ─────────────────────────────────

async function encryptPayload(
  payloadStr: string,
  p256dhB64: string,
  authB64: string
): Promise<{ ciphertext: Uint8Array; salt: Uint8Array; serverPublicKey: Uint8Array }> {
  const enc = new TextEncoder();
  const plaintext = enc.encode(payloadStr);

  // Generate server ephemeral ECDH key pair
  const serverKeyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );

  // Import client public key
  const clientPublicKeyBytes = base64UrlToUint8Array(p256dhB64);
  const clientPublicKey = await crypto.subtle.importKey(
    "raw",
    clientPublicKeyBytes,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );

  // ECDH shared secret
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: "ECDH", public: clientPublicKey },
    serverKeyPair.privateKey,
    256
  );

  // Export server public key
  const serverPublicKeyBytes = new Uint8Array(
    await crypto.subtle.exportKey("raw", serverKeyPair.publicKey)
  );

  const authBytes = base64UrlToUint8Array(authB64);
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // HKDF for content encryption key and nonce (RFC 8291)
  const hkdfInput = await crypto.subtle.importKey("raw", new Uint8Array(sharedSecret), "HKDF", false, ["deriveBits"]);

  async function hkdf(ikm: CryptoKey, salt: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
    const bits = await crypto.subtle.deriveBits(
      { name: "HKDF", hash: "SHA-256", salt, info },
      ikm,
      length * 8
    );
    return new Uint8Array(bits);
  }

  // auth secret
  const authInfo = enc.encode("Content-Encoding: auth\0");
  const prk = await hkdf(hkdfInput, authBytes, authInfo, 32);

  const prkKey = await crypto.subtle.importKey("raw", prk, "HKDF", false, ["deriveBits"]);

  // Context = 0x00 || len(clientPublicKey) || clientPublicKey || len(serverPublicKey) || serverPublicKey
  const context = new Uint8Array(1 + 2 + clientPublicKeyBytes.length + 2 + serverPublicKeyBytes.length);
  let offset = 0;
  context[offset++] = 0x00;
  new DataView(context.buffer).setUint16(offset, clientPublicKeyBytes.length, false); offset += 2;
  context.set(clientPublicKeyBytes, offset); offset += clientPublicKeyBytes.length;
  new DataView(context.buffer).setUint16(offset, serverPublicKeyBytes.length, false); offset += 2;
  context.set(serverPublicKeyBytes, offset);

  const cekInfo  = new Uint8Array([...enc.encode("Content-Encoding: aesgcm\0"), ...context]);
  const nonceInfo = new Uint8Array([...enc.encode("Content-Encoding: nonce\0"), ...context]);

  const cek   = await hkdf(prkKey, salt, cekInfo, 16);
  const nonce = await hkdf(prkKey, salt, nonceInfo, 12);

  // Encrypt with AES-128-GCM
  const aesKey = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);

  // Pad plaintext: 2-byte pad length (0) + plaintext
  const padded = new Uint8Array(2 + plaintext.length);
  padded.set(plaintext, 2);

  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aesKey, padded)
  );

  return { ciphertext, salt, serverPublicKey: serverPublicKeyBytes };
}

async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
) {
  const endpointUrl = new URL(subscription.endpoint);
  const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;

  const jwt = await buildVapidJwt(audience, vapidSubject, vapidPrivateKey);

  const { ciphertext, salt, serverPublicKey } = await encryptPayload(
    payload,
    subscription.p256dh,
    subscription.auth
  );

  const response = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "aesgcm",
      "Encryption": `salt=${uint8ArrayToBase64Url(salt)}`,
      "Crypto-Key": `dh=${uint8ArrayToBase64Url(serverPublicKey)};p256ecdsa=${vapidPublicKey}`,
      "Authorization": `vapid t=${jwt},k=${vapidPublicKey}`,
      "TTL": "86400",
    },
    body: ciphertext,
  });

  if (!response.ok && response.status !== 201) {
    const err = new Error(`Push failed: ${response.status}`);
    (err as any).statusCode = response.status;
    throw err;
  }
}

// ── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Verify cron secret via custom header (Authorization is reserved by Supabase gateway)
  const cronSecret = Deno.env.get("CRON_SECRET");
  const incomingSecret = req.headers.get("x-cron-secret");
  if (!cronSecret || incomingSecret !== cronSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const VAPID_PUBLIC_KEY  = Deno.env.get("VAPID_PUBLIC_KEY")!;
  const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
  const VAPID_SUBJECT     = Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@financeapp.com";

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get today's date string (UTC is fine — close enough for overdue checks)
  const today = new Date().toISOString().split("T")[0];

  // Fetch all push subscriptions
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
    // Get this user's overdue items
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
      ...(recurring ?? []).map((r) => `${r.title} (₹${Number(r.amount).toLocaleString("en-IN")})`),
      ...(emis ?? []).map((e) => `${e.title} EMI (₹${Number(e.emi_amount).toLocaleString("en-IN")})`),
    ];

    const payload = JSON.stringify({
      title: `${overdueCount} payment${overdueCount > 1 ? "s" : ""} overdue`,
      body: items.slice(0, 3).join(", ") + (items.length > 3 ? ` +${items.length - 3} more` : ""),
      icon: "/icons/icon-192x192.png",
      tag: "overdue-payments",
      url: "/notifications",
    });

    try {
      await sendWebPush(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        payload,
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY,
        VAPID_SUBJECT
      );
      sent++;
    } catch (err: any) {
      errors.push(`sub ${sub.id}: ${err.message}`);
      // 410 Gone = subscription expired, clean it up
      if (err.statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
  }

  return new Response(JSON.stringify({ sent, total: subs.length, errors }), {
    headers: { "Content-Type": "application/json" },
  });
});
