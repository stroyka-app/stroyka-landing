import Logo from "@/components/Logo";

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-brand-midnight border-t border-brand-deep py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <Logo variant="dark" size={28} />
          <div className="flex flex-wrap gap-6">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-brand-sage/50 hover:text-brand-sage transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-brand-deep">
          <p className="text-sm text-brand-sage/50">
            © {new Date().getFullYear()} Stroyka. All rights reserved.
          </p>
          <p className="text-sm text-brand-sage/50">Made for crews who build things.</p>
        </div>
      </div>
    </footer>
  );
}
