import { useNavigate } from "react-router-dom";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";

export default function NotFound(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="" />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">
            Error 404
          </p>
          <h1 className="mt-4 text-4xl tablet:text-5xl font-bold text-gray-900">
            Page not found
          </h1>
          <p className="mt-4 text-gray-500 leading-7">
            The page you requested may have moved or no longer exists. Explore
            our available shortlet properties or return to the homepage.
          </p>
          <div className="mt-8 flex flex-col phone:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full phone:w-auto rounded-lg border border-gold px-6 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-white"
            >
              RETURN HOME
            </button>
            <button
              type="button"
              onClick={() => navigate("/properties")}
              className="w-full phone:w-auto rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              BROWSE PROPERTIES
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}