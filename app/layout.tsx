import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameMode from "@/components/GameMode";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: swap in your actual deployed domain once live on Vercel
const SITE_URL = "https://mayurpatil.vercel.app";

export const metadata: Metadata = {
  title: "Mayur Patil - Traffic Systems Design Engineer",
  description:
    "Traffic Systems Design Engineer at WSP. Signal design, ITS, and street lighting circuit engineering — including Circuit Line, a self-built voltage drop calculator.",
  keywords:
    "traffic engineer, traffic systems design, signal design, ITS engineer, street lighting, voltage drop calculator, WSP, Synchro, VISSIM, AutoCAD, MicroStation",
  authors: [{ name: "Mayur Patil", url: SITE_URL }],
  creator: "Mayur Patil",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Mayur Patil - Portfolio",
    title: "Mayur Patil - Traffic Systems Design Engineer",
    description:
      "Traffic Systems Design Engineer at WSP. Signal design, ITS, and circuit engineering. View my tools and work.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Mayur Patil - Traffic Systems Design Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayur Patil - Traffic Systems Design Engineer",
    description: "Traffic Systems Design Engineer at WSP",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23007BFF' width='100' height='100'/><text x='50' y='65' font-size='70' font-weight='bold' fill='white' text-anchor='middle' font-family='Arial'>M</text></svg>" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mayur Patil",
              url: SITE_URL,
              jobTitle: "Traffic Systems Design Engineer",
              worksFor: {
                "@type": "Organization",
                name: "WSP",
              },
              sameAs: [
                "https://www.linkedin.com/in/mayur-ahirrao/",
                "https://github.com/mayurpatil2708",
              ],
              knowsAbout: [
                "Traffic Signal Design",
                "Intelligent Transportation Systems",
                "Street Lighting Circuit Design",
                "Voltage Drop Analysis",
                "Synchro",
                "VISSIM",
                "AutoCAD",
                "MicroStation",
                "MUTCD",
                "NEC Electrical Code",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased light-mode`}
        suppressHydrationWarning
      >
        <Header />
        <GameMode />
        {children}
        <Footer />
      </body>
    </html>
  );
}
