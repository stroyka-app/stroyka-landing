"use client";

import { useRef } from "react";
import {motion, useSpring} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useReduced } from "./useReduced";

/**
 * The one CTA shape on the dusk site: a hi-vis pill (or its ghost) that
 * leans a few pixels toward the cursor, and whose arrow slips out of the
 * corner and back in on hover. Press = scale 0.97.
 */
export default function VisButton({
  href,
  children,
  variant = "solid",
  size = "md",
  onClick,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "dark" | "line";
  size?: "md" | "lg";
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReduced();
  const x = useSpring(0, { stiffness: 260, damping: 18 });
  const y = useSpring(0, { stiffness: 260, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(Math.round((e.clientX - (r.left + r.width / 2)) * 0.18));
    y.set(Math.round((e.clientY - (r.top + r.height / 2)) * 0.28));
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const tone =
    variant === "solid"
      ? "bg-site-vis text-site-night hover:bg-[#E0F77A]"
      : variant === "dark"
        ? "bg-site-night text-site-paper hover:bg-black"
        : variant === "line"
          ? "bg-transparent text-site-night ring-1 ring-inset ring-site-night/40 hover:bg-site-night/10"
          : "bg-site-paper/[0.06] text-site-paper ring-1 ring-inset ring-site-paper/25 hover:bg-site-paper/[0.12] hover:ring-site-paper/45 backdrop-blur-md";
  const pad = size === "lg" ? "h-14 pl-7 pr-2 text-[16px]" : "h-12 pl-6 pr-1.5 text-[15px]";
  const knob = size === "lg" ? "h-10 w-10" : "h-9 w-9";
  const knobTone =
    variant === "solid"
      ? "bg-site-night text-site-vis"
      : variant === "dark"
        ? "bg-site-vis text-site-night"
        : variant === "line"
          ? "bg-site-night text-site-vis"
          : "bg-site-paper/15 text-site-paper";

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`pointer-events-auto inline-block ${className}`}
    >
      <Link
        href={href}
        onClick={onClick}
        className={`group inline-flex items-center gap-4 rounded-full font-medium tracking-[-0.005em] transition-[background-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-night ${tone} ${pad}`}
      >
        <span>{children}</span>
        <span className={`relative grid place-items-center overflow-hidden rounded-full ${knob} ${knobTone}`}>
          <ArrowUpRight
            size={17}
            strokeWidth={2.2}
            className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-6 group-hover:translate-x-6"
          />
          <ArrowUpRight
            size={17}
            strokeWidth={2.2}
            className="absolute -translate-x-6 translate-y-6 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0"
          />
        </span>
      </Link>
    </motion.span>
  );
}
