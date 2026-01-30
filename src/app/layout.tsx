import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { WalletProvider } from "@/components/WalletProvider";
import { PearProvider } from "@/contexts/PearContext";
import { MusicProvider } from "@/contexts/MusicContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.war.market"),
  title: {
    default: "WAR.MARKET",
    template: "%s — WAR.MARKET",
  },
  description: "Trade the tension. One-click basket trades for macro conviction.",
  openGraph: {
    type: "website",
    url: "https://www.war.market",
    siteName: "WAR.MARKET",
    title: "WAR.MARKET",
    description: "Trade the tension. One-click basket trades for macro conviction.",
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
    description: "Trade the tension. One-click basket trades for macro conviction.",
    images: ["/ghimage.png"],
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
    <html lang="en" className={jetbrainsMono.variable}>
      <body>
        <WalletProvider>
          <PearProvider>
            <MusicProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#111113',
                    color: '#fafafa',
                    border: '1px solid #27272a',
                    borderRadius: '0',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#0a0a0b',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#0a0a0b',
                    },
                  },
                }}
              />
            </MusicProvider>
          </PearProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
