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
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#e94560",
  width: "device-width",
  initialScale: 1,
};

import ContextMenuManager from "@/components/ContextMenuManager";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e94560" />
      </head>
      <body className="h-full overflow-hidden">
        <ContextMenuManager>{children}</ContextMenuManager>
        <Script
          id="sw-registration"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('[SW] Registered:', reg.scope))
                    .catch(err => console.log('[SW] Registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
