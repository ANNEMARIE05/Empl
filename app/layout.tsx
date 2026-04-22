import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { FournisseursApplication } from "@/components/providers/fournisseurs-application";
import "./globals.css";

const policeSans = Plus_Jakarta_Sans({
  variable: "--font-sans-app",
  subsets: ["latin"],
  display: "swap",
});

const policeMono = Geist_Mono({
  variable: "--font-mono-app",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MUFER Employés",
  description: "Gestion RH : congés et documents.",
};

export const viewport: Viewport = {
  themeColor: "#E5B800",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${policeSans.variable} ${policeMono.variable}`} suppressHydrationWarning>
      <body
        className="min-h-full bg-[var(--surface-racine)] font-sans antialiased"
        suppressHydrationWarning
      >
        <FournisseursApplication>{children}</FournisseursApplication>
      </body>
    </html>
  );
}
