export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-midnight flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="space-y-2 animate-pulse">
          <div className="h-2.5 bg-brand-forest rounded-sm w-[52px]" />
          <div className="h-2.5 bg-brand-sage rounded-sm w-[39px]" />
          <div className="h-2.5 bg-brand-sage-mist/40 rounded-sm w-[26px]" />
        </div>
        <p className="text-brand-sage/50 text-sm">Loading...</p>
      </div>
    </div>
  );
}
