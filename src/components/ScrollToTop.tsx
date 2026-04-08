"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SVG circle params for progress ring
  const size = 44;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-20 right-6 z-50 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            {/* Progress ring */}
            <svg
              width={size}
              height={size}
              className="absolute -rotate-90"
            >
              {/* Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(132,169,140,0.1)"
                strokeWidth={strokeWidth}
              />
              {/* Progress */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(82,121,111,0.8)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-[stroke-dashoffset] duration-100"
              />
            </svg>

            {/* Button body */}
            <div className="w-10 h-10 rounded-full bg-brand-deep/80 backdrop-blur-sm border border-brand-sage/15 flex items-center justify-center group-hover:bg-brand-forest/30 group-hover:border-brand-forest/40 transition-all duration-200">
              <ArrowUp
                size={16}
                className="text-brand-sage/70 group-hover:text-brand-sage-mist transition-colors duration-200"
              />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
