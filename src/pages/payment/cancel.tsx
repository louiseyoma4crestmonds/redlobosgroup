import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";
import Heading from "@/atoms/Heading";
import Button from "@/atoms/Button";
import logo from "../../../public/logoAnimation.gif";

function PaymentCancel(): JSX.Element {
  const router = useRouter();
  const [introPage, setIntroPage] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroPage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className={!introPage ? "hidden" : ""}>
        <div className="w-screen h-screen flex place-content-center bg-green1">
          <div className="self-center">
            <Image width={200} height={200} src={logo} alt="Logo" />
          </div>
        </div>
      </div>

      <div className={introPage ? "hidden" : ""}>
        <UtilityBar activeLink="" />

        <div className="min-h-screen bg-green1 px-6 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <Heading Tag="h1" variant="xxl">
              <span className="text-red-600">Payment Cancelled</span>
            </Heading>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Your payment was cancelled. No charges were made to your account.
              </p>
              <p>
                If you encountered any issues during checkout, please try again or contact our support team.
              </p>
            </div>

            <div className="pt-6 space-y-4">
              <Button
                variant="primary"
                width="full"
                onClick={() => router.back()}
              >
                TRY AGAIN
              </Button>
              <Button
                variant="secondary"
                width="full"
                onClick={() => router.push("/properties")}
              >
                BROWSE PROPERTIES
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default PaymentCancel;
