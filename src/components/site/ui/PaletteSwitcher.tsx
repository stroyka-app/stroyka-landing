"use client";

import { useEffect, useState } from "react";

/**
 * Review tool for choosing the dusk site's palette. Not part of the design:
 * it renders on localhost, or anywhere with `?palette=…` in the URL, and
 * nowhere else. It only flips <html data-palette>; every colour on the
 * page (the 3D scene included) follows the tokens in globals.css.
 *
 * Keys 1–5 switch palettes; the choice persists in localStorage.
 */
const PALETTES = [
  { id: "lime", name: "Hi-Vis Lime", note: "v1", base: "#121713", accent: "#D4EE5E" },
  { id: "sage", name: "Field Sage", note: "brand bridge", base: "#16201A", accent: "#B8D4BD" },
  { id: "blueprint", name: "Blueprint", note: "navy + cyan", base: "#0C1622", accent: "#8FD3FF" },
  { id: "yellow", name: "Machine Yellow", note: "graphite + CAT", base: "#151515", accent: "#F4C430" },
  { id: "bone", name: "Morning Bone", note: "daylight", base: "#ECE6D8", accent: "#2F5B45" },
] as const;

type Id = (typeof PALETTES)[number]["id"];
const KEY = "stroyka-palette";

function apply(id: Id) {
  const html = document.documentElement;
  if (id === "lime") delete html.dataset.palette;
  else html.dataset.palette = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* private mode: the switch still works for this visit */
  }
}

export default function PaletteSwitcher() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState<Id>("lime");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("palette");
    const isLocal = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    if (!isLocal && !fromUrl) return;
    setEnabled(true);
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    const initial = (PALETTES.find((p) => p.id === (fromUrl ?? stored))?.id ?? "lime") as Id;
    setActive(initial);
    apply(initial);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const n = Number(e.key);
      if (n >= 1 && n <= PALETTES.length) {
        const id = PALETTES[n - 1].id;
        setActive(id);
        apply(id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);

  if (!enabled) return null;

  const current = PALETTES.find((p) => p.id === active) ?? PALETTES[0];

  // One compact strip beside the Next dev badge: out of the way of the
  // hero copy and the ledger, readable on every palette.
  return (
    <div
      className="fixed bottom-4 left-16 z-[80] flex items-center gap-2 rounded-full bg-[#0E0E0E]/90 py-1.5 pl-1.5 pr-3.5 text-white shadow-[0_14px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur-xl"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      role="group"
      aria-label="Palette"
    >
      {PALETTES.map((p, i) => {
        const on = p.id === active;
        return (
          <button
            key={p.id}
            type="button"
            title={`${i + 1} · ${p.name} (${p.note})`}
            aria-label={p.name}
            aria-pressed={on}
            onClick={() => {
              setActive(p.id);
              apply(p.id);
            }}
            className={`relative h-7 w-7 overflow-hidden rounded-full transition-transform duration-150 hover:scale-110 ${on ? "ring-2 ring-white ring-offset-2 ring-offset-[#0E0E0E]" : "ring-1 ring-white/25"}`}
            style={{ background: p.base }}
          >
            <span className="absolute inset-y-0 right-0 w-1/2" style={{ background: p.accent }} />
          </button>
        );
      })}
      <span className="ml-1.5 whitespace-nowrap text-[12.5px] font-medium">
        {current.name}
        <span className="ml-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">keys 1–5</span>
      </span>
    </div>
  );
}
