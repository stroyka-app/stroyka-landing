"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [suppressed, setSuppressed] = useState(false);
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

  // Hide while inside the home's pinned crane story (#how-it-works, the
  // Lift) on phones — its ledger strip sits at the bottom where the button
  // floats, and the section has its own progress (step counter, ledger).
  useEffect(() => {
    const target = document.getElementById("how-it-works");
    if (!target) return;
    const mql = window.matchMedia("(max-width: 767px)");
    let intersecting = false;
    const update = () => setSuppressed(intersecting && mql.matches);
    const obs = new IntersectionObserver(
      (entries) => {
        intersecting = entries[0]?.isIntersecting ?? false;
        update();
      },
      { threshold: 0 }
    );
    obs.observe(target);
    const mqlListener = () => update();
    mql.addEventListener("change", mqlListener);
    return () => {
      obs.disconnect();
      mql.removeEventListener("change", mqlListener);
    };
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
      {visible && !suppressed && (
        <motion.button
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          whileTap={prefersReduced ? undefined : { scale: 0.94 }}
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
                stroke="rgb(var(--site-paper) / 0.1)"
                strokeWidth={strokeWidth}
              />
              {/* Progress */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgb(var(--site-vis))"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-[stroke-dashoffset] duration-100"
              />
            </svg>

            {/* Button body */}
            <div className="w-10 h-10 rounded-full bg-site-night/90 backdrop-blur-sm border border-site-paper/15 flex items-center justify-center shadow-[0_8px_20px_-10px_rgba(60,50,30,0.4)] group-hover:border-site-vis/50 transition-[border-color] duration-200">
              <ArrowUp
                size={16}
                className="text-site-paper/70 group-hover:text-site-vis transition-colors duration-200"
              />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
