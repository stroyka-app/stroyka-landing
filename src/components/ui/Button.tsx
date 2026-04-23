"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * primary   — sage-bright bg + dark text (the alive CTA on dark surfaces)
   * secondary — cream outline on dark
   * invert    — cream bg + dark text (neutral CTA on sage-heavy moments)
   * ghost     — text only, hover → sage-bright
   */
  variant?: "primary" | "secondary" | "invert" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
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

  const base =
    "relative inline-flex items-center justify-center font-heading font-semibold tracking-wide rounded-full transition-colors duration-200 cursor-pointer";
  const variants = {
    primary:
      "bg-brand-sage-bright text-bone hover:bg-ink active:scale-95 shadow-[0_0_28px_-6px_rgba(184,212,189,0.6)]",
    secondary:
      "border border-ink/40 text-ink hover:bg-ink/10 hover:border-ink/70 active:scale-95",
    invert:
      "bg-ink text-bone hover:bg-ink-soft active:scale-95",
    ghost:
      "text-ink hover:text-brand-sage-bright active:scale-95",
  };
  const sizes = {
    sm: "text-sm px-5 py-2",
    md: "text-[15px] px-6 py-3",
    lg: "text-[15px] px-7 py-3.5",
  };

  const cls = cn(base, variants[variant], sizes[size], className);

  const inner = href ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <button className={cls} {...props}>
      {children}
    </button>
  );

  if (prefersReduced) {
    return inner;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {inner}
    </motion.div>
  );
}
