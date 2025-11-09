import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";
import Heading from "@/atoms/Heading";
import Button from "@/atoms/Button";
import logo from "../../../public/logoAnimation.gif";

function PaymentSuccess(): JSX.Element {
  const router = useRouter();
  const { session_id } = router.query;
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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <Heading Tag="h1" variant="xxl">
              <span className="text-green-600">Payment Successful!</span>
            </Heading>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Thank you for your reservation. Your payment has been processed successfully.
              </p>
              <p>
                A confirmation email has been sent to your email address with all the booking details.
              </p>
              {session_id && (
                <p className="text-sm text-gray-500">
                  Transaction ID: {session_id}
                </p>
              )}
            </div>

            <div className="pt-6 space-y-4">
              <Button
                variant="primary"
                width="full"
                onClick={() => router.push("/properties")}
              >
                BROWSE MORE PROPERTIES
              </Button>
              <Button
                variant="secondary"
                width="full"
                onClick={() => router.push("/")}
              >
                GO TO HOME
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default PaymentSuccess;
