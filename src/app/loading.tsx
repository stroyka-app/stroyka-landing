export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4]">
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-end gap-1.5">
          <span className="block w-2 h-2 rounded-full bg-brand-forest animate-[bounce_1.2s_ease-in-out_infinite]" />
          <span className="block w-2 h-2 rounded-full bg-brand-forest animate-[bounce_1.2s_ease-in-out_0.15s_infinite]" />
          <span className="block w-2 h-2 rounded-full bg-brand-forest animate-[bounce_1.2s_ease-in-out_0.3s_infinite]" />
        </div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted">
          Loading
        </p>
      </div>
    </main>
  );
}
