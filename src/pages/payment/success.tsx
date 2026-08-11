import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    fetch(`/api/stripe/checkout-session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => setDetails(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="PROPERTIES" />

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-10 text-center space-y-6">
          {/* Check icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Booking Confirmed!
            </h1>
            <p className="text-gray-500 text-sm">
              Your reservation has been successfully placed.
            </p>
          </div>

          {!loading && details?.metadata && (
            <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 text-left text-sm">
              <div className="px-4 py-3 flex justify-between">
                <span className="text-gray-500">Property</span>
                <span className="font-medium text-gray-800">
                  {details.metadata.propertyName ?? "—"}
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between">
                <span className="text-gray-500">Check-in</span>
                <span className="font-medium text-gray-800">
                  {details.metadata.checkIn
                    ? new Date(details.metadata.checkIn).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" }
                      )
                    : "—"}
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between">
                <span className="text-gray-500">Check-out</span>
                <span className="font-medium text-gray-800">
                  {details.metadata.checkOut
                    ? new Date(details.metadata.checkOut).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" }
                      )
                    : "—"}
                </span>
              </div>
              <div className="px-4 py-3 flex justify-between">
                <span className="text-gray-500">Guests</span>
                <span className="font-medium text-gray-800">
                  {details.metadata.guests ?? "—"}
                </span>
              </div>
              {details.amount_total != null && (
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-500">Total paid</span>
                  <span className="font-bold text-gray-900">
                    £{(details.amount_total / 100).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400">
            A confirmation email will be sent to the address on file.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/properties")}
              className="w-full py-3 rounded-xl bg-gold text-white font-semibold hover:bg-black transition-colors duration-300"
            >
              Browse More Properties
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:border-gold hover:text-gold transition-colors duration-300"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
