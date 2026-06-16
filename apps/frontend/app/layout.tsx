import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MatchFlow Arena",
  description: "Sports tournament discovery, live scoring, and registration.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MatchFlow"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: "MatchFlow Arena",
    title: "MatchFlow Arena",
    description: "Sports tournament discovery, live scoring, and registration."
  }
};

export const viewport: Viewport = {
  themeColor: "#10231d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* PWA: iOS home screen icon (placeholder — replace with real asset) */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        {/* PWA: Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `
          }}
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
