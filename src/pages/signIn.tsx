import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession, signOut } from "../context/AuthContext";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: session, status } = useSession();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  // The redirect destination — where to go after sign-in
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Already signed in → go straight to the redirect target
  useEffect(() => {
    if (status === "authenticated") {
      navigate(redirectTo);
    }
  }, [status, navigate, redirectTo]);

  // Kick off Google OAuth, preserving the redirect target through the round-trip
  const handleGoogleSignIn = () => {
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectTo)}`;
  };

  const handleAdminSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setAdminError("");
    setAdminLoading(true);

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to sign in.");
      navigate("/admin");
    } catch (error: any) {
      setAdminError(error.message || "Unable to sign in.");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="signIn" />

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
        <span className="text-gray1">SIGN IN</span>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Card header */}
          <div className="bg-redLobosBackground px-8 py-10 text-center">
            <img
              src="/redlobosLogo.png"
              alt="Red Lobos Group"
              width={90}
              height={80}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold tracking-widest text-gray-800">
              RED LOBOS GROUP
            </h1>
            <p className="mt-2 text-sm text-gray1 tracking-wide">
              Property &amp; Venue Booking
            </p>
          </div>

          {/* Card body */}
          <div className="px-8 py-10">
            {status === "loading" ? (
              <div className="flex justify-center py-4">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : session ? (
              <div className="text-center space-y-6">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={64}
                    height={64}
                    className="rounded-full mx-auto"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-800">{session.user?.name}</p>
                  <p className="text-sm text-gray1">{session.user?.email}</p>
                </div>
                <p className="text-sm text-gray1">You are already signed in.</p>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="w-full py-3 rounded-lg bg-gold text-white font-semibold tracking-wide hover:bg-black transition-colors duration-300"
                  >
                    GO TO DASHBOARD
                  </button>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full py-3 rounded-lg border border-gold text-gold font-semibold tracking-wide hover:bg-gold hover:text-white transition-colors duration-300"
                  >
                    SIGN OUT
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
                    Welcome back
                  </h2>
                  <p className="mt-1 text-sm text-gray1">
                    Sign in to manage your bookings
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200 font-medium text-gray-700"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>

                <div className="pt-5 border-t border-gray-100">
                  <p className="text-center text-xs font-bold tracking-[0.12em] text-gold uppercase mb-4">
                    Admin portal
                  </p>
                  <form onSubmit={handleAdminSignIn} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(event) => setAdminEmail(event.target.value)}
                      placeholder="Admin email"
                      autoComplete="username"
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                    />
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(event) => setAdminPassword(event.target.value)}
                      placeholder="Admin password"
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                    />
                    {adminError && (
                      <p className="text-xs text-red-500 text-center">{adminError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={adminLoading}
                      className="w-full py-3 rounded-lg border border-gold text-gold font-semibold tracking-wide hover:bg-gold hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {adminLoading ? "SIGNING IN…" : "SIGN IN TO ADMIN PORTAL"}
                    </button>
                  </form>
                </div>

                <p className="text-center text-xs text-gray1 leading-relaxed">
                  By signing in you agree to our{" "}
                  <span className="underline cursor-pointer">Terms &amp; Conditions</span>{" "}
                  and{" "}
                  <span className="underline cursor-pointer">Privacy Policy</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignIn;
