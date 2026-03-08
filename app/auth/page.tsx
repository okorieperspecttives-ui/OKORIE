"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

const AUTH_KEY = "ai-trade-journal-auth";

const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PASSWORD_RULES = {
  minLength: 12,
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /\d/,
  special: /[^A-Za-z0-9]/,
  noSpace: /^\S+$/,
};

function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email);
}

function getPasswordErrors(password: string) {
  const errors: string[] = [];

  if (password.length < PASSWORD_RULES.minLength) {
    errors.push("At least 12 characters");
  }
  if (!PASSWORD_RULES.upper.test(password)) {
    errors.push("At least 1 uppercase letter");
  }
  if (!PASSWORD_RULES.lower.test(password)) {
    errors.push("At least 1 lowercase letter");
  }
  if (!PASSWORD_RULES.number.test(password)) {
    errors.push("At least 1 number");
  }
  if (!PASSWORD_RULES.special.test(password)) {
    errors.push("At least 1 special character");
  }
  if (!PASSWORD_RULES.noSpace.test(password)) {
    errors.push("No spaces allowed");
  }

  return errors;
}

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

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  const passwordErrors = useMemo(() => getPasswordErrors(password), [password]);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  const initFirebase = () => {
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

    try {
      const user = window.firebase.auth().currentUser;
      if (user) {
        localStorage.setItem(AUTH_KEY, "true");
      }
    } catch {}

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

    const currentPasswordErrors = getPasswordErrors(password);
    if (currentPasswordErrors.length) {
      setError(`Password requirements: ${currentPasswordErrors.join(", ")}`);
      return;
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

      try {
        localStorage.setItem(AUTH_KEY, "true");
      } catch {}

      setStatus(
        `${isLoginMode ? "Signed in" : "Account created"} for ${result.user.email ?? "user"}.`,
      );
      router.replace("/dashboard");
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

      try {
        localStorage.setItem(AUTH_KEY, "true");
      } catch {}

      setStatus(`Signed in with Google as ${result.user.email ?? "user"}.`);
      router.replace("/dashboard");
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
            onChange={(event) => setEmail(event.target.value.trim())}
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
            placeholder="Enter strong password"
            required
          />

          <p className="text-xs text-text-secondary">
            Password must be 12+ chars with uppercase, lowercase, number, special character, and no
            spaces.
          </p>

          {!isLoginMode && password.length > 0 && passwordErrors.length > 0 ? (
            <ul className="list-inside list-disc text-xs text-loss">
              {passwordErrors.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Please wait..." : isLoginMode ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={continueWithGoogle}
          disabled={pending}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-divider bg-transparent px-4 font-semibold hover:bg-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => setIsLoginMode((prev) => !prev)}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-surface px-4 font-medium text-text-primary hover:bg-hover"
        >
          {isLoginMode ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>

        {error ? <p className="mt-4 text-sm text-loss">{error}</p> : null}
        {status ? <p className="mt-4 text-sm text-profit">{status}</p> : null}

        <Link href="/" className="mt-6 inline-block text-sm text-primary hover:text-primary-hover">
          ← Back to home
        </Link>
      </section>
    </main>
  );
}
