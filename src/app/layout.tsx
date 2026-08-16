import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import "./mobile.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vstr-os.vercel.app";

export const metadata: Metadata = {
  title: "VSTR-OS | Sai Tarun Reddy Velagala",
  description:
    "Portfolio of Sai Tarun Reddy Velagala — CS Undergrad & AI Developer. " +
    "Building intelligent software, developer tools, and ambitious side projects.",
  keywords: ["Sai Tarun", "AI Developer", "Full Stack", "Next.js", "Portfolio", "VSTR-OS"],
  authors: [{ name: "Sai Tarun Reddy Velagala" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "VSTR-OS | Sai Tarun Reddy Velagala",
    description: "Interactive OS-themed portfolio of Sai Tarun Reddy Velagala.",
    type: "website",
    url: siteUrl,
    siteName: "VSTR-OS",
  },
  twitter: {
    card: "summary_large_image",
    title: "VSTR-OS | Sai Tarun Reddy Velagala",
    description: "Interactive OS-themed portfolio — explore apps, terminal, and hidden games.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
