import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden flex items-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 w-[60vw] h-[60vw] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(184,212,189,0.32), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="relative max-w-xl mx-auto px-6 text-center w-full">
          <FadeIn>
            <SectionLabel>Off plan</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p className="font-display font-light text-[7rem] lg:text-[10rem] leading-none text-ink/85 tracking-[-0.04em] mb-2">
              404
            </p>
          </FadeIn>
          <FadeIn delay={0.12}>
            <h1 className="font-display font-light text-3xl lg:text-4xl leading-tight text-ink mb-4">
              This page doesn&rsquo;t exist
            </h1>
          </FadeIn>
          <FadeIn delay={0.18}>
            <p className="text-[15px] text-ink-soft leading-relaxed mb-10 max-w-md mx-auto">
              Looks like this one got buried under a pile of blueprints.
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" href="/">
                Back to home
              </Button>
              <Link
                href="/demo"
                className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted hover:text-brand-forest transition-colors self-center"
              >
                Or book a demo →
              </Link>
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
