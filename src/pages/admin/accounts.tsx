import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/AuthContext";
import UtilityBar from "../../organisms/UtilityBar/UtilityBar";

interface AdminAccount {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
  revoked_at: string | null;
}

function formatAccountDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminAccounts() {
  const navigate = useNavigate();
  const { data: session, status } = useSession();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isOwner = session?.isOwner === true;

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      navigate("/admin/login", { replace: true });
      return;
    }
    if (!isOwner) {
      navigate("/admin", { replace: true });
      return;
    }
    void loadAccounts();
  }, [status, isOwner, navigate]);

  async function loadAccounts() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/accounts", {
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not load accounts.");
      setAccounts(result.data ?? []);
    } catch (loadError: any) {
      setError(loadError.message || "Could not load admin accounts.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not create account.");

      setAccounts((current) => [result.data, ...current]);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setMessage("Admin account created. Share the login details securely.");
    } catch (createError: any) {
      setError(createError.message || "Could not create the admin account.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRevoke(account: AdminAccount) {
    if (!account.is_active) return;
    if (!window.confirm(`Revoke admin access for ${account.email}?`)) return;

    setError("");
    setMessage("");
    setRevokingId(account.id);
    try {
      const response = await fetch(`/api/admin/accounts/${account.id}/revoke`, {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not revoke account.");

      setAccounts((current) =>
        current.map((item) => (item.id === account.id ? result.data : item))
      );
      setMessage(`${account.email} no longer has admin access.`);
    } catch (revokeError: any) {
      setError(revokeError.message || "Could not revoke the admin account.");
    } finally {
      setRevokingId(null);
    }
  }

  if (status === "loading" || !isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UtilityBar activeLink="ADMIN" />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between mb-8">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="text-sm font-medium text-[#c9a96e] hover:underline mb-3"
            >
              ← Back to Admin Panel
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Admin Accounts</h1>
            <p className="text-gray-500 mt-1">
              Create and revoke additional administrator access.
            </p>
          </div>
          <span className="self-start rounded-full bg-[#f4ead8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#927344]">
            Owner only
          </span>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div role="status" className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <section className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Create an admin account</h2>
          <p className="mt-1 text-sm text-gray-500">
            The new administrator will use these details on the existing Admin Access page.
          </p>
          <form onSubmit={handleCreate} className="mt-5 grid gap-4 tablet:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Email address
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="off"
                placeholder="admin@example.com"
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-normal text-gray-800 outline-none transition focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-normal text-gray-800 outline-none transition focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Confirm password
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Repeat the password"
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-normal text-gray-800 outline-none transition focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-[#c9a96e] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#b8945a] disabled:cursor-not-allowed disabled:opacity-50 tablet:w-auto"
              >
                {saving ? "Creating…" : "Create admin"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">Additional administrators</h2>
            <p className="mt-1 text-sm text-gray-500">
              Revoked accounts remain listed for an audit trail but cannot sign in.
            </p>
          </div>
          {loading ? (
            <div className="h-32 animate-pulse rounded-b-xl bg-gray-50" />
          ) : accounts.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gray-400">
              No additional admin accounts have been created.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Created</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{account.email}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{formatAccountDate(account.created_at)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          account.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {account.is_active ? "Active" : "Revoked"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {account.is_active ? (
                          <button
                            type="button"
                            onClick={() => handleRevoke(account)}
                            disabled={revokingId === account.id}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
                          >
                            {revokingId === account.id ? "Revoking…" : "Revoke"}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">
                            {account.revoked_at ? formatAccountDate(account.revoked_at) : "Revoked"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}