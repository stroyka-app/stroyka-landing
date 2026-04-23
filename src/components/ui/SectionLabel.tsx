interface SectionLabelProps {
  children: React.ReactNode;
  /** On ink (dark) sections set tone="invert" so the label reads on dark */
  tone?: "default" | "invert";
}

/**
 * Editorial section marker. A small pistachio dot + uppercase mono-style label.
 * The `●` carries the Paysages-ish bullet motif; kept pistachio because sage is
 * now a scarce accent rather than wallpaper — this is one of the places it earns
 * its screen time.
 */
export default function SectionLabel({ children, tone = "default" }: SectionLabelProps) {
  const text = tone === "invert" ? "text-brand-sage-mist" : "text-ink-soft";
  return (
    <p className={`font-mono text-[11px] font-medium tracking-[0.22em] uppercase ${text} mb-6 inline-flex items-center gap-2.5`}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-sage" aria-hidden />
      {children}
    </p>
  );
}
