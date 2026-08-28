import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/AuthContext";
import UtilityBar from "../../organisms/UtilityBar/UtilityBar";

interface Property {
  id: number;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  price_per_night: number;
  is_available: boolean;
  primary_image: string | null;
}

interface AdminBooking {
  id: number;
  user_email: string;
  property_name: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  amount_total: number | null;
  currency: string | null;
  payment_status: string | null;
  next_available_date: string;
}

function formatBookingDate(date: string) {
  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatBookingAmount(amount: number | null, currency: string | null) {
  if (amount == null) return "—";
  const code = (currency ?? "gbp").toUpperCase();
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: code,
  }).format(amount / 100);
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState("");

  const isAdmin = !!(session?.isAdmin);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || !isAdmin) {
      navigate(status === "unauthenticated" ? "/admin/login" : "/");
      return;
    }
    fetchProperties();
    fetchBookings();
  }, [status, isAdmin]);

  async function fetchProperties() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/properties", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load properties");
      const json = await res.json();
      setProperties(json.data);
    } catch {
      setError("Could not load properties. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookings() {
    setLoadingBookings(true);
    setBookingError("");
    try {
      const res = await fetch("/api/admin/bookings", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load bookings");
      const json = await res.json();
      setBookings(json.data ?? []);
    } catch {
      setBookingError("Could not load reservations. Check your connection.");
    } finally {
      setLoadingBookings(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete property.");
    } finally {
      setDeletingId(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading…</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <UtilityBar activeLink="ADMIN" />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 mt-1">Manage properties, amenities and images</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {session?.isOwner && (
              <button
                type="button"
                onClick={() => navigate("/admin/accounts")}
                className="rounded-lg border border-[#c9a96e] px-4 py-3 font-semibold text-[#927344] transition-colors hover:bg-[#c9a96e] hover:text-white"
              >
                Manage Admins
              </button>
            )}
            <button
              onClick={() => navigate("/admin/properties/new")}
              className="bg-[#c9a96e] hover:bg-[#b8945a] text-white font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="text-xl leading-none">+</span> Add Property
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Reservations */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reservations</h2>
              <p className="text-sm text-gray-500 mt-1">
                Paid bookings, guest details and property availability
              </p>
            </div>
            <button
              type="button"
              onClick={fetchBookings}
              disabled={loadingBookings}
              className="px-3 py-1.5 text-sm font-medium text-[#c9a96e] border border-[#c9a96e] rounded-lg hover:bg-[#c9a96e] hover:text-white transition-colors disabled:opacity-50"
            >
              {loadingBookings ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {bookingError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {bookingError}
            </div>
          )}

          {loadingBookings ? (
            <div className="bg-white rounded-xl h-32 animate-pulse border border-gray-100" />
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 py-10 text-center">
              <p className="text-gray-400">No paid reservations yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-100">
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">Property</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Booked by</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Stay dates</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Cost</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Next available</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-900 text-sm">
                          {booking.property_name ?? "Property reservation"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{booking.user_email}</span>
                        <span className="block text-xs text-gray-400 mt-0.5">
                          {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">
                          {formatBookingDate(booking.check_in)} — {formatBookingDate(booking.check_out)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-gray-900 text-sm">
                          {formatBookingAmount(booking.amount_total, booking.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-green-700">
                          {formatBookingDate(booking.next_available_date)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 capitalize">
                          {booking.payment_status ?? "paid"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Loading */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 py-20 text-center">
            <p className="text-gray-400 text-lg">No properties yet.</p>
            <button
              onClick={() => navigate("/admin/properties/new")}
              className="mt-4 text-[#c9a96e] font-semibold underline"
            >
              Add your first property
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Property</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4 hidden md:table-cell">Details</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4 hidden lg:table-cell">Price / night</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Property name + thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.primary_image ? (
                          <img
                            src={p.primary_image}
                            alt={p.name}
                            className="w-12 h-10 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-300 text-xs">No img</span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                          <div className="text-gray-400 text-xs mt-0.5 truncate max-w-[180px]">{p.address}</div>
                        </div>
                      </div>
                    </td>

                    {/* Beds / baths */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {p.bedrooms} bed · {p.bathrooms} bath · {p.max_guests} guests
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm font-medium text-gray-800">
                        ${Number(p.price_per_night).toLocaleString()}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.is_available
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {p.is_available ? "Available" : "Hidden"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/properties/${p.id}`)}
                          className="px-3 py-1.5 text-sm font-medium text-[#c9a96e] border border-[#c9a96e] rounded-lg hover:bg-[#c9a96e] hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="px-3 py-1.5 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                        >
                          {deletingId === p.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats bar */}
        {!loading && properties.length > 0 && (
          <div className="mt-6 flex gap-4 flex-wrap">
            <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-900">{properties.length}</div>
              <div className="text-sm text-gray-500">Total properties</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-3">
              <div className="text-2xl font-bold text-green-600">{properties.filter(p => p.is_available).length}</div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-400">{properties.filter(p => !p.is_available).length}</div>
              <div className="text-sm text-gray-500">Hidden</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
