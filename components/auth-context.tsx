"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
} | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
}

function hasConfig(config: Record<string, string>) {
  return Object.values(config).every(Boolean);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    try {
      if (typeof window !== "undefined") {
        if (window.firebase) {
          if (!window.firebase.apps.length) {
            const cfg = getFirebaseConfig();
            if (hasConfig(cfg)) {
              window.firebase.initializeApp(cfg);
            }
          }
          const auth = window.firebase.auth?.();
          if (auth?.onAuthStateChanged) {
            unsub = auth.onAuthStateChanged((u) => {
              setUser(u ? { uid: u.uid, email: u.email, displayName: u.displayName } : null);
              setLoading(false);
            });
            return () => {
              try {
                unsub?.();
              } catch {}
            };
          }
        }
      }
    } catch {}

    setLoading(false);
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
