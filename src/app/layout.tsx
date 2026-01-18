import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Mono } from "next/font/google";
import { WalletProvider } from "@/components/WalletProvider";
import { PearProvider } from "@/contexts/PearContext";
import { MusicProvider } from "@/contexts/MusicContext";
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
  metadataBase: new URL("https://www.war.market"),
  title: {
    default: "WAR.MARKET",
    template: "%s — WAR.MARKET",
  },
  description: "Trade narratives. Not tickers. A terminal for trading global stress.",
  openGraph: {
    type: "website",
    url: "https://www.war.market",
    siteName: "WAR.MARKET",
    title: "WAR.MARKET",
    description: "Trade narratives. Not tickers. A terminal for trading global stress.",
    images: [
      {
        url: "/ghimage.png",
        width: 1200,
        height: 630,
        alt: "WAR.MARKET",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WAR.MARKET",
    description: "Trade narratives. Not tickers. A terminal for trading global stress.",
    images: ["/ghimage.png"],
  },
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
              {children}
              <Toaster position="bottom-right" />
            </MusicProvider>
          </PearProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
