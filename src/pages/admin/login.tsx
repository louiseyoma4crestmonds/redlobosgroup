import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      navigate(session?.isAdmin ? "/admin" : "/dashboard", { replace: true });
    }
  }, [status, session?.isAdmin, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to sign in.");
      window.location.assign("/admin");
    } catch (submitError: any) {
      setError(submitError.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  if (status !== "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
        <img src="/redlobosLogo.png" alt="Red Lobos Group" width={72} height={64} className="mx-auto mb-5" />
        <h1 className="text-center text-xl font-bold tracking-widest text-white">ADMIN ACCESS</h1>
        <p className="text-center text-sm text-gray-400 mt-2 mb-7">Authorized staff only</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            placeholder="Admin email"
            className="w-full rounded-lg border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Admin password"
            className="w-full rounded-lg border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
          {error && <p role="alert" className="text-sm text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gold text-white font-semibold tracking-wide hover:bg-white hover:text-gray-950 transition-colors disabled:opacity-50"
          >
            {loading ? "SIGNING IN…" : "SIGN IN"}
          </button>
        </form>
      </div>
    </main>
  );
}