import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";

function Checkout(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;

    const propertyId = searchParams.get("propertyId");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = searchParams.get("guests");

    if (!propertyId || !checkIn || !checkOut || !guests) {
      setError("Your reservation details are incomplete. Please select your dates again.");
      return;
    }

    startedRef.current = true;

    const createCheckoutSession = async () => {
      try {
        const response = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            propertyId,
            propertyName: searchParams.get("propertyName") ?? "Property Reservation",
            checkIn,
            checkOut,
            guests,
            totalAmount: searchParams.get("totalAmount") ?? undefined,
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
          return;
        }

        setError(data.message ?? "Checkout could not be started. Please try again.");
      } catch (requestError: any) {
        setError(
          requestError?.message ??
            "Checkout could not be started. Please check your connection and try again."
        );
      }
    };

    void createCheckoutSession();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="PROPERTIES" />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center">
          {error ? (
            <>
              <h1 className="text-2xl font-semibold text-gray-900">
                Checkout unavailable
              </h1>
              <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
              <button
                type="button"
                onClick={() => navigate("/properties")}
                className="mt-6 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                RETURN TO PROPERTIES
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              <h1 className="mt-6 text-2xl font-semibold text-gray-900">
                Preparing your checkout
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                You are being securely redirected to Stripe.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;