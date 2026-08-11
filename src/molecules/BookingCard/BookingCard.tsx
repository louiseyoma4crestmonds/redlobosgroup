import React, { useState } from "react";
import Heading from "@/atoms/Heading";

interface BookingCardProps {
  serviceId: number;
  serviceName: string;
}

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM",
  "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM",
];

type Status = "idle" | "loading" | "success" | "error";

function BookingCard({ serviceId, serviceName }: BookingCardProps): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Minimum date = today
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/addon-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          serviceName,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          preferredDate: date,
          preferredTime: time,
          message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center px-10 py-16 max-w-[600px] tablet:mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-gold flex items-center justify-center">
          <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <Heading Tag="h2" className="text-center">BOOKING REQUEST SENT!</Heading>
        <p className="text-gray-600 leading-relaxed">
          Thank you, <strong>{name}</strong>. We've received your request for{" "}
          <strong>{serviceName}</strong> and will be in touch at{" "}
          <strong>{email}</strong> shortly to confirm.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setName(""); setEmail(""); setPhone("");
            setDate(""); setTime(""); setMessage("");
          }}
          className="px-8 py-3 rounded-lg border border-gold text-gold font-semibold hover:bg-gold hover:text-white transition-colors duration-300"
        >
          Make Another Booking
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="px-6 tablet:px-0 max-w-[600px] tablet:mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gold px-8 py-6">
          <Heading Tag="h2" className="text-center text-white">
            BOOK THIS SERVICE
          </Heading>
          <p className="text-center text-white/80 text-sm mt-1">{serviceName}</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
          {/* Name + Email */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Your Name *</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email Address *</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 7700 000000"
              className={inputClass}
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Preferred Date *</label>
              <input
                required
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Preferred Time</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              >
                <option value="">Select a time slot</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className={labelClass}>Additional Details</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us anything we should know — guest count, special requests, occasion details…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Error */}
          {status === "error" && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 rounded-xl bg-gold text-white font-bold tracking-wider text-sm hover:bg-black transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Sending…
              </span>
            ) : (
              "CONFIRM BOOKING"
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            We'll confirm your booking via email within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}

export default BookingCard;
