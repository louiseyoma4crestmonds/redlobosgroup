import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Social icon button ────────────────────────────────────────────────────────
function SocialBtn({ src, alt, href }: { src: string; alt: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={alt}
      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all duration-200"
    >
      <img src={src} alt={alt} width={15} height={15} className="opacity-70 hover:opacity-100 transition-opacity" />
    </a>
  );
}

// ── Footer link ───────────────────────────────────────────────────────────────
function FooterLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <li>
      <button
        onClick={onClick}
        className="text-sm text-white/50 hover:text-gold transition-colors duration-200 text-left leading-none"
      >
        {label}
      </button>
    </li>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function Footer(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = () => {
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[#1a1d21] text-white">

      {/* ── Newsletter strip ──────────────────────────────────────────────── */}
      <div className="bg-[#212529] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col tablet:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase mb-2">
              Stay in the know
            </p>
            <h3 className="text-xl font-bold text-white leading-snug">
              Get exclusive deals &amp; new property alerts
            </h3>
            <p className="text-white/40 text-sm mt-1">
              No spam. Just the best stays, delivered to your inbox.
            </p>
          </div>
          <div className="w-full tablet:w-auto">
            {submitted ? (
              <div className="flex items-center gap-2 text-gold text-sm font-semibold">
                <span className="text-lg">✓</span> Thanks! You're on the list.
              </div>
            ) : (
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="Your email address"
                  className="w-full tablet:w-72 bg-white/5 border border-white/10 rounded-l-lg px-5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-gold text-white px-6 py-3 rounded-r-lg text-xs font-bold tracking-[0.1em] hover:bg-white hover:text-gold transition-colors duration-200 whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 gap-12">

          {/* Col 1 — Brand ─────────────────────────────────────────────────── */}
          <div className="space-y-6 laptop:col-span-1">
            <button onClick={() => navigate("/")} aria-label="Home">
              <img
                src="/redlobosLogonmn.png"
                alt="Red Lobos Group"
                width={90}
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
            </button>
            <p className="text-white/40 text-sm leading-7 max-w-xs">
              Premium shortlet properties across the UK. Every stay is handpicked,
              professionally managed, and backed by 24/7 guest support.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <SocialBtn src="/instagram.png" alt="Instagram" href="https://www.instagram.com" />
              <SocialBtn src="/facebook.png" alt="Facebook" href="https://www.facebook.com" />
              <SocialBtn src="/twitter.png" alt="Twitter / X" href="https://www.twitter.com" />
              <SocialBtn src="/linkedin.png" alt="LinkedIn" href="https://www.linkedin.com" />
            </div>
          </div>

          {/* Col 2 — Explore ──────────────────────────────────────────────── */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.18em] text-gold uppercase">
              Explore
            </h4>
            <ul className="space-y-4">
              <FooterLink label="Home" onClick={() => navigate("/")} />
              <FooterLink label="About Us" onClick={() => navigate("/about")} />
              <FooterLink label="Properties" onClick={() => navigate("/properties")} />
              <FooterLink label="Contacts" onClick={() => navigate("/contacts")} />
              <FooterLink label="My Dashboard" onClick={() => navigate("/dashboard")} />
            </ul>
          </div>

          {/* Col 3 — Experiences ──────────────────────────────────────────── */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.18em] text-gold uppercase">
              Experiences
            </h4>
            <ul className="space-y-4">
              <FooterLink label="Romantic Dinner Setup" onClick={() => navigate("/addOn/1")} />
              <FooterLink label="Proposal Arrangement" onClick={() => navigate("/addOn/3")} />
              <FooterLink label="Paint &amp; Sip Evening" onClick={() => navigate("/addOn/4")} />
              <FooterLink label="Podcast Studio Session" onClick={() => navigate("/addOn/2")} />
              <FooterLink label="Home Studio Hire" onClick={() => navigate("/addOn/2")} />
            </ul>
          </div>

          {/* Col 4 — Contact ──────────────────────────────────────────────── */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.18em] text-gold uppercase">
              Contact
            </h4>
            <ul className="space-y-5">
              {/* Address */}
              <li className="flex items-start gap-3">
                <span className="text-gold mt-0.5 flex-shrink-0">📍</span>
                <p className="text-white/50 text-sm leading-6">
                  71–75 Shelton Street,<br />
                  Covent Garden,<br />
                  London, WC2H 9JQ
                </p>
              </li>
              {/* Email */}
              <li className="flex items-center gap-3">
                <span className="text-gold flex-shrink-0">✉️</span>
                <a
                  href="mailto:prisca@redlobosgroup.com"
                  className="text-white/50 text-sm hover:text-gold transition-colors"
                >
                  prisca@redlobosgroup.com
                </a>
              </li>
              {/* Phone */}
              <li className="flex items-center gap-3">
                <span className="text-gold flex-shrink-0">📞</span>
                <a
                  href="tel:+447424733629"
                  className="text-white/50 text-sm hover:text-gold transition-colors"
                >
                  +44 7424 733629
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Gold divider ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col tablet:flex-row items-center justify-between gap-4">
        {/* Left — copyright + legal links */}
        <div className="flex flex-col tablet:flex-row items-center gap-4 text-center tablet:text-left">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Red Lobos Group. All rights reserved.
          </p>
          <span className="hidden tablet:block text-white/15">·</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/privacy-policy")}
              className="text-white/30 text-xs hover:text-gold transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-white/15">·</span>
            <button
              type="button"
              onClick={() => navigate("/terms-and-conditions")}
              className="text-white/30 text-xs hover:text-gold transition-colors"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>

        {/* Right — back to top */}
        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-white/30 hover:text-gold transition-colors"
        >
          BACK TO TOP
          <span className="w-7 h-7 rounded-full border border-white/10 group-hover:border-gold group-hover:bg-gold/10 flex items-center justify-center transition-all">
            ↑
          </span>
        </button>
      </div>
    </footer>
  );
}

export default Footer;
