import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Mono } from "next/font/google";
import { WalletProvider } from "@/components/WalletProvider";
import { PearProvider } from "@/contexts/PearContext";
import { MusicProvider } from "@/contexts/MusicContext";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

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
    <html lang="en" className={`${ibmPlexMono.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen bg-pear-dark text-white font-mono antialiased">
        <WalletProvider>
          <PearProvider>
            <MusicProvider>
              <Navbar />
              {children}
              <Toaster position="bottom-right" />
            </MusicProvider>
          </PearProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
