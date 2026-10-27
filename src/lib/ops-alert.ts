// Tells Maks on Telegram when a limiter or the single-use store is down.
// The Upstash database disappeared in October 2026 and every demo request
// 500'd for an unknown time: Hobby keeps logs for an hour, so nothing showed.

const alerted = new Set<string>();

/** console.error every time; Telegram at most once per route per cold start. */
export async function reportRedisDown(route: string, err: unknown): Promise<void> {
  console.error(`[${route}] Redis unavailable:`, err);
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
        text: `⚠️ Upstash Redis is unreachable from ${route}: ${reason.slice(0, 300)}`,
      }),
    });
    if (!res.ok) console.error(`[${route}] ops alert failed: ${res.status}`);
  } catch (alertErr) {
    console.error(`[${route}] ops alert failed:`, alertErr);
  }
}
