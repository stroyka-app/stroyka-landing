"use client";

import { useCallback } from "react";

/**
 * Cursor-follow glow. Sets --mx/--my CSS custom props on the target element
 * so a `.cursor-glow::before` radial gradient can follow the pointer. Pair
 * with the `cursor-glow` utility in globals.css.
 *
 *   const glow = useCursorGlow();
 *   <div className="cursor-glow" {...glow} />
 */
export function useCursorGlow() {
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  }, []);

  return { onMouseMove, onMouseLeave };
}
