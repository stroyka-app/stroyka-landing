"use client";

import { useEffect, useRef } from "react";
import { useReduced } from "./useReduced";


/**
 * Letters that get heavier as the cursor comes near: a variable-font
 * weight field around the pointer. Pointer devices only; on touch and under
 * reduced motion every letter simply stays at `base`.
 *
 * Per-letter weights are written straight to `style` in a rAF, and only
 * while the pointer is within `radius` of the block, so an idle page does
 * no work at all.
 */
export default function ProximityText({
  text,
  base = 640,
  peak = 1000,
  radius = 220,
  wdth = 100,
  className = "",
}: {
  text: string;
  base?: number;
  peak?: number;
  radius?: number;
  /** font-variation-settings is not additive, so the width axis rides along. */
  wdth?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLSpanElement>(null);
  const reduced = useReduced();

  useEffect(() => {
    const el = wrap.current;
    if (!el || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const letters = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-l]"));
    let raf = 0;
    let mx = -9999;
    let my = -9999;
    let settled = true;

    const frame = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const near =
        mx > box.left - radius && mx < box.right + radius && my > box.top - radius && my < box.bottom + radius;
      if (!near && settled) return;
      let moving = false;
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my);
        const f = near ? Math.max(0, 1 - d / radius) : 0;
        const target = base + (peak - base) * f * f;
        const cur = Number(l.dataset.w ?? base);
        const next = cur + (target - cur) * 0.22;
        if (Math.abs(next - target) > 1) moving = true;
        l.dataset.w = String(next);
        l.style.fontVariationSettings = `"wght" ${Math.round(next)}, "wdth" ${wdth}`;
      }
      settled = !near && !moving;
      if (!settled) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      settled = false;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, base, peak, radius, wdth]);

  return (
    <span className={className}>
      {/* What assistive tech and crawlers read: the plain line. */}
      <span className="sr-only">{text}</span>
      {/* What eyes see: letters grouped per word (a line can only wrap at the
          real spaces between them), each one weight-addressable. */}
      <span ref={wrap} aria-hidden>
        {text.split(" ").map((word, w, words) => (
          <span key={w}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, i) => (
                <span
                  key={i}
                  data-l
                  className="inline-block"
                  style={{ fontVariationSettings: `"wght" ${base}, "wdth" ${wdth}` }}
                >
                  {ch}
                </span>
              ))}
            </span>
            {w < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </span>
  );
}
