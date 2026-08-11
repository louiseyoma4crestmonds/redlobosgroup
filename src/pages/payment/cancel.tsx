import { useNavigate } from "react-router-dom";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="PROPERTIES" />

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-10 text-center space-y-6">
          {/* X icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Cancelled
            </h1>
            <p className="text-gray-500 text-sm">
              Your booking was not completed. No payment has been taken.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 rounded-xl bg-gold text-white font-semibold hover:bg-black transition-colors duration-300"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => navigate("/properties")}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:border-gold hover:text-gold transition-colors duration-300"
            >
              Browse Properties
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
