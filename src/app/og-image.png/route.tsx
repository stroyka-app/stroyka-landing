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

// Morning Bone (docs/design/morning-bone-system.md). Satori can't read CSS
// variables, so the tokens are spelled out here.
const BONE = "#ECE6D8";
const SLAB = "#E1D9C6";
const INK = "#1F1C16";
const FOREST = "#2F5B45";
const SKY = "#C9D1C4";

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

export async function GET() {

  const [flex, mono] = await Promise.all([
    // Inter Tight 600 stands in for the site's Roboto Flex semibold: Google
    // only serves Flex as a variable file, and Satori renders a variable
    // font at its default (400) instance.
    googleFont("Inter+Tight", 600),
    googleFont("JetBrains+Mono", 500),
  ]);

  const fonts = [
    flex && { name: "Display", data: flex, weight: 600 as const, style: "normal" as const },
    mono && { name: "JetBrains Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 500 | 600; style: "normal" }[];

  // The Lift, drawn: a tower crane and Job 204 rising inside its dashed
  // budget envelope, each storey a cost. Pure SVG (Satori renders it).
  const floors = [
    { h: 34, c: "#A19F90" },
    { h: 54, c: "#5F7079" },
    { h: 25, c: "#C09A69" },
    { h: 58, c: "#5E8F73" },
    { h: 44, c: "#86A9A4" },
  ];
  let y = 560;
  const storeys = floors.map((f) => {
    y -= f.h;
    return { ...f, y };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "JetBrains Mono",
          backgroundImage: `linear-gradient(180deg, ${SKY} 0%, #D6D9CB 42%, ${BONE} 78%, ${SLAB} 100%)`,
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          {/* ground line + grid ticks */}
          <line x1="560" y1="560" x2="1200" y2="560" stroke={FOREST} strokeOpacity="0.25" strokeWidth="2" />
          {/* mast */}
          <rect x="826" y="130" width="22" height="430" fill="none" stroke={FOREST} strokeWidth="4" />
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1="826" y1={560 - i * 30} x2="848" y2={530 - i * 30} stroke={FOREST} strokeWidth="3" />
          ))}
          {/* jib + counter-jib + apex ties */}
          <line x1="690" y1="130" x2="1150" y2="130" stroke={FOREST} strokeWidth="7" />
          <line x1="837" y1="70" x2="1150" y2="130" stroke={FOREST} strokeWidth="2" />
          <line x1="837" y1="70" x2="690" y2="130" stroke={FOREST} strokeWidth="2" />
          <line x1="837" y1="70" x2="837" y2="130" stroke={FOREST} strokeWidth="5" />
          <rect x="690" y="134" width="46" height="34" fill="#8F8D7E" />
          {/* trolley, cable and the load on the hook */}
          <rect x="1016" y="130" width="22" height="10" fill={INK} />
          <line x1="1027" y1="140" x2="1027" y2="230" stroke={INK} strokeWidth="2" />
          <rect x="992" y="230" width="70" height="40" fill="#6E5242" />
          {/* budget envelope */}
          <rect x="930" y="290" width="104" height="270" fill="none" stroke={INK} strokeOpacity="0.55" strokeWidth="2" strokeDasharray="9 7" />
          {/* the building = the spend */}
          {storeys.map((s, i) => (
            <rect key={i} x="938" y={s.y} width="88" height={s.h} fill={s.c} stroke={BONE} strokeWidth="1.5" />
          ))}
          <rect x="920" y="560" width="124" height="10" fill="#9A927C" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 700, padding: "0 0 0 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: INK, letterSpacing: 6 }}>STROYKA</div>
            <div style={{ width: 1, height: 18, background: "rgba(31,28,22,0.25)" }} />
            <div style={{ fontSize: 13, color: FOREST, letterSpacing: 2.6 }}>JOB COSTING</div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Display",
              fontWeight: 600,
              fontSize: 72,
              lineHeight: 0.98,
              letterSpacing: -2,
              color: INK,
            }}
          >
            <div style={{ display: "flex" }}>Know what it costs</div>
            <div style={{ display: "flex" }}>while it’s still</div>
            <div style={{ display: "flex", color: FOREST }}>going up.</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 38, fontSize: 15, letterSpacing: 2.2, color: "rgba(31,28,22,0.65)" }}>
            <div style={{ display: "flex", color: FOREST }}>$0 TO START</div>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: FOREST }} />
            <div style={{ display: "flex" }}>ANY PHONE · NO SIGNAL NEEDED</div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
