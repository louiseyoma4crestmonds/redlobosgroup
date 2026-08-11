import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, signOut } from "../context/AuthContext";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";

interface Booking {
  id: number;
  property_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  amount_total: number | null;
  currency: string;
  payment_status: string;
  stripe_session_id: string;
  created_at: string;
  address: string | null;
  property_image: string | null;
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function nights(checkIn: string, checkOut: string) {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function StatusBadge({ status }: { status: string }) {
  const colour =
    status === "paid"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-gray-50 text-gray-500 border-gray-200";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${colour}`}
    >
      {status}
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Redirect unauthenticated visitors
  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/signIn?redirect=/dashboard");
    }
  }, [status, navigate]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => setBookings(data?.data ?? []))
      .catch(() => setBookings([]))
      .finally(() => setLoadingBookings(false));
  }, [status]);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter((b) => b.check_out >= today);
  const past = bookings.filter((b) => b.check_out < today);

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="DASHBOARD" />

      {/* Breadcrumb */}
      <div className="flex gap-2 items-center px-6 tablet:px-28 pt-8 text-sm text-gray-500">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="hover:text-gold transition-colors"
        >
          HOME
        </button>
        <span>&gt;</span>
        <span className="text-gray1">DASHBOARD</span>
      </div>

      <div className="flex-1 px-6 tablet:px-28 py-10 space-y-10">
        {/* Profile card */}
        {session && (
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col tablet:flex-row items-start tablet:items-center gap-6">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name ?? ""}
                width={72}
                height={72}
                referrerPolicy="no-referrer"
                className="rounded-full border-2 border-gold/30 shrink-0"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-amber-50 border-2 border-gold/30 flex items-center justify-center text-gold text-2xl font-bold shrink-0">
                {session.user?.name?.[0] ?? "?"}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
                {session.user?.name ?? "Guest"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{session.user?.email}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/properties")}
                className="px-5 py-2.5 rounded-lg bg-gold text-white font-semibold text-sm hover:bg-black transition-colors duration-300"
              >
                Browse Properties
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="px-5 py-2.5 rounded-lg border border-gold text-gold font-semibold text-sm hover:bg-gold hover:text-white transition-colors duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
          {[
            { label: "Total Bookings", value: bookings.length },
            { label: "Upcoming Stays", value: upcoming.length },
            { label: "Past Stays", value: past.length },
            {
              label: "Total Spent",
              value: bookings.length
                ? `£${(bookings.reduce((s, b) => s + (b.amount_total ?? 0), 0) / 100).toFixed(0)}`
                : "£0",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm p-5 text-center"
            >
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Bookings section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 tracking-wide">
            My Reservations
          </h2>

          {loadingBookings ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center space-y-4">
              <div className="text-5xl">🏡</div>
              <p className="font-semibold text-gray-700">No reservations yet</p>
              <p className="text-sm text-gray-400">
                Browse our properties and make your first booking.
              </p>
              <button
                type="button"
                onClick={() => navigate("/properties")}
                className="mt-2 px-6 py-2.5 rounded-lg bg-gold text-white font-semibold text-sm hover:bg-black transition-colors duration-300"
              >
                Explore Properties
              </button>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                    Upcoming
                  </h3>
                  {upcoming.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
              {past.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mt-6">
                    Past stays
                  </h3>
                  {past.map((b) => (
                    <BookingCard key={b.id} booking={b} muted />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}

function BookingCard({ booking: b, muted = false }: { booking: Booking; muted?: boolean }) {
  const n = nights(b.check_in, b.check_out);

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col tablet:flex-row ${
        muted ? "opacity-70" : ""
      }`}
    >
      {/* Property image */}
      {b.property_image ? (
        <img
          src={b.property_image}
          alt={b.property_name}
          className="w-full tablet:w-48 h-36 tablet:h-auto object-cover shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="w-full tablet:w-48 h-36 tablet:h-auto bg-amber-50 flex items-center justify-center text-4xl shrink-0">
          🏡
        </div>
      )}

      {/* Details */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-gray-900 text-lg leading-tight">
              {b.property_name}
            </p>
            {b.address && (
              <p className="text-xs text-gray-400 mt-0.5">{b.address}</p>
            )}
          </div>
          <StatusBadge status={b.payment_status} />
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Check-in</p>
            <p className="font-medium text-gray-800">{fmt(b.check_in)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Check-out</p>
            <p className="font-medium text-gray-800">{fmt(b.check_out)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Guests</p>
            <p className="font-medium text-gray-800">{b.guests}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {n} {n === 1 ? "night" : "nights"}
          </span>
          {b.amount_total != null && (
            <span className="font-bold text-gray-900">
              £{(b.amount_total / 100).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
