import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "../context/AuthContext";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import Modal from "@/molecules/Modal";
import BookingCalendar from "@/molecules/BookingCalendar";
import { getProperties, getPropertyEvents } from "../api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Property {
  id: number;
  name: string;
  address: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  price_per_night?: number;
  primary_image?: string | null;
  [key: string]: unknown;
}

// ─── Skeleton card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-3 pt-2">
          <div className="h-10 bg-gray-200 rounded-lg flex-1" />
          <div className="h-10 bg-gray-200 rounded-lg flex-1" />
        </div>
      </div>
    </div>
  );
}

// ─── Property card ───────────────────────────────────────────────────────────

interface PropertyCardProps {
  property: Property;
  onBook: (property: Property) => void;
}

function PropertyCard({ property, onBook }: PropertyCardProps) {
  const navigate = useNavigate();
  // primary_image is already included in the list response via JOIN — no extra fetch needed
  const imgSrc = (property.primary_image as string | null) ?? "/property1.jpg";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        <img
          src={imgSrc ?? "/property1.jpg"}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/property1.jpg";
          }}
        />
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Address */}
        <div className="flex items-start gap-1.5 text-sm text-gray1">
          <svg
            className="w-4 h-4 mt-0.5 shrink-0 text-gold"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="leading-tight">{property.address}</span>
        </div>

        {/* Name */}
        <h3
          className="text-xl font-bold text-gray-800 hover:text-gold cursor-pointer transition-colors duration-200"
          onClick={() => navigate(`/propertyDetails?id=${property.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              navigate(`/propertyDetails?id=${property.id}`);
          }}
        >
          {property.name}
        </h3>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onBook(property)}
            className="flex-1 py-2.5 px-4 rounded-lg bg-gold text-white font-semibold text-sm hover:bg-black transition-colors duration-300"
          >
            BOOK NOW
          </button>
          <button
            type="button"
            onClick={() => navigate(`/propertyDetails?id=${property.id}`)}
            className="flex-1 py-2.5 px-4 rounded-lg border border-gold text-gold font-semibold text-sm hover:bg-gold hover:text-white transition-colors duration-300"
          >
            VIEW DETAILS
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

function Properties(): JSX.Element {
  const navigate = useNavigate();
  const { data: session, status: authStatus } = useSession();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState("1");
  const [propertyEvents, setPropertyEvents] = useState<any[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchProperties = useCallback(() => {
    setLoading(true);
    setError(null);
    getProperties()
      .then((response: any) => {
        // DB-backed API returns { data: [ ...properties ] }
        const raw = response?.data?.data;
        const list: Property[] = Array.isArray(raw) ? raw : [];
        setProperties(list);
      })
      .catch(() => {
        setError("Could not load properties. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleBookNowClick = (property: Property) => {
    if (authStatus !== "authenticated") {
      navigate(`/signIn?redirect=/properties`);
      return;
    }
    setSelectedProperty(property);
    setIsModalOpen(true);
    getPropertyEvents(property.id)
      .then((res: any) => {
        const raw = res?.data?.data;
        setPropertyEvents(
          Array.isArray(raw?.[0]) ? raw[0] : Array.isArray(raw) ? raw : []
        );
      })
      .catch(() => setPropertyEvents([]));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCheckInDate(null);
    setCheckOutDate(null);
    setGuestCount("1");
    setPropertyEvents([]);
  };

  const handleMakeReservation = async () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    setBookingLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedProperty?.id,
          propertyName: selectedProperty?.name ?? "Property Reservation",
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: guestCount,
        }),
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message ?? "Failed to create checkout session. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="PROPERTIES" />

      {/* Page header */}
      <div className="text-center pt-12 pb-4 space-y-3 px-6">
        <Heading Tag="h1" variant="xxl">
          <span>PROPERTIES</span>
        </Heading>
        <div className="flex gap-2 place-content-center text-sm">
          <button
            type="button"
            className="hover:text-gold transition-colors"
            onClick={() => navigate("/")}
          >
            HOME
          </button>
          <span>&gt;</span>
          <span className="text-gray1">PROPERTIES</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 tablet:px-24 py-10">
        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
            <div className="text-5xl">🏠</div>
            <p className="text-gray1 text-lg">{error}</p>
            <button
              type="button"
              onClick={fetchProperties}
              className="mt-2 px-6 py-3 rounded-lg bg-gold text-white font-semibold hover:bg-black transition-colors duration-300"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
            <div className="text-5xl">🏠</div>
            <p className="text-gray1 text-lg">No properties available at the moment.</p>
            <p className="text-gray1 text-sm">Please check back soon.</p>
          </div>
        )}

        {/* Property grid */}
        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onBook={handleBookNowClick}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Booking modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="space-y-6 p-6 max-w-2xl mx-auto">
          <div className="text-center">
            <Heading Tag="h2" variant="lg">
              <span>Book Your Stay</span>
            </Heading>
            {selectedProperty && (
              <p className="text-gray1 mt-1 text-sm">{selectedProperty.name}</p>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-3">
                Select check-in and check-out dates
              </p>
              <BookingCalendar
                events={propertyEvents}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onCheckInSelect={(date) => setCheckInDate(date)}
                onCheckOutSelect={(date) => setCheckOutDate(date)}
              />
            </div>

            {checkInDate && checkOutDate && (
              <div className="bg-green1 border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-gray-500">Check-in</p>
                    <p className="font-semibold">{checkInDate}</p>
                  </div>
                  <span className="text-gray-400 text-lg">→</span>
                  <div className="text-right">
                    <p className="text-gray-500">Check-out</p>
                    <p className="font-semibold">{checkOutDate}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="guest-count"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Number of guests
              </label>
              <input
                id="guest-count"
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
              />
            </div>

            <button
              type="button"
              disabled={bookingLoading || !checkInDate || !checkOutDate}
              onClick={handleMakeReservation}
              className="w-full py-3 rounded-lg bg-gold text-white font-semibold tracking-wide hover:bg-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? "Processing…" : "MAKE RESERVATION"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Properties;
