import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useSession } from "../context/AuthContext";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import Modal from "@/molecules/Modal";
import BookingCalendar, { CalendarEvent } from "@/molecules/BookingCalendar";
import Calendar from "@/organisms/Calendar";
import { getPropertyDetails, getPropertyEvents } from "../api";

const PropertyMap = lazy(() => import("@/molecules/PropertyMap"));

// ─── Amenity icon map ─────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, string> = {
  "Free Wi-Fi": "📶",
  "Smart TV": "📺",
  "Fully Equipped Kitchen": "🍳",
  "Air Conditioning": "❄️",
  "Washing Machine": "🧺",
  "Iron & Ironing Board": "👔",
  "Private Balcony": "🌇",
  "Gym Access": "🏋️",
  "Private Garden": "🌳",
  "Parking Space": "🅿️",
  "Concierge Service": "🛎️",
  "Private Terrace": "☀️",
  "Thames View": "🌉",
  "Hyde Park Access": "🌿",
  "Valet Parking": "🚗",
};

function amenityIcon(name: string) {
  return AMENITY_ICONS[name] ?? "✓";
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PropertyImage {
  image_url: string;
  is_primary: boolean;
}

interface PropertyData {
  id: number;
  name: string;
  address: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  price_per_night: number;
  amenities: string[];
  images: PropertyImage[];
}

// ─── Page ────────────────────────────────────────────────────────────────────

function PropertyDetails(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { data: session, status: authStatus } = useSession();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState("1");
  const [propertyEvents, setPropertyEvents] = useState<CalendarEvent[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Geocode address via Nominatim (no API key required)
  const geocodeAddress = useCallback((address: string) => {
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    )
      .then((r) => r.json())
      .then((results) => {
        if (results?.[0]) {
          setCoordinates({
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
          });
        } else {
          // Default to central London
          setCoordinates({ lat: 51.5074, lng: -0.1278 });
        }
      })
      .catch(() => setCoordinates({ lat: 51.5074, lng: -0.1278 }));
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getPropertyDetails(id)
      .then((response: any) => {
        const data: PropertyData = response?.data?.data;
        if (!data) throw new Error("Not found");
        setProperty(data);
        geocodeAddress(data.address);
      })
      .catch(() => setError("Could not load property details. Please try again."))
      .finally(() => setLoading(false));
  }, [id, geocodeAddress]);

  const handleBookNowClick = () => {
    if (authStatus !== "authenticated") {
      navigate(`/signIn?redirect=${encodeURIComponent(`/propertyDetails?id=${id}`)}`);
      return;
    }
    setShowBookingModal(true);
    if (id) {
      getPropertyEvents(id)
        .then((res: any) => {
          const raw = res?.data?.data;
          setPropertyEvents(Array.isArray(raw) ? raw : []);
        })
        .catch(() => setPropertyEvents([]));
    }
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setCheckInDate(null);
    setCheckOutDate(null);
    setGuestCount("1");
    setPropertyEvents([]);
    setBookingError("");
  };

  const handleMakeReservation = async () => {
    if (!checkInDate || !checkOutDate) {
      setBookingError("Please select check-in and check-out dates.");
      return;
    }
    setBookingLoading(true);
    setBookingError("");
    try {
      const nights = differenceInCalendarDays(
        parseISO(checkOutDate),
        parseISO(checkInDate)
      );
      const pricePerNight = Number(property?.price_per_night ?? 0);
      const subtotal = nights * pricePerNight;
      const serviceFee = Math.round(subtotal * 0.12);
      const totalAmount = subtotal + serviceFee;

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          propertyId: id,
          propertyName: property?.name ?? "Property Reservation",
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: guestCount,
          totalAmount,
        }),
      });
      const responseText = await response.text();
      let data: { url?: string; message?: string } = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = {};
      }
      if (response.ok && data.url) {
        window.location.assign(data.url);
      } else {
        setBookingError(
          data.message ?? "Checkout could not be started. Please try again."
        );
      }
    } catch (error: any) {
      setBookingError(error?.message || "Checkout could not be started. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const images: PropertyImage[] = Array.isArray(property?.images) ? property.images : [];
  const amenities: string[] = Array.isArray(property?.amenities) ? property.amenities : [];

  const primaryImage =
    images.find((i) => i.is_primary)?.image_url ??
    images[0]?.image_url ??
    "/property1.jpg";

  const secondaryImages = images.filter((i) => !i.is_primary).slice(0, 4);

  const descriptionPreview = property?.description
    ? property.description.slice(0, 200) + (property.description.length > 200 ? " …" : "")
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="PROPERTIES" />

      {/* Page header */}
      <div className="text-center pt-12 pb-6 space-y-3 px-6">
        <Heading Tag="h1" variant="xxl">
          <span>PROPERTY DETAILS</span>
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
          <button
            type="button"
            className="hover:text-gold transition-colors"
            onClick={() => navigate("/properties")}
          >
            PROPERTIES
          </button>
          <span>&gt;</span>
          <span className="text-gray1">{property?.name ?? "DETAILS"}</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-4">
          <p className="text-gray1 text-lg">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/properties")}
            className="px-6 py-3 rounded-lg bg-gold text-white font-semibold hover:bg-black transition-colors duration-300"
          >
            BACK TO PROPERTIES
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && property && (
        <div className="flex-1 px-6 tablet:px-16 desktop:px-24 space-y-8 pb-16">

          {/* Image gallery */}
          <div className="w-full flex flex-col laptop:flex-row gap-4">
            {/* Primary image */}
            <div className="basis-1/2">
              <img
                src={primaryImage}
                alt={property.name}
                className="w-full h-[320px] laptop:h-[420px] object-cover rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/property1.jpg";
                }}
              />
            </div>

            {/* Secondary images grid */}
            {secondaryImages.length > 0 && (
              <div className="basis-1/2 grid grid-cols-2 gap-4">
                {secondaryImages.map((img, i) => (
                  <img
                    key={i}
                    src={img.image_url}
                    alt={`${property.name} ${i + 2}`}
                    className="w-full h-[196px] object-cover rounded-2xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/property1.jpg";
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Show all photos */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/photoGallery?id=${id}`)}
              className="px-6 py-2.5 rounded-lg bg-gold text-white text-sm font-semibold hover:bg-black transition-colors duration-300"
            >
              SHOW ALL PHOTOS
            </button>
          </div>

          {/* Property headline */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">{property.name}</h2>
            <div className="flex items-center gap-1.5 text-gray1 text-sm">
              <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{property.address}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-1">
              <span>🛏 {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}</span>
              <span>🚿 {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}</span>
              <span>👥 Up to {property.max_guests} guests</span>
              {property.price_per_night && (
                <span className="text-gold font-semibold">
                  £{Number(property.price_per_night).toFixed(0)} / night
                </span>
              )}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Description + Amenities */}
          <div className="flex flex-col tablet:flex-row gap-10">
            {/* Description */}
            <div className="basis-full tablet:basis-4/6 space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-700 leading-relaxed">{descriptionPreview}</p>
              {property.description.length > 200 && (
                <button
                  type="button"
                  onClick={() => setShowDescriptionModal(true)}
                  className="px-5 py-2 rounded-lg border border-gold text-gold text-sm font-semibold hover:bg-gold hover:text-white transition-colors duration-300"
                >
                  SHOW MORE
                </button>
              )}
            </div>

            {/* Amenities */}
            <div className="basis-full tablet:basis-2/6 space-y-4">
              <h3 className="text-lg font-semibold">What this place offers</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                {amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-base">{amenityIcon(amenity)}</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* CTA buttons */}
          <div className="flex flex-col tablet:flex-row gap-4">
            <button
              type="button"
              onClick={handleBookNowClick}
              className="flex-1 py-3 rounded-lg bg-gold text-white font-semibold tracking-wide hover:bg-black transition-colors duration-300"
            >
              {authStatus === "unauthenticated" ? "SIGN IN TO RESERVE" : "MAKE RESERVATION"}
            </button>
          </div>

          <hr className="border-gray-200" />

          {/* Map */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Where you will be</h3>
            <p className="text-gray-600 text-sm">{property.address}</p>
            <div className="rounded-2xl overflow-hidden relative z-0">
              {coordinates ? (
                <Suspense
                  fallback={
                    <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  <PropertyMap
                    latitude={coordinates.lat}
                    longitude={coordinates.lng}
                    propertyName={property.name}
                    address={property.address}
                  />
                </Suspense>
              ) : (
                <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Calendar overlay */}
      <Calendar isOpen={showCalendar} closeCalendar={setShowCalendar} />

      <Footer />

      {/* Description modal */}
      <Modal isOpen={showDescriptionModal} onClose={() => setShowDescriptionModal(false)}>
        <div className="space-y-6 p-6 max-w-2xl">
          <Heading Tag="h2" variant="lg">
            <span className="text-center block">About this property</span>
          </Heading>
          <h3 className="font-semibold text-xl text-gray-800">{property?.name}</h3>
          <p className="text-gray-700 leading-relaxed">{property?.description}</p>
          <button
            type="button"
            onClick={() => setShowDescriptionModal(false)}
            className="w-full py-3 rounded-lg bg-gold text-white font-semibold hover:bg-black transition-colors duration-300"
          >
            CLOSE
          </button>
        </div>
      </Modal>

      {/* Booking modal */}
      <Modal isOpen={showBookingModal} onClose={handleCloseBookingModal}>
        {(() => {
          const nights =
            checkInDate && checkOutDate
              ? differenceInCalendarDays(parseISO(checkOutDate), parseISO(checkInDate))
              : 0;
          const pricePerNight = Number(property?.price_per_night ?? 0);
          const subtotal = nights * pricePerNight;
          const serviceFee = Math.round(subtotal * 0.12);
          const total = subtotal + serviceFee;

          const step = !checkInDate
            ? "checkin"
            : !checkOutDate
            ? "checkout"
            : "summary";

          return (
            <div className="p-6 w-full max-w-xl mx-auto space-y-5">
              {/* Header */}
              <div className="text-center">
                <Heading Tag="h2" variant="lg">
                  <span>Make a Reservation</span>
                </Heading>
                {property && (
                  <p className="text-gray1 text-sm mt-1">{property.name}</p>
                )}
              </div>

              {/* Step hint */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span
                  className={
                    step === "checkin"
                      ? "font-semibold text-gold"
                      : "text-gray-400"
                  }
                >
                  1. Pick check-in
                </span>
                <span className="text-gray-300">→</span>
                <span
                  className={
                    step === "checkout"
                      ? "font-semibold text-gold"
                      : "text-gray-400"
                  }
                >
                  2. Pick check-out
                </span>
                <span className="text-gray-300">→</span>
                <span
                  className={
                    step === "summary"
                      ? "font-semibold text-gold"
                      : "text-gray-400"
                  }
                >
                  3. Confirm
                </span>
              </div>

              {/* Calendar */}
              <BookingCalendar
                events={propertyEvents}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onCheckInSelect={(date) => {
                  setCheckInDate(date);
                  setCheckOutDate(null);
                }}
                onCheckOutSelect={(date) => setCheckOutDate(date)}
                currentDate={calendarDate}
                onMonthChange={setCalendarDate}
              />

              {/* Summary — shown once both dates chosen */}
              {step === "summary" && nights > 0 && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  {/* Date row */}
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    <div className="p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                        Check-in
                      </p>
                      <p className="font-semibold text-gray-800 text-sm">
                        {new Date(checkInDate!).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                        Check-out
                      </p>
                      <p className="font-semibold text-gray-800 text-sm">
                        {new Date(checkOutDate!).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="bg-green1 px-4 py-3 space-y-2 text-sm border-t border-gray-100">
                    <div className="flex justify-between text-gray-600">
                      <span>
                        £{pricePerNight.toFixed(0)} × {nights}{" "}
                        {nights === 1 ? "night" : "nights"}
                      </span>
                      <span>£{subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service fee</span>
                      <span>£{serviceFee.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>£{total.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Guests */}
              <div>
                <label
                  htmlFor="guests"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
                >
                  Guests
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((g) =>
                        String(Math.max(1, parseInt(g) - 1))
                      )
                    }
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gold hover:text-gold transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-800">
                    {guestCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((g) =>
                        String(
                          Math.min(
                            property?.max_guests ?? 10,
                            parseInt(g) + 1
                          )
                        )
                      )
                    }
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gold hover:text-gold transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-400">
                    (max {property?.max_guests ?? 10})
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                disabled={bookingLoading || step !== "summary" || nights <= 0}
                onClick={handleMakeReservation}
                className="w-full py-3.5 rounded-xl bg-gold text-white font-semibold tracking-wide hover:bg-black transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {bookingLoading
                  ? "Processing…"
                  : step !== "summary"
                  ? "Select your dates above"
                  : `Proceed to Checkout · £${total.toFixed(0)}`}
              </button>

              {bookingError && (
                <p role="alert" className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {bookingError}
                </p>
              )}

              {step !== "summary" && (
                <p className="text-center text-xs text-gray-400">
                  Grayed-out dates are already booked
                </p>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

export default PropertyDetails;
