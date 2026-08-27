import React, { createContext, useContext, useEffect, useState } from "react";

export interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Session {
  user: SessionUser;
  isAdmin?: boolean;
}

interface AuthContextType {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (provider?: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  data: null,
  status: "loading",
  signIn: () => {},
  signOut: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Session | null>(null);
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session && session.user) {
          setData(session);
          setStatus("authenticated");
        } else {
          setData(null);
          setStatus("unauthenticated");
        }
      })
      .catch(() => {
        setData(null);
        setStatus("unauthenticated");
      });
  }, []);

  const signInFn = (provider = "google") => {
    window.location.href = `/api/auth/${provider}`;
  };

  const signOutFn = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setData(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider
      value={{ data, status, signIn: signInFn, signOut: signOutFn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Drop-in replacement for next-auth's useSession */
export function useSession() {
  const ctx = useContext(AuthContext);
  return { data: ctx.data, status: ctx.status };
}

/** Drop-in replacement for next-auth's signIn */
export function signIn(provider = "google") {
  window.location.href = `/api/auth/${provider}`;
}

/** Drop-in replacement for next-auth's signOut */
export async function signOut() {
  await fetch("/api/auth/signout", { method: "POST" });
  window.location.reload();
}

export default AuthContext;
