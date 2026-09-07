import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

// ────────────────────────────────────────────────────────────────────────────
// The Open Graph card: a commissioned illustration with the wordmark set over
// it, not a screenshot and not a layout of coloured rectangles.
//
// It replaces `public/og-image.png` from 2026-04-06, which had a flat sage
// circle overlapping its own text and a "Flat Pricing" claim that stopped
// being true the day Starter and Pro shipped.
//
// The artwork is generated, then cropped to 1200×630 and committed as a real
// asset. It is deliberately WORDLESS: image models cannot set type, so every
// letter here is drawn by satori from the site's own faces. That split is the
// whole trick — the model makes the picture, the renderer makes the words.
//
// The drawing was directed to leave its entire left half empty so the type has
// somewhere to live without a scrim fighting the art.
//
// The route lives at the literal path `og-image.png` so every existing
// reference keeps working. The old static file was moved aside: files in
// `public` shadow routes of the same name.
// ────────────────────────────────────────────────────────────────────────────

const BONE = "#E3DCC9";
const SAGE_BRIGHT = "#B8D4BD";
const AMBER = "#f59e0b";

async function googleFont(
  family: string,
  weight: number,
  italic = false,
): Promise<ArrayBuffer | null> {
  try {
    const spec = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:${spec}`,
      // A browser UA is what makes Google return TTF rather than woff2, which
      // satori cannot parse.
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } },
    ).then((r) => r.text());
    const url = css.match(
      /src: url\((.+?)\) format\('(opentype|truetype)'\)/,
    )?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  const [fraunces, frauncesItalic, mono, monoBold] = await Promise.all([
    googleFont("Fraunces", 600),
    googleFont("Fraunces", 600, true),
    googleFont("JetBrains+Mono", 400),
    googleFont("JetBrains+Mono", 700),
  ]);

  const fonts = [
    fraunces && { name: "Fraunces", data: fraunces, weight: 600 as const, style: "normal" as const },
    frauncesItalic && { name: "Fraunces", data: frauncesItalic, weight: 600 as const, style: "italic" as const },
    mono && { name: "JetBrains Mono", data: mono, weight: 400 as const, style: "normal" as const },
    monoBold && { name: "JetBrains Mono", data: monoBold, weight: 700 as const, style: "normal" as const },
  ].filter(Boolean) as {
    name: string; data: ArrayBuffer; weight: 400 | 600 | 700; style: "normal" | "italic";
  }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "JetBrains Mono",
          background: "#25352B",
        }}
      >
        {/* Satori renders this to a raster, not to a browser DOM: next/image
            has nothing to optimise here and alt text reaches no reader. Both
            rules are about pages, and this is a picture. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={`${url.origin}/og/depth.jpg`}
          width={1200}
          height={630}
          style={{ position: "absolute", left: 0, top: 0 }}
        />

        {/* A gentle left-to-right scrim. The art already leaves the left half
            empty, so this only deepens it rather than hiding anything. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              "linear-gradient(90deg, rgba(21,31,25,0.88) 0%, rgba(21,31,25,0.72) 34%, rgba(21,31,25,0.18) 58%, rgba(21,31,25,0) 74%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 660,
            padding: "0 0 0 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
            <div style={{ fontSize: 23, fontWeight: 700, color: BONE, letterSpacing: 6 }}>
              STROYKA
            </div>
            <div style={{ width: 1, height: 19, background: "rgba(227,220,201,0.3)" }} />
            <div style={{ fontSize: 12, color: SAGE_BRIGHT, letterSpacing: 2.6 }}>
              JOB COSTING
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Fraunces",
              fontWeight: 600,
              fontSize: 66,
              lineHeight: 1.05,
              color: BONE,
            }}
          >
            <div style={{ display: "flex" }}>Construction</div>
            <div style={{ display: "flex" }}>management,</div>
            <div style={{ display: "flex", flexDirection: "column", alignSelf: "flex-start" }}>
              <div style={{ display: "flex", fontStyle: "italic" }}>for real crews.</div>
              <div style={{ display: "flex", height: 2, background: SAGE_BRIGHT, opacity: 0.7, marginTop: 7 }} />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 34,
              fontSize: 14,
              letterSpacing: 2.2,
              color: "rgba(227,220,201,0.72)",
            }}
          >
            <div style={{ display: "flex", color: AMBER, fontWeight: 700 }}>$0</div>
            <div style={{ display: "flex" }}>TO START</div>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: SAGE_BRIGHT }} />
            <div style={{ display: "flex" }}>getstroyka.com</div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
