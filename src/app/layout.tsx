import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WAR.MARKET - Trade Risk Indices",
  description: "Narrative markets on Hyperliquid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-war-dark text-white font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
