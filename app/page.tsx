import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-text-primary">
      <section className="w-full max-w-2xl rounded-card border border-border bg-card p-10 shadow-[var(--ai-glow)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
          AI Trade Journal
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
          Upload your chart. Get pro-level trade feedback instantly.
        </h1>
        <p className="mt-4 text-base text-text-secondary sm:text-lg">
          Stop manual journaling and let AI extract, critique, and coach every
          trade in seconds.
        </p>
        <button
          type="button"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-hover"
        >
          <Link href="/auth">Get Started</Link>
        </button>
      </section>
    </main>
  );
}
