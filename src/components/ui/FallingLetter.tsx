"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface FallingLetterProps {
  text: string;
  fallingIndex: number;
  className?: string;
}

export default function FallingLetter({
  text,
  fallingIndex,
  className,
}: FallingLetterProps) {
  const containerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const fallY = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0, 400]);
  const fallRotate = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0, 45]);
  const fallOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [1, 1, 0.6, 0]);

  if (prefersReduced) {
    return (
      <span ref={containerRef} className={className}>
        {text}
      </span>
    );
  }

  return (
    <span ref={containerRef} className={`inline-block ${className || ""}`}>
      {text.split("").map((char, i) => {
        if (i === fallingIndex) {
          return (
            <motion.span
              key={i}
              className="inline-block origin-bottom-left"
              style={{
                y: fallY,
                rotate: fallRotate,
                opacity: fallOpacity,
              }}
            >
              {char}
            </motion.span>
          );
        }
        return (
          <span key={i} className="inline-block">
            {char}
          </span>
        );
      })}
    </span>
  );
}
