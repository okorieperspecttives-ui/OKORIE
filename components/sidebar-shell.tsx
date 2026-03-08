"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";

const AUTH_KEY = "ai-trade-journal-auth";

function readAuthFlag() {
  try {
    if (typeof window === "undefined") return false;
    if (window.firebase && window.firebase.auth) {
      const user = window.firebase.auth().currentUser;
      if (user) return true;
    }
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function SidebarShell() {
  const { user } = useAuth();
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthed(readAuthFlag());
    if (typeof window !== "undefined" && window.firebase?.auth) {
      try {
        const unsubscribe = window.firebase.auth().onAuthStateChanged?.(() => {
          setIsAuthed(readAuthFlag());
        });
        return () => {
          try {
            if (typeof unsubscribe === "function") unsubscribe();
          } catch {}
        };
      } catch {}
    }
  }, []);

  useEffect(() => {
    setIsAuthed(Boolean(user));
  }, [user]);

  if (!isAuthed) return null;

  return (
    <aside className="hidden lg:flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface p-4 text-text-primary">
      <div className="mb-4 text-lg font-semibold">AI Trade Journal</div>
      <nav className="flex flex-col gap-1">
        <Link href="/" className="rounded-md px-3 py-2 hover:bg-hover">
          Home
        </Link>
        <Link href="/auth" className="rounded-md px-3 py-2 hover:bg-hover">
          Auth
        </Link>
        <a
          onClick={() => {
            try {
              localStorage.removeItem(AUTH_KEY);
              window.firebase?.auth?.().signOut?.();
              window.location.href = "/";
            } catch {}
          }}
          className="cursor-pointer rounded-md px-3 py-2 text-loss hover:bg-hover"
        >
          Sign out
        </a>
      </nav>
    </aside>
  );
}
