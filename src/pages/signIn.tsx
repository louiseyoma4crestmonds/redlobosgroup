import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSession } from "../context/AuthContext";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";

type AuthMode = "login" | "register" | "forgot";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all";

export default function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: session, status } = useSession();
  const requestedRedirect = searchParams.get("redirect");
  const redirectTo =
    requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/dashboard";

  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      navigate(session?.isAdmin ? "/admin" : redirectTo, { replace: true });
    }
  }, [status, session?.isAdmin, navigate, redirectTo]);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleGoogleSignIn = () => {
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectTo)}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        mode === "register"
          ? "/api/auth/register"
          : mode === "forgot"
            ? "/api/auth/forgot-password"
            : "/api/auth/login";
      const body =
        mode === "register"
          ? { name, email, password }
          : mode === "forgot"
            ? { email }
            : { email, password };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Please try again.");

      if (mode === "forgot") {
        setMessage(result.message);
      } else {
        window.location.assign(redirectTo);
      }
    } catch (submitError: any) {
      setError(submitError.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status !== "unauthenticated") {
    return (
      <div className="min-h-screen bg-green1 flex items-center justify-center">
        <div
          className="w-9 h-9 border-2 border-gold border-t-transparent rounded-full animate-spin"
          aria-label="Loading account"
        />
      </div>
    );
  }

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="signIn" />

      <div className="flex gap-2 items-center px-6 tablet:px-28 pt-8 text-sm text-gray-500">
        <button type="button" onClick={() => navigate("/")} className="hover:text-gold transition-colors">
          HOME
        </button>
        <span>&gt;</span>
        <span className="text-gray1">{isRegister ? "REGISTER" : isForgot ? "RESET PASSWORD" : "SIGN IN"}</span>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-redLobosBackground px-8 py-8 text-center">
            <img src="/redlobosLogo.png" alt="Red Lobos Group" width={82} height={74} className="mx-auto mb-3" />
            <h1 className="text-2xl font-bold tracking-widest text-gray-800">RED LOBOS GROUP</h1>
            <p className="mt-2 text-sm text-gray1 tracking-wide">Property &amp; Venue Booking</p>
          </div>

          <div className="px-8 py-9">
            {!isForgot && (
              <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1 mb-7">
                <button
                  type="button"
                  onClick={() => changeMode("login")}
                  className={`rounded-md py-2.5 text-sm font-semibold transition-all ${
                    mode === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gold"
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => changeMode("register")}
                  className={`rounded-md py-2.5 text-sm font-semibold transition-all ${
                    isRegister ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gold"
                  }`}
                >
                  REGISTER
                </button>
              </div>
            )}

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {isRegister ? "Create your account" : isForgot ? "Reset your password" : "Welcome back"}
              </h2>
              <p className="mt-1.5 text-sm text-gray1 leading-relaxed">
                {isRegister
                  ? "Register to book properties and add-on services."
                  : isForgot
                    ? "Enter your account email and we’ll send you a secure reset link."
                    : "Sign in to book and manage your reservations."}
              </p>
            </div>

            {!isForgot && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200 font-medium text-gray-700"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
                <div className="flex items-center gap-3 my-6">
                  <span className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">or use email</span>
                  <span className="h-px flex-1 bg-gray-200" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-600 mb-1.5">FULL NAME</label>
                  <input
                    id="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5">EMAIL ADDRESS</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              {!isForgot && (
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-600 mb-1.5">PASSWORD</label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    placeholder={isRegister ? "At least 8 characters" : "Your password"}
                    className={inputClass}
                  />
                </div>
              )}

              {isRegister && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-600 mb-1.5">CONFIRM PASSWORD</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className={inputClass}
                  />
                </div>
              )}

              {error && <p role="alert" className="text-sm text-red-600 text-center">{error}</p>}
              {message && (
                <p role="status" className="text-sm text-green-700 text-center bg-green-50 border border-green-100 rounded-lg px-3 py-3">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gold text-white font-semibold tracking-wide hover:bg-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "PLEASE WAIT…"
                  : isRegister
                    ? "CREATE ACCOUNT"
                    : isForgot
                      ? "SEND RESET LINK"
                      : "SIGN IN"}
              </button>
            </form>

            {mode === "login" && (
              <button
                type="button"
                onClick={() => changeMode("forgot")}
                className="block mx-auto mt-4 text-sm text-gold hover:text-black transition-colors"
              >
                Forgot your password?
              </button>
            )}

            {isForgot && (
              <button
                type="button"
                onClick={() => changeMode("login")}
                className="block mx-auto mt-5 text-sm font-semibold text-gold hover:text-black transition-colors"
              >
                Back to sign in
              </button>
            )}

            {!isForgot && (
              <p className="mt-7 text-center text-xs text-gray1 leading-relaxed">
                By continuing you agree to our Terms &amp; Conditions and Privacy Policy.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}