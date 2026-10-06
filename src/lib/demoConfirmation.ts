// The email a visitor gets right after the demo form: a short letter from
// Maks in the visitor's site language, in the same look and voice as the
// app's founder welcome (job-costing-app supabase/functions/send-welcome).
// Voice rules: no em-dashes, no semicolons, no promised deadline (Maks
// answers himself, often across time zones), never "the team".

export type DemoLang = "en" | "ru" | "es";

export interface DemoConfirmation {
  from: string;
  subject: string;
  text: string;
  html: string;
}

interface LetterParts {
  lang: DemoLang;
  subject: string;
  greeting: string;
  paragraphs: string[];
  signName: string;
  signTitle: string;
  footer: string;
}

export function demoLang(locale: string | undefined): DemoLang {
  return locale === "ru" || locale === "es" ? locale : "en";
}

function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first.length < 2 ? "" : first;
}

function partsFor(lang: DemoLang, name: string): LetterParts {
  if (lang === "ru") {
    return {
      lang,
      subject: "Ваша заявка на демо Stroyka",
      greeting: name ? `Здравствуйте, ${name}!` : "Здравствуйте!",
      paragraphs: [
        "Это Макс, основатель Stroyka. Спасибо за заявку на демо. Я её получил и сам напишу вам, чтобы договориться об удобном времени.",
        "Чтобы сэкономить время нам обоим, расскажите немного о вашей компании и о том, как вы ведёте объекты. Просто ответьте на это письмо, оно придёт прямо мне.",
      ],
      signName: "Макс",
      signTitle: "Основатель Stroyka",
      footer: "Вы получили это письмо, потому что оставили заявку на демо на getstroyka.com.",
    };
  }
  if (lang === "es") {
    return {
      lang,
      subject: "Su solicitud de demo de Stroyka",
      greeting: name ? `Hola, ${name}:` : "Hola:",
      paragraphs: [
        "Soy Maks, fundador de Stroyka. Gracias por solicitar una demo. Recibí su solicitud y le escribiré yo mismo para acordar un horario que le convenga.",
        "Para ahorrarnos tiempo a los dos, cuénteme un poco sobre su empresa y cómo lleva sus obras. Solo responda a este correo. Me llega directamente a mí.",
      ],
      signName: "Maks",
      signTitle: "Fundador de Stroyka",
      footer: "Recibe este correo porque solicitó una demo en getstroyka.com.",
    };
  }
  return {
    lang,
    subject: "Your Stroyka demo request",
    greeting: name ? `Hi ${name},` : "Hi there,",
    paragraphs: [
      "Maks here, founder of Stroyka. Thanks for asking for a demo. I got your request and I'll write to you myself to find a time that works.",
      "To save us both time, tell me a little about your company and how you run your jobs. Just reply to this email. It comes straight to me.",
    ],
    signName: "Maks",
    signTitle: "Founder, Stroyka",
    footer: "You're getting this because you asked for a demo on getstroyka.com.",
  };
}

export function buildDemoConfirmation(input: { lang: DemoLang; name: string }): DemoConfirmation {
  const p = partsFor(input.lang, firstName(input.name));
  const text = [p.greeting, ...p.paragraphs, `${p.signName}\n${p.signTitle}`].join("\n\n");
  return {
    from: input.lang === "ru" ? "Макс · Stroyka <hello@getstroyka.com>" : "Maks · Stroyka <hello@getstroyka.com>",
    subject: p.subject,
    text,
    html: renderLetter(p),
  };
}

// The app's palette (AppTokens), by name. Table layout and inline styles
// because email clients ignore most CSS. Light only, like the app.
const SOFT_CREAM = "#EFE8DA";
const SURFACE = "#FFFDF7";
const BORDER_SOFT = "#E1D8C9";
const INK = "#18251F";
const MUTED = "#5F6963";
const SAGE = "#3F6B55";
const SAGE_DEEP = "#0F3027";
const FOREST = "#123B2E";
const FOOTER = "#A3A89F";
const ICON_URL = "https://www.getstroyka.com/apple-touch-icon.png";
const SITE_URL = "https://getstroyka.com";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 18px 0; font-family:${FONT}; font-size:16px; line-height:1.6; color:${INK};">${escapeHtml(text)}</p>`;
}

function renderLetter(p: LetterParts): string {
  const body = [p.greeting, ...p.paragraphs].map(paragraph).join("\n");
  return `<!DOCTYPE html>
<html lang="${p.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(p.subject)}</title>
</head>
<body style="margin:0; padding:0; width:100%; background-color:${SOFT_CREAM};">
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">${escapeHtml(p.paragraphs[0])}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${SOFT_CREAM};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px; width:100%;">
<tr><td style="padding:0 4px 16px 4px;">
<img src="${ICON_URL}" alt="Stroyka" width="36" height="36" style="display:inline-block; vertical-align:middle; border:0; border-radius:9px; margin-right:10px;"><span style="vertical-align:middle; font-family:${FONT}; font-size:19px; font-weight:700; letter-spacing:-0.2px; color:${SAGE_DEEP};">Stroyka</span>
</td></tr>
<tr><td style="background-color:${SURFACE}; border:1px solid ${BORDER_SOFT}; border-top:3px solid ${FOREST}; border-radius:14px; padding:34px 32px 30px 32px;">
${body}
<p style="margin:10px 0 0 0; font-family:${FONT}; font-size:16px; line-height:1.4; font-weight:600; color:${INK};">${escapeHtml(p.signName)}</p>
<p style="margin:2px 0 0 0; font-family:${FONT}; font-size:14px; line-height:1.5; color:${MUTED};">${escapeHtml(p.signTitle)}<br><a href="${SITE_URL}" style="color:${SAGE}; text-decoration:none;">getstroyka.com</a></p>
</td></tr>
<tr><td style="padding:20px 8px 0 8px; text-align:center; font-family:${FONT}; font-size:11px; line-height:1.5; color:${FOOTER};">${escapeHtml(p.footer)}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
