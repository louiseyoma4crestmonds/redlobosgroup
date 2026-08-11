import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";

// ── Info tile ─────────────────────────────────────────────────────────────────
function InfoTile({ icon, label, value, href }: {
  icon: string; label: string; value: string; href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full">
      <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-bold tracking-[0.14em] text-gold uppercase mb-1">{label}</p>
        <p className="text-sm text-gray-700 leading-6">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block h-full">{inner}</a>
  ) : (
    <div className="h-full">{inner}</div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm " +
  "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all";

// ── Main component ────────────────────────────────────────────────────────────
function Contacts(): JSX.Element {
  const navigate = useNavigate();
  const [introPage, setIntroPage] = useState(true);

  // Form state
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "", terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setIntroPage(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  const set = (k: string, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.subject.trim()) e.subject = "Please choose a subject.";
    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters.";
    if (!form.terms) e.terms = "You must accept the terms to proceed.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "", terms: false });
    } catch (err: any) {
      setStatus("error");
      setServerError(err.message || "Failed to send. Please try again.");
    }
  };

  return (
    <div>
      {/* Splash */}
      <div className={!introPage ? "hidden" : ""}>
        <div className="w-screen h-screen flex place-content-center bg-green1">
          <div className="self-center">
            <img width={200} height={200} src="/logoAnimation.gif" alt="logo" />
          </div>
        </div>
      </div>

      <div className={introPage ? "hidden" : ""}>
        <UtilityBar activeLink="CONTACTS" />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative h-80 tablet:h-96 overflow-hidden">
          <img
            src="/secondImage.jpg"
            alt="Contact Red Lobos Group"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
            <p className="text-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Get in Touch
            </p>
            <h1 className="text-white text-4xl tablet:text-5xl font-bold leading-tight">
              We'd love to hear from you
            </h1>
            <p className="text-white/70 mt-4 text-sm leading-7 max-w-md">
              Whether you have a question about a property, a booking, or anything else — our
              team is ready to help.
            </p>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mt-6 text-white/40 text-xs tracking-wider">
              <button onClick={() => navigate("/")} className="hover:text-gold transition-colors">
                HOME
              </button>
              <span>&gt;</span>
              <span className="text-white/70">CONTACT</span>
            </div>
          </div>
        </section>

        {/* ── Info tiles ───────────────────────────────────────────────────── */}
        <section className="bg-green1 py-16 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 tablet:grid-cols-3 gap-5">
            <InfoTile
              icon="📍"
              label="Our Office"
              value={"71–75 Shelton Street\nCovent Garden\nLondon, WC2H 9JQ"}
            />
            <InfoTile
              icon="✉️"
              label="Email Us"
              value="prisca@redlobosgroup.com"
              href="mailto:prisca@redlobosgroup.com"
            />
            <InfoTile
              icon="📞"
              label="Call Us"
              value="+44 7424 733629"
              href="tel:+447424733629"
            />
          </div>
        </section>

        {/* ── Map ──────────────────────────────────────────────────────────── */}
        <section className="px-6 pb-0 bg-green1">
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <iframe
              title="Red Lobos Group office location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2482.907826319617!2d-0.12615912340288685!3d51.514907010155014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sng!4v1692522995835!5m2!1sen!2sng"
              className="w-full h-64 tablet:h-96 block"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* ── Contact form ─────────────────────────────────────────────────── */}
        <section className="bg-green1 py-20 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase mb-3">
                Send a Message
              </p>
              <h2 className="text-3xl tablet:text-4xl font-bold text-gray-900">
                Let's make something great together
              </h2>
              <p className="text-gray-500 mt-4 text-sm leading-7 max-w-lg mx-auto">
                Fill in the form and our team will get back to you within one business day.
              </p>
            </div>

            {/* Success state */}
            {status === "success" && (
              <div
                ref={successRef}
                className="mb-8 flex items-start gap-4 bg-white border border-green-100 rounded-2xl p-6 shadow-sm"
              >
                <span className="text-3xl">✅</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Message sent!</h3>
                  <p className="text-sm text-gray-500 leading-6">
                    Thank you for reaching out. A member of our team will be in touch with
                    you shortly. In the meantime, feel free to browse our properties.
                  </p>
                  <button
                    onClick={() => navigate("/properties")}
                    className="mt-4 inline-block px-6 py-2.5 bg-gold text-white text-xs font-bold tracking-[0.1em] rounded-full hover:bg-black transition-colors"
                  >
                    BROWSE PROPERTIES
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            {status !== "success" && (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 tablet:p-10 space-y-6"
              >
                {/* Row 1 — name + email */}
                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5">
                  <Field label="Full Name *" error={errors.name}>
                    <input
                      className={inputCls}
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </Field>
                  <Field label="Email Address *" error={errors.email}>
                    <input
                      type="email"
                      className={inputCls}
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </Field>
                </div>

                {/* Row 2 — phone + subject */}
                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5">
                  <Field label="Phone Number">
                    <input
                      type="tel"
                      className={inputCls}
                      placeholder="+44 7700 000000"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </Field>
                  <Field label="Subject *" error={errors.subject}>
                    <select
                      className={inputCls + " cursor-pointer"}
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                    >
                      <option value="">Select a subject…</option>
                      <option>General Enquiry</option>
                      <option>Property Booking</option>
                      <option>Add-On Experience</option>
                      <option>Corporate / Long Stay</option>
                      <option>Partnership &amp; Listing</option>
                      <option>Feedback &amp; Complaint</option>
                      <option>Other</option>
                    </select>
                  </Field>
                </div>

                {/* Message */}
                <Field label="Message *" error={errors.message}>
                  <textarea
                    rows={6}
                    className={inputCls + " resize-none"}
                    placeholder="Tell us how we can help…"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-400 text-right">
                    {form.message.length} / min 20 characters
                  </p>
                </Field>

                {/* Terms */}
                <div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-0.5 accent-gold cursor-pointer w-4 h-4 flex-shrink-0"
                      checked={form.terms}
                      onChange={(e) => set("terms", e.target.checked)}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer leading-6">
                      I accept the{" "}
                      <span className="font-semibold text-gray-800">Terms &amp; Conditions</span>{" "}
                      and consent to my data being processed to handle this enquiry.
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="mt-1.5 text-xs text-red-500 ml-7">{errors.terms}</p>
                  )}
                </div>

                {/* Server error */}
                {status === "error" && serverError && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    <span>⚠️</span>
                    <p className="text-sm text-red-600">{serverError}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-4 rounded-full bg-gold text-white text-xs font-bold tracking-[0.15em] hover:bg-black transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "sending" ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      SENDING…
                    </>
                  ) : (
                    "SEND MESSAGE"
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── Response time strip ───────────────────────────────────────────── */}
        <section className="bg-white border-t border-gray-100 py-10 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 tablet:grid-cols-3 gap-6 text-center">
            {[
              { icon: "⚡", title: "Fast Response", body: "We aim to reply to all enquiries within one business day." },
              { icon: "🔒", title: "100% Confidential", body: "Your information is never shared with any third parties." },
              { icon: "🌟", title: "Expert Advice", body: "Our team knows every property inside out and can match you to the perfect stay." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex flex-col items-center gap-3 px-4">
                <span className="text-3xl">{icon}</span>
                <h4 className="text-sm font-bold tracking-wide text-gray-900">{title}</h4>
                <p className="text-sm text-gray-500 leading-6">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

export default Contacts;
