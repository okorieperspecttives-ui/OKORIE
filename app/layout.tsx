import type { Metadata } from "next";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarShell } from "@/components/sidebar-shell";
import { AuthProvider } from "@/components/auth-context";
import { LaunchGate } from "@/components/launch-gate";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AI Trade Journal",
  description: "Automated AI-powered trading journal and coach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var KEY='ai-trade-journal-theme';var stored=localStorage.getItem(KEY);var shouldDark=stored?stored==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var root=document.documentElement;root.classList.toggle('dark', shouldDark);}catch(e){}})();`,
          }}
        />
        <Script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js" strategy="afterInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js" strategy="afterInteractive" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <header className="fixed right-4 top-4 z-50">
            <ThemeToggle />
          </header>
          <div className="flex min-h-screen bg-background">
            <SidebarShell />
            <div className="flex-1">{children}</div>
          </div>
          <LaunchGate />
        </AuthProvider>
      </body>
    </html>
  );
}
