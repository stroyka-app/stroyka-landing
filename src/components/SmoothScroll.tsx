"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // lenis is a progressive enhancement, not the scroll engine. Skip it for
    // touch (native momentum is better) and for reduced-motion (accessibility)
    // — both fall back to the deterministic native path: CSS scroll-behavior
    // smooth + scroll-margin-top handle hash anchors with no JS.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;
    setLenis(lenis);
    // Marks "lenis owns scrolling" so globals.css can switch off CSS smooth.
    const html = document.documentElement;
    html.classList.add("has-lenis");

    let rafId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenis(null);
      html.classList.remove("has-lenis");
    };
  }, []);

  return <>{children}</>;
}
