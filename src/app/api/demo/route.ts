import { NextResponse } from "next/server";

interface DemoRequest {
  name: string;
  company: string;
  crewSize: string;
  email: string;
  phone?: string;
  challenge?: string;
}

async function sendEmail(data: DemoRequest): Promise<void> {
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
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error: ${res.status} ${body}`);
  }
}

async function sendTelegram(data: DemoRequest): Promise<void> {
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
    const data: DemoRequest = await request.json();

    if (!data.name || !data.company || !data.crewSize || !data.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const results = await Promise.allSettled([sendEmail(data), sendTelegram(data)]);

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Notification error:", result.reason);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Demo route error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
