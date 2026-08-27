import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to reset your password.");
      setSuccess(result.message);
      setPassword("");
      setConfirmPassword("");
    } catch (submitError: any) {
      setError(submitError.message || "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-green1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-redLobosBackground px-8 py-8 text-center">
          <img src="/redlobosLogo.png" alt="Red Lobos Group" width={82} height={74} className="mx-auto mb-3" />
          <h1 className="text-xl font-bold tracking-widest text-gray-800">CHOOSE A NEW PASSWORD</h1>
        </div>
        <div className="px-8 py-9">
          {!token ? (
            <div className="text-center">
              <p className="text-red-600">This reset link is incomplete or invalid.</p>
              <button type="button" onClick={() => navigate("/signIn")} className="mt-6 text-gold font-semibold hover:text-black">
                Request a new reset link
              </button>
            </div>
          ) : success ? (
            <div className="text-center">
              <p className="text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">{success}</p>
              <button
                type="button"
                onClick={() => navigate("/signIn")}
                className="mt-6 w-full py-3 rounded-lg bg-gold text-white font-semibold hover:bg-black transition-colors"
              >
                SIGN IN
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray1 text-center mb-6">Your new password must contain at least 8 characters.</p>
              <div>
                <label htmlFor="newPassword" className="block text-xs font-semibold text-gray-600 mb-1.5">NEW PASSWORD</label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="confirmNewPassword" className="block text-xs font-semibold text-gray-600 mb-1.5">CONFIRM PASSWORD</label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
              {error && <p role="alert" className="text-sm text-red-600 text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gold text-white font-semibold hover:bg-black transition-colors disabled:opacity-50"
              >
                {loading ? "RESETTING…" : "RESET PASSWORD"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}