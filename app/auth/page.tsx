"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  getPasswordErrors,
  getPasswordRuleStatus,
  isValidEmail,
} from "@/lib/auth-validation";

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
}

function hasConfig(config: ReturnType<typeof getFirebaseConfig>) {
  return Object.values(config).every(Boolean);
}

function RuleItem({ ok, label }: { ok: boolean; label: string }) {
  return <li className={ok ? "text-profit" : "text-loss"}>{ok ? "✓" : "•"} {label}</li>;
}

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  const passwordRuleStatus = useMemo(() => getPasswordRuleStatus(password), [password]);

  const initFirebase = () => {
    setError("");
    const config = getFirebaseConfig();

    if (!hasConfig(config)) {
      setError("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.");
      return;
    }

    if (!window.firebase) {
      setError("Firebase SDK is not available.");
      return;
    }

    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(config);
    }

    setFirebaseLoaded(true);
  };

  const submitEmailAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (!isLoginMode) {
      const currentPasswordErrors = getPasswordErrors(password);
      if (currentPasswordErrors.length) {
        setError(`Password requirements: ${currentPasswordErrors.join(", ")}`);
        return;
      }

      if (password !== confirmPassword) {
        setError("Password confirmation does not match.");
        return;
      }
    }

    if (!window.firebase || !firebaseLoaded) {
      setError("Firebase auth is still loading. Try again in a moment.");
      return;
    }

    setPending(true);

    try {
      const auth = window.firebase.auth();
      const result = isLoginMode
        ? await auth.signInWithEmailAndPassword(email, password)
        : await auth.createUserWithEmailAndPassword(email, password);

      setStatus(
        `${isLoginMode ? "Signed in" : "Account created"} for ${result.user.email ?? "user"}.`,
      );
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "Authentication failed.";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  const continueWithGoogle = async () => {
    setError("");
    setStatus("");

    if (!window.firebase || !firebaseLoaded) {
      setError("Firebase auth is still loading. Try again in a moment.");
      return;
    }

    setPending(true);

    try {
      const auth = window.firebase.auth();
      const provider = new window.firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await auth.signInWithPopup(provider);

      setStatus(`Signed in with Google as ${result.user.email ?? "user"}.`);
    } catch (googleError) {
      const message = googleError instanceof Error ? googleError.message : "Google sign in failed.";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-text-primary">
      <Script
        src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js"
        strategy="afterInteractive"
        onReady={initFirebase}
      />

      <section className="w-full max-w-md rounded-card border border-border bg-card p-8 shadow-[var(--ai-glow)]">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
            AI Trade Journal
          </p>
          <h1 className="mt-2 text-3xl font-bold">{isLoginMode ? "Sign in" : "Create account"}</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Secure access with strict credential validation and Firebase authentication.
          </p>
        </div>

        <form className="space-y-4" onSubmit={submitEmailAuth}>
          <label className="block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3 outline-none ring-primary focus:ring-2"
            placeholder="you@example.com"
            required
          />

          <label className="block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3 outline-none ring-primary focus:ring-2"
            placeholder={isLoginMode ? "Enter your password" : "Create a strong password"}
            required
          />

          {!isLoginMode ? (
            <>
              <label className="block text-sm font-medium" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-surface px-3 outline-none ring-primary focus:ring-2"
                placeholder="Re-enter your password"
                required
              />

              <ul className="list-inside list-disc text-xs">
                <RuleItem ok={passwordRuleStatus.minLength} label="At least 12 characters" />
                <RuleItem ok={passwordRuleStatus.upper} label="At least 1 uppercase letter" />
                <RuleItem ok={passwordRuleStatus.lower} label="At least 1 lowercase letter" />
                <RuleItem ok={passwordRuleStatus.number} label="At least 1 number" />
                <RuleItem ok={passwordRuleStatus.special} label="At least 1 special character" />
                <RuleItem ok={passwordRuleStatus.noSpace} label="No spaces allowed" />
              </ul>
            </>
          ) : null}

          <button
            type="submit"
            disabled={pending || !firebaseLoaded}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Please wait..." : isLoginMode ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={continueWithGoogle}
          disabled={pending || !firebaseLoaded}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-divider bg-transparent px-4 font-semibold hover:bg-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => {
            setIsLoginMode((prev) => !prev);
            setError("");
            setStatus("");
            setPassword("");
            setConfirmPassword("");
          }}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-surface px-4 font-medium text-text-primary hover:bg-hover"
        >
          {isLoginMode ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>

        {!firebaseLoaded && !error ? (
          <p className="mt-4 text-sm text-text-secondary">Loading Firebase authentication...</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-loss">{error}</p> : null}
        {status ? <p className="mt-4 text-sm text-profit">{status}</p> : null}

        <Link href="/" className="mt-6 inline-block text-sm text-primary hover:text-primary-hover">
          ← Back to home
        </Link>
      </section>
    </main>
  );
}
