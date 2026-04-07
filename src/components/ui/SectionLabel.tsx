export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-heading text-xs font-semibold tracking-[0.2em] uppercase text-brand-forest mb-3">
      {children}
    </p>
  );
}
