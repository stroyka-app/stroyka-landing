"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

const TOTAL_FRAMES = 240;

function getFrameSrc(index: number): string {
  return `/hero-frames/ezgif-frame-${String(index).padStart(3, "0")}.png`;
}

function preloadFrames(
  start: number,
  end: number,
  cache: Map<number, HTMLImageElement>
): void {
  for (let i = start; i <= end; i++) {
    if (cache.has(i)) continue;
    const img = new Image();
    img.src = getFrameSrc(i);
    cache.set(i, img);
  }
}

// Each layer: which column (left/right), vertical offset in the column,
// and scroll threshold when the label appears.
const LAYERS = [
  {
    col: "right" as const,
    topPercent: 20,
    revealAt: 0.12,
    title: "Works without cell service",
    body: "Logs time and syncs requests offline — basements, tunnels, rural sites.",
  },
  {
    col: "left" as const,
    topPercent: 38,
    revealAt: 0.22,
    title: "Real-time job costing",
    body: "Every purchase and timesheet entry rolls into a live project P&L.",
  },
  {
    col: "right" as const,
    topPercent: 56,
    revealAt: 0.32,
    title: "Built for boss and crew",
    body: "Approvals and cost reports for bosses. Tasks and time logging for workers.",
  },
  {
    col: "left" as const,
    topPercent: 75,
    revealAt: 0.42,
    title: "No training manual needed",
    body: "Hand it to your crew and they're working in minutes. Day-one simple.",
  },
];

