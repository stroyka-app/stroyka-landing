// Tells Maks on Telegram when the rate-limit guard (landing-guard) cannot
// answer. In October 2026 the old Upstash store vanished and every demo
// request 500'd for an unknown time: Hobby keeps logs for an hour, so
// nothing showed.

const alerted = new Set<string>();

/** console.error every time; Telegram at most once per route per cold start. */
export async function reportGuardDown(route: string, err: unknown): Promise<void> {
  console.error(`[${route}] rate-limit guard unavailable:`, err);
  if (alerted.has(route)) return;
  alerted.add(route);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const reason = err instanceof Error ? err.message : String(err);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `⚠️ Rate-limit guard (landing-guard) unavailable from ${route}: ${reason.slice(0, 300)}`,
      }),
    });
    if (!res.ok) console.error(`[${route}] ops alert failed: ${res.status}`);
  } catch (alertErr) {
    console.error(`[${route}] ops alert failed:`, alertErr);
  }
}
