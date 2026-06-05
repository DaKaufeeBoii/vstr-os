import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "VSTR-OS | Sai Tarun Reddy Velagala",
  description:
    "Portfolio of Sai Tarun Reddy Velagala — CS Undergrad & AI Developer. " +
    "Building intelligent software, developer tools, and ambitious side projects.",
  keywords: ["Sai Tarun", "AI Developer", "Full Stack", "Next.js", "Portfolio"],
  authors: [{ name: "Sai Tarun Reddy Velagala" }],
  openGraph: {
    title: "VSTR-OS | Sai Tarun Reddy Velagala",
    description: "Interactive OS-themed portfolio of Sai Tarun Reddy Velagala.",
    type: "website",
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