function StaticFallback() {
  return (
    <section id="built-tough" className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <FadeIn>
            <SectionLabel>Under the Hood</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl lg:text-5xl font-heading font-bold leading-tight">
              What powers your crew
            </h2>
          </FadeIn>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <FadeIn delay={0.2}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getFrameSrc(180)}
              alt="3D exploded view of construction technology"
              className="w-full rounded-2xl"
            />
          </FadeIn>
          <div className="space-y-8">
            {LAYERS.map((layer, i) => (
              <FadeIn key={layer.title} delay={0.15 * i}>
                <div>
                  <h3
                    className="font-heading leading-snug mb-1"
                    style={{ fontSize: "18px", fontWeight: 600, color: "#cad2c5" }}
                  >
                    {layer.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#84a98c" }} className="leading-relaxed">
                    {layer.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BuiltTough() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const rafId = useRef<number>(0);
  const lastDrawnFrame = useRef<number>(0);

  const [progress, setProgress] = useState(0);
  const [visibleLayers, setVisibleLayers] = useState<boolean[]>(
    LAYERS.map(() => false)
  );
  const [mobileActive, setMobileActive] = useState(-1);
  const [currentFrame, setCurrentFrame] = useState(1);
  const mobileImgRef = useRef<HTMLImageElement>(null);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = frameCache.current.get(frameIndex);
    if (!img || !img.complete || !img.naturalWidth) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const canvasRatio = canvasW / canvasH;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    ctx.clearRect(0, 0, canvasW, canvasH);

    // "Contain" fit — show full image, no cropping
    let dw: number, dh: number, dx: number, dy: number;
    if (imgRatio > canvasRatio) {
      // Image is wider than canvas — fit to width, center vertically
      dw = canvasW;
      dh = canvasW / imgRatio;
      dx = 0;
      dy = (canvasH - dh) / 2;
    } else {
      // Image is taller than canvas — fit to height, center horizontally
      dh = canvasH;
      dw = canvasH * imgRatio;
      dx = (canvasW - dw) / 2;
      dy = 0;
    }

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
    lastDrawnFrame.current = frameIndex;
  }, []);

  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = section.getBoundingClientRect();
      const stickyDistance = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / stickyDistance));

      setProgress(p);

      // First 70% of scroll: unfold (frames 1→240)
      // Last 30%: hold fully unfolded, then unstick naturally
      const frameProgress = Math.min(1, p / 0.7);

      const frame = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.ceil(frameProgress * TOTAL_FRAMES))
      );

      if (frame !== lastDrawnFrame.current) {
        drawFrame(frame);
        setCurrentFrame(frame);

        if (mobileImgRef.current) {
          mobileImgRef.current.src = getFrameSrc(frame);
        }

        const ahead = Math.min(TOTAL_FRAMES, frame + 15);
        const behind = Math.max(1, frame - 15);
        preloadFrames(behind, ahead, frameCache.current);
      }

      // Labels reveal based on the same forward-only progress
      const newVisible = LAYERS.map(
        (layer) => frameProgress >= layer.revealAt / 0.5
      );
      setVisibleLayers(newVisible);

      let latest = -1;
      for (let i = LAYERS.length - 1; i >= 0; i--) {
        if (newVisible[i]) { latest = i; break; }
      }
      setMobileActive(latest);
    });
  }, [drawFrame]);

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      drawFrame(lastDrawnFrame.current || 1);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [prefersReduced, drawFrame]);

  useEffect(() => {
    if (prefersReduced) return;

    const cache = frameCache.current;

    preloadFrames(1, 25, cache);
    preloadFrames(115, 140, cache);

    let batch = 26;
    const loadBatch = () => {
      if (batch > TOTAL_FRAMES) return;
      const end = Math.min(batch + 20, TOTAL_FRAMES);
      preloadFrames(batch, end, cache);
      batch = end + 1;
      requestAnimationFrame(loadBatch);
    };
    const timer = setTimeout(loadBatch, 300);

    const first = cache.get(1);
    if (first) {
      if (first.complete) {
        drawFrame(1);
      } else {
        first.onload = () => drawFrame(1);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prefersReduced, drawFrame, handleScroll]);

  if (prefersReduced) {
    return <StaticFallback />;
  }

  const leftLayers = LAYERS.filter((l) => l.col === "left");
  const rightLayers = LAYERS.filter((l) => l.col === "right");

  return (
    <section
      ref={sectionRef}
      id="built-tough"
      style={{ height: "250vh" }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative h-full flex flex-col items-center justify-center">
          {/* Section header — pinned at top of sticky area, below navbar (h-16 = 64px) */}
          <div className="absolute top-20 left-0 right-0 text-center z-10">
            <SectionLabel>Under the Hood</SectionLabel>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-brand-sage-mist mt-1">
              What powers your crew
            </h2>
          </div>

          {/* 3-column grid: [left labels 22%] [device 56%] [right labels 22%] */}
          <div
            className="hidden lg:grid w-full max-w-7xl px-10"
            style={{
              gridTemplateColumns: "1fr 50% 1fr",
              height: "65vh",
            }}
          >
            {/* Left column */}
            <div className="relative" style={{ padding: "0 24px", overflow: "visible" }}>
              {leftLayers.map((layer) => {
                const idx = LAYERS.indexOf(layer);
                const visible = visibleLayers[idx];
                return (
                  <motion.div
                    key={layer.title}
                    style={{
                      position: "absolute",
                      top: `${layer.topPercent}%`,
                      left: "24px",
                      right: "-100px",
                      transform: "translateY(-50%)",
                    }}
                    animate={{
                      opacity: visible ? 1 : 0,
                      x: visible ? 0 : 20,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="flex items-center justify-end gap-0">
                      <div style={{ textAlign: "right" }}>
                        <h3
                          className="font-heading leading-snug"
                          style={{ fontSize: "18px", fontWeight: 600, color: "#cad2c5" }}
                        >
                          {layer.title}
                        </h3>
                        <p
                          className="leading-relaxed mt-1"
                          style={{ fontSize: "13px", color: "#84a98c" }}
                        >
                          {layer.body}
                        </p>
                      </div>
                      <div
                        style={{
                          width: "100px",
                          minWidth: "100px",
                          height: "1px",
                          marginLeft: "12px",
                          background: "linear-gradient(to right, rgba(82, 121, 111, 0.4), rgba(82, 121, 111, 0))",
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Center column — device canvas */}
            <div
              className="relative device-glow"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
                WebkitMaskComposite: "source-in" as string,
              }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ willChange: "contents" }}
              />
            </div>

            {/* Right column */}
            <div className="relative" style={{ padding: "0 24px", overflow: "visible" }}>
              {rightLayers.map((layer) => {
                const idx = LAYERS.indexOf(layer);
                const visible = visibleLayers[idx];
                return (
                  <motion.div
                    key={layer.title}
                    style={{
                      position: "absolute",
                      top: `${layer.topPercent}%`,
                      left: "-100px",
                      right: "24px",
                      transform: "translateY(-50%)",
                    }}
                    animate={{
                      opacity: visible ? 1 : 0,
                      x: visible ? 0 : -20,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="flex items-center gap-0">
                      <div
                        style={{
                          width: "100px",
                          minWidth: "100px",
                          height: "1px",
                          marginRight: "12px",
                          background: "linear-gradient(to left, rgba(82, 121, 111, 0.4), rgba(82, 121, 111, 0))",
                        }}
                      />
                      <div style={{ textAlign: "left" }}>
                        <h3
                          className="font-heading leading-snug"
                          style={{ fontSize: "18px", fontWeight: 600, color: "#cad2c5" }}
                        >
                          {layer.title}
                        </h3>
                        <p
                          className="leading-relaxed mt-1"
                          style={{ fontSize: "13px", color: "#84a98c" }}
                        >
                          {layer.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile: device uses same canvas (grid is hidden on mobile,
               canvas parent is the center column which is display:none on <lg).
               So we show a separate img-based fallback on mobile. */}
          <div className="lg:hidden w-full px-6">
            <div className="relative w-full h-[50vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={mobileImgRef}
                src={getFrameSrc(currentFrame)}
                alt=""
                className="max-w-full max-h-full object-contain"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: [
                    "linear-gradient(to top, #2f3e46 0%, transparent 20%)",
                    "linear-gradient(to bottom, #2f3e46 0%, transparent 20%)",
                    "linear-gradient(to left, #2f3e46 0%, #2f3e46 5%, transparent 45%)",
                    "linear-gradient(to right, #2f3e46 0%, #2f3e46 5%, transparent 45%)",
                  ].join(", "),
                }}
              />
            </div>
            {mobileActive >= 0 && (
              <div className="text-center max-w-sm mx-auto mt-2">
                <motion.div
                  key={mobileActive}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3
                    className="font-heading mb-1"
                    style={{ fontSize: "18px", fontWeight: 600, color: "#cad2c5" }}
                  >
                    {LAYERS[mobileActive].title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#84a98c" }} className="leading-relaxed">
                    {LAYERS[mobileActive].body}
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
