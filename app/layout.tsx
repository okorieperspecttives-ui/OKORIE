import type { Metadata } from "next";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

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
      <body className="antialiased">
        <header className="fixed right-4 top-4 z-50">
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
