import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ratelimit } from "@/lib/ratelimit";
import { demoFormSchema } from "@/lib/schemas";

function buildDemoEmailHtml(data: {
  name: string;
  company: string;
  crewSize: string;
  email: string;
  phone?: string;
  challenge?: string;
}): string {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 12px;color:#84a98c;font-size:13px;font-weight:600;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 12px;color:#cad2c5;font-size:14px;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#2f3e46;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <!-- Header -->
    <div style="background:#354f52;border-radius:12px 12px 0 0;padding:24px 28px;border-bottom:2px solid #52796f;">
      <div style="display:flex;align-items:center;gap:12px;">
        <!-- Cornerstone mark approximation -->
        <div style="display:inline-block;">
          <div style="width:28px;height:5px;background:#84a98c;border-radius:2px;margin-bottom:4px;"></div>
          <div style="width:20px;height:5px;background:#cad2c5;border-radius:2px;margin-bottom:4px;"></div>
          <div style="width:12px;height:5px;background:rgba(202,210,197,0.4);border-radius:2px;"></div>
        </div>
        <span style="color:#cad2c5;font-size:18px;font-weight:700;letter-spacing:0.5px;margin-left:8px;">New Demo Request</span>
      </div>
    </div>

    <!-- Body -->
    <div style="background:#354f52;border-radius:0 0 12px 12px;padding:24px 28px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", data.name)}
        ${row("Company", data.company)}
        ${row("Crew Size", data.crewSize)}
        ${row("Email", `<a href="mailto:${data.email}" style="color:#52796f;text-decoration:underline;">${data.email}</a>`)}
        ${row("Phone", data.phone || "—")}
        ${data.challenge ? row("Challenge", data.challenge) : ""}
      </table>

      <!-- Reply button -->
      <div style="margin-top:24px;text-align:center;">
        <a href="mailto:${data.email}?subject=Re: Your Stroyka Demo Request&body=Hi ${data.name},%0A%0AThanks for your interest in Stroyka!%0A%0A"
           style="display:inline-block;background:#52796f;color:#ffffff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
          Reply to ${data.name} →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <p style="text-align:center;color:rgba(132,169,140,0.4);font-size:11px;margin-top:16px;">
      Stroyka Demo Request · getstroyka.com
    </p>
  </div>
</body>
</html>`;
}

async function sendEmail(data: {
  name: string;
  company: string;
  crewSize: string;
  email: string;
  phone?: string;
  challenge?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Stroyka <noreply@getstroyka.com>",
      to: ["hello@getstroyka.com"],
      subject: `Demo Request from ${data.name} at ${data.company}`,
      text: [
        `Name: ${data.name}`,
        `Company: ${data.company}`,
        `Crew Size: ${data.crewSize}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "Not provided"}`,
        `Challenge: ${data.challenge || "Not provided"}`,
      ].join("\n"),
      html: buildDemoEmailHtml(data),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error: ${res.status} ${body}`);
  }
}

async function sendTelegram(data: {
  name: string;
  company: string;
  crewSize: string;
  email: string;
  phone?: string;
  challenge?: string;
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram env vars not set — skipping notification");
    return;
  }

  const message = [
    "🏗 *New Demo Request*",
    "",
    `*Name:* ${data.name}`,
    `*Company:* ${data.company}`,
    `*Crew Size:* ${data.crewSize}`,
    `*Email:* ${data.email}`,
    `*Phone:* ${data.phone || "—"}`,
    data.challenge ? `\n*Challenge:*\n${data.challenge}` : "",
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram error: ${res.status} ${body}`);
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting (skip if Upstash not configured)
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const headersList = await headers();
      const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    // Validate with Zod
    const body = await request.json();
    const result = demoFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, company, crewSize, email, phone, challenge } = result.data;
    const data = { name, company, crewSize, email, phone, challenge };

    const [emailResult, telegramResult] = await Promise.allSettled([
      sendEmail(data),
      sendTelegram(data),
    ]);

    if (emailResult.status === "rejected") {
      console.error("Email send failed:", emailResult.reason);
      return NextResponse.json(
        { error: "Failed to send. Please email us directly." },
        { status: 500 }
      );
    }

    if (telegramResult.status === "rejected") {
      console.error("Telegram notify failed (non-fatal):", telegramResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Demo route error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
