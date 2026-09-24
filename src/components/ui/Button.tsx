"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /**
   * primary   — solid deep-sage bg + cream text. Brand CTA on any light bg.
   * secondary — ink outline + ink text, fills to ink on hover. On light bgs.
   * outline   — transparent bg + current-color border. Text color set via
   *             className — lets the same button work on dark and light.
   * invert    — cream bg + ink text. Neutral CTA on sage-heavy moments.
   * ghost     — text only, hover → sage-bright.
   */
  variant?: "primary" | "secondary" | "outline" | "invert" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  /**
   * Fires for the link renderings too, not only the <button> one. The CTAs
   * that matter most (start free, book a demo, pick a plan) are all links,
   * and this is where their conversion events hook in.
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  onClick,
  children,
  className,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [, setIsHovered] = useState(false);

  const springConfig = { stiffness: 300, damping: 20 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    const maxDist = 100;

    if (distance < maxDist) {
      const pull = (1 - distance / maxDist) * 8;
      x.set((distX / distance) * pull);
      y.set((distY / distance) * pull);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Hover shadows: each variant gets a tint that matches its surface so
  // the lift reads as the same material gaining depth, not a generic
  // drop-shadow added on top. Ghost stays shadowless — it's a text button
  // and a shadow would look like leftover artifact.
  const base =
    "relative inline-flex items-center justify-center font-medium tracking-[-0.005em] rounded-full transition-[background-color,border-color,color,box-shadow] duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-night";
  const variants = {
    // Morning Bone: forest pill (primary), ink outline (secondary), and the
    // same shapes as the home's VisButton so every route speaks one language.
    primary:
      "bg-site-vis text-site-on-vis hover:bg-site-vis-hover hover:shadow-[0_14px_30px_-14px_rgb(var(--site-vis)/0.6)]",
    secondary:
      "border border-site-paper/25 text-site-paper hover:bg-site-paper/[0.05] hover:border-site-paper/45",
    outline:
      "bg-transparent border border-current/40 hover:border-current/80 hover:bg-current/[0.06]",
    invert:
      "bg-site-night text-site-paper hover:bg-site-slab hover:shadow-[0_14px_30px_-12px_rgba(60,50,30,0.35)]",
    ghost:
      "text-site-paper hover:text-site-vis",
  };
  const sizes = {
    sm: "text-sm h-10 px-5",
    md: "text-[15px] h-12 px-6",
    lg: "text-[16px] h-14 px-7",
  };

  const cls = cn(base, variants[variant], sizes[size], className);

  // Internal routes (starting with "/") get the locale-aware Link from
  // next-intl so they preserve the active locale prefix on /es and /ru.
  // Hash-only, external (http/https), and mailto links stay as plain <a>.
  const isInternal = !!href && href.startsWith("/");

  const inner = href ? (
    isInternal ? (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    ) : (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    )
  ) : (
    <button className={cls} onClick={onClick} {...props}>
      {children}
    </button>
  );

  if (prefersReduced) {
    return inner;
  }

  // Magnetic pull + hover scale compose on the same wrapper — framer-motion
  // merges the spring-driven x/y MotionValues with the whileHover scale via
  // its transform stack, so neither overrides the other. Subtle 1.02 lift
  // pairs with the hover shadow on the inner button to make the whole
  // surface feel like it rises ~2px toward the cursor.
  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {inner}
    </motion.div>
  );
}
