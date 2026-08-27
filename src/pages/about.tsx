import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center px-6 py-4">
      <p className="text-4xl font-bold text-gold mb-1">{value}</p>
      <p className="text-xs font-semibold tracking-[0.12em] text-gray-500 uppercase">{label}</p>
    </div>
  );
}

// ── Value card ────────────────────────────────────────────────────────────────
function ValueCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <span className="text-3xl mb-4">{icon}</span>
      <h3 className="text-sm font-bold tracking-[0.1em] text-gray-800 mb-3">{title}</h3>
      <p className="text-sm text-gray-500 leading-7">{body}</p>
    </div>
  );
}

// ── Experience card ───────────────────────────────────────────────────────────
function ExperienceCard({ src, alt, title, description }: {
  src: string; alt: string; title: string; description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl aspect-[4/5]">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h4 className="text-white font-bold text-sm tracking-[0.08em] mb-1">{title}</h4>
        <p className="text-white/75 text-xs leading-5">{description}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function About(): JSX.Element {
  const navigate = useNavigate();
  const [introPage, setIntroPage] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setIntroPage(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      {/* ── Splash ─────────────────────────────────────────────────────────── */}
      <div className={!introPage ? "hidden" : ""}>
        <div className="w-screen h-screen flex place-content-center bg-green1">
          <div className="self-center">
            <img width={200} height={200} src="/logoAnimation.gif" alt="logo" />
          </div>
        </div>
      </div>

      {/* ── Page ───────────────────────────────────────────────────────────── */}
      <div className={introPage ? "hidden" : ""}>
        <UtilityBar activeLink="ABOUT" />

        {/* ── Hero banner ──────────────────────────────────────────────────── */}
        <section className="relative h-[420px] tablet:h-[520px] overflow-hidden">
          <img
            src="/firstImage-optimized.webp"
            alt="Luxury Red Lobos shortlet property interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
            <p className="text-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Red Lobos Group
            </p>
            <h1 className="text-white text-4xl tablet:text-6xl font-bold tracking-tight leading-tight max-w-3xl">
              Curated Stays.<br />
              <span className="text-gold">Exceptional Experiences.</span>
            </h1>
            <p className="text-white/75 mt-5 text-sm tablet:text-base leading-7 max-w-xl">
              We believe every getaway should feel like home — only better. That's why we
              handpick premium shortlet properties and pair them with thoughtfully designed experiences.
            </p>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mt-8 text-white/50 text-xs tracking-wider">
              <button onClick={() => navigate("/")} className="hover:text-gold transition-colors">
                HOME
              </button>
              <span>&gt;</span>
              <span className="text-white/80">ABOUT US</span>
            </div>
          </div>
        </section>

        {/* ── Stats bar ────────────────────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto grid grid-cols-2 tablet:grid-cols-4 divide-x divide-gray-100">
            <StatCard value="20+" label="Premium Properties" />
            <StatCard value="1,500+" label="Happy Guests" />
            <StatCard value="5" label="Cities" />
            <StatCard value="6+" label="Years of Excellence" />
          </div>
        </section>

        {/* ── Our Story ────────────────────────────────────────────────────── */}
        <section className="bg-green1 py-20 px-6">
          <div className="max-w-6xl mx-auto flex flex-col tablet:flex-row items-center gap-12 tablet:gap-20">
            <div className="basis-1/2">
              <div className="relative">
                <img
                  src="/mission-optimized.webp"
                  alt="Our story"
                  className="rounded-2xl w-full object-cover shadow-lg"
                />
                {/* Floating accent card */}
                <div className="absolute -bottom-6 -right-6 hidden tablet:flex bg-gold text-white px-6 py-5 rounded-2xl shadow-xl flex-col items-center">
                  <span className="text-3xl font-bold leading-none">6+</span>
                  <span className="text-xs mt-1 tracking-widest font-semibold opacity-90">YEARS</span>
                </div>
              </div>
            </div>
            <div className="basis-1/2 space-y-5">
              <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Our Story</p>
              <h2 className="text-3xl tablet:text-4xl font-bold text-gray-900 leading-snug">
                Born from a passion for<br />
                <span className="text-gold">unforgettable travel</span>
              </h2>
              <p className="text-gray-600 leading-8 text-sm">
                Red Lobos Group was founded with a simple conviction: that short-term stays should
                feel anything but temporary. Frustrated by generic hotel rooms and impersonal
                accommodation, our founders set out to build a portfolio of beautifully furnished
                homes where guests could live, work, and unwind in real comfort.
              </p>
              <p className="text-gray-600 leading-8 text-sm">
                From our first property in London, we've grown to serve guests across five cities —
                each stay delivering the same promise: a spotlessly clean, stylishly appointed home,
                backed by a concierge team that's always one message away.
              </p>
              <button
                onClick={() => navigate("/properties")}
                className="mt-2 inline-block px-7 py-3 bg-gold text-white text-xs font-bold tracking-[0.12em] rounded-full hover:bg-black transition-colors"
              >
                EXPLORE OUR PROPERTIES
              </button>
            </div>
          </div>
        </section>

        {/* ── Mission & Vision ─────────────────────────────────────────────── */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Mission */}
            <div className="flex flex-col tablet:flex-row items-center gap-12 tablet:gap-20">
              <div className="basis-1/2 space-y-5 order-2 tablet:order-1">
                <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Our Mission</p>
                <h2 className="text-3xl font-bold text-gray-900 leading-snug">
                  To make premium short-let living{" "}
                  <span className="text-gold">accessible and effortless</span>
                </h2>
                <p className="text-gray-600 leading-8 text-sm">
                  We exist to remove every friction point between a guest and a perfect stay.
                  Whether you're visiting for business, a romantic escape, a family trip, or a
                  milestone celebration, our mission is to ensure you spend your time enjoying
                  the destination — not worrying about the accommodation.
                </p>
                <p className="text-gray-600 leading-8 text-sm">
                  Every property in our portfolio is personally vetted, professionally maintained,
                  and stocked with the thoughtful touches that transform a house into a home.
                </p>
              </div>
              <div className="basis-1/2 order-1 tablet:order-2">
                <img
                  src="/mission-optimized.webp"
                  loading="lazy"
                  decoding="async"
                  alt="Our mission"
                  className="rounded-2xl w-full object-cover shadow-md"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Vision */}
            <div className="flex flex-col tablet:flex-row items-center gap-12 tablet:gap-20">
              <div className="basis-1/2">
                <img
                  src="/vision-optimized.webp"
                  loading="lazy"
                  decoding="async"
                  alt="Our vision"
                  className="rounded-2xl w-full object-cover shadow-md"
                />
              </div>
              <div className="basis-1/2 space-y-5">
                <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Our Vision</p>
                <h2 className="text-3xl font-bold text-gray-900 leading-snug">
                  To be the UK's most{" "}
                  <span className="text-gold">trusted shortlet brand</span>
                </h2>
                <p className="text-gray-600 leading-8 text-sm">
                  We're building toward a future where every guest — wherever they are in the world —
                  immediately thinks of Red Lobos when they need a premium short-term home. A brand
                  synonymous with quality, reliability, and genuine hospitality.
                </p>
                <p className="text-gray-600 leading-8 text-sm">
                  We're investing in new locations, new experience packages, and new partnerships
                  to continuously raise the bar for what a shortlet stay can and should be.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── What we offer ────────────────────────────────────────────────── */}
        <section className="bg-green1 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase mb-3">What We Offer</p>
              <h2 className="text-3xl tablet:text-4xl font-bold text-gray-900">
                Everything you need for the perfect stay
              </h2>
              <p className="text-gray-500 mt-4 text-sm leading-7 max-w-xl mx-auto">
                Beyond four walls and a bed, we provide a complete, curated experience — from
                the moment you book to the morning you check out.
              </p>
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-52 overflow-hidden">
                  <img
                    src="/secondImage-optimized.webp"
                    loading="lazy"
                    decoding="async"
                    alt="Premium properties"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-2xl">🏡</span>
                  <h3 className="font-bold text-gray-900 tracking-wide text-sm">PREMIUM PROPERTIES</h3>
                  <p className="text-gray-500 text-sm leading-7">
                    Every property is hand-selected, professionally furnished, and inspected
                    before each stay. High-speed Wi-Fi, smart TVs, fully equipped kitchens,
                    and quality linens come standard.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-52 overflow-hidden">
                  <img
                    src="/romantic-dinner.jpg"
                    alt="Curated experiences"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-2xl">✨</span>
                  <h3 className="font-bold text-gray-900 tracking-wide text-sm">CURATED EXPERIENCES</h3>
                  <p className="text-gray-500 text-sm leading-7">
                    Elevate your stay with our in-property add-ons — romantic dinner setups,
                    proposal arrangements, paint and sip evenings, podcast studio sessions,
                    and more, delivered right to your door.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-52 overflow-hidden">
                  <img
                    src="/proposal-setup.jpg"
                    alt="24/7 concierge"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-2xl">🛎️</span>
                  <h3 className="font-bold text-gray-900 tracking-wide text-sm">24/7 CONCIERGE SUPPORT</h3>
                  <p className="text-gray-500 text-sm leading-7">
                    Our dedicated guest relations team is available around the clock. Need
                    extra towels at midnight? A late checkout? Restaurant recommendations?
                    We're always just a message away.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Our Values ───────────────────────────────────────────────────── */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase mb-3">Our Values</p>
              <h2 className="text-3xl font-bold text-gray-900">
                The principles that guide everything we do
              </h2>
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 gap-5">
              <ValueCard
                icon="🎯"
                title="QUALITY FIRST"
                body="We set a high bar for every property and experience. If it doesn't meet our standard, it doesn't enter our portfolio."
              />
              <ValueCard
                icon="🤝"
                title="GENUINE HOSPITALITY"
                body="Guests aren't bookings to us — they're people. We care about every detail of your stay, from arrival to departure."
              />
              <ValueCard
                icon="🔒"
                title="TRUST & TRANSPARENCY"
                body="No hidden fees. No nasty surprises. What you see on our listings is exactly what you get. We earn loyalty through honesty."
              />
              <ValueCard
                icon="🌱"
                title="CONTINUOUS IMPROVEMENT"
                body="We listen to every review and feedback. Our team is always looking for ways to make the next stay even better than the last."
              />
            </div>
          </div>
        </section>

        {/* ── Experiences gallery ───────────────────────────────────────────── */}
        <section className="bg-green1 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase mb-3">In-Stay Experiences</p>
              <h2 className="text-3xl font-bold text-gray-900">
                Make your stay unforgettable
              </h2>
              <p className="text-gray-500 mt-4 text-sm leading-7 max-w-xl mx-auto">
                Surprise a loved one, celebrate a milestone, or simply treat yourself.
                Our experience add-ons are designed to create memories that last long after check-out.
              </p>
            </div>

            <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
              <ExperienceCard
                src="/romantic-dinner.jpg"
                alt="Romantic dinner"
                title="ROMANTIC DINNER"
                description="Candlelit in-suite dining setup for two"
              />
              <ExperienceCard
                src="/proposal-setup-2.jpg"
                alt="Proposal setup"
                title="PROPOSAL SETUP"
                description="We set the scene for your perfect moment"
              />
              <ExperienceCard
                src="/paint-and-sip-event.jpg"
                alt="Paint and sip"
                title="PAINT & SIP"
                description="A fun creative evening with wine included"
              />
              <ExperienceCard
                src="/podcast-studio.jpg"
                alt="Podcast studio"
                title="PODCAST STUDIO"
                description="Professional recording setup in your property"
              />
            </div>
          </div>
        </section>

        {/* ── CTA strip ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <img
            src="/firstSittingRoom.png"
            alt="luxury interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative py-24 px-6 text-center">
            <p className="text-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Ready to stay?
            </p>
            <h2 className="text-white text-3xl tablet:text-5xl font-bold max-w-2xl mx-auto leading-tight">
              Book your perfect shortlet stay with Red Lobos
            </h2>
            <p className="text-white/70 mt-5 text-sm leading-7 max-w-lg mx-auto">
              Browse our handpicked collection of premium properties and secure your dates
              in minutes. Flexible stays, transparent pricing, unforgettable experiences.
            </p>
            <div className="flex flex-col tablet:flex-row gap-4 justify-center mt-10">
              <button
                onClick={() => navigate("/properties")}
                className="px-9 py-4 bg-gold text-white text-xs font-bold tracking-[0.12em] rounded-full hover:bg-white hover:text-gold transition-all duration-200"
              >
                BROWSE PROPERTIES
              </button>
              <button
                onClick={() => navigate("/contacts")}
                className="px-9 py-4 border border-white text-white text-xs font-bold tracking-[0.12em] rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                CONTACT US
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

export default About;
