import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arcjoint.com"),
  title: {
    default: "ARC | Preserve-First Joint Pain Treatment",
    template: "%s | ARC",
  },
  description:
    "ARC connects patients with orthopedic surgeons and neurosurgeons offering minimally invasive, reversible joint pain procedures before surgery. Find a location and check availability.",
  alternates: {
    canonical: "https://arcjoint.com",
  },
  openGraph: {
    type: "website",
    siteName: "ARC Joint",
    title: "ARC | Preserve-First Joint Pain Treatment",
    description:
      "ARC connects patients with orthopedic surgeons and neurosurgeons offering minimally invasive, reversible joint pain procedures before surgery.",
    url: "https://arcjoint.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARC | Preserve-First Joint Pain Treatment",
    description:
      "Minimally invasive, reversible joint pain procedures. Preserve before replace.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
