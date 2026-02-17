import type { Metadata } from "next";
import { WalletProvider } from "@/components/WalletProvider";
import { PearProvider } from "@/contexts/PearContext";
import { MusicProvider } from "@/contexts/MusicContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.war.market"),
  title: {
    default: "WAR.MARKET",
    template: "%s — WAR.MARKET",
  },
  description: "Geopolitical chaos becomes tradeable positions. Taiwan invasion. Oil shock. AI collapse. One click on Hyperliquid.",
  openGraph: {
    type: "website",
    url: "https://www.war.market",
    siteName: "WAR.MARKET",
    title: "WAR.MARKET — The Global Tension Terminal",
    description: "Geopolitical chaos becomes tradeable positions. Taiwan invasion. Oil shock. AI collapse. One click on Hyperliquid.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WAR.MARKET — The Global Tension Terminal",
    description: "Geopolitical chaos becomes tradeable positions. Taiwan invasion. Oil shock. AI collapse. One click on Hyperliquid.",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-war-deep text-text-primary font-sans antialiased">
        <ThemeProvider>
          <WalletProvider>
            <PearProvider>
              <MusicProvider>
                {children}
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      background: '#18171c',
                      color: '#e8e6ed',
                      border: '1px solid #37343e',
                      borderRadius: '8px',
                    },
                    success: {
                      iconTheme: {
                        primary: '#22c55e',
                        secondary: '#0e0e10',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#0e0e10',
                      },
                    },
                  }}
                />
              </MusicProvider>
            </PearProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
