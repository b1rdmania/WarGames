import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import { WalletProvider } from "@/components/WalletProvider";
import { PearProvider } from "@/contexts/PearContext";
import { MusicProvider } from "@/contexts/MusicContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.war.market"),
  title: {
    default: "war.market",
    template: "%s — war.market",
  },
  description: "Trade the tension. One-click basket trades for macro conviction.",
  openGraph: {
    type: "website",
    url: "https://www.war.market",
    siteName: "war.market",
    title: "war.market",
    description: "Trade the tension. One-click basket trades for macro conviction.",
    images: [
      {
        url: "/ghimage.png",
        width: 1200,
        height: 630,
        alt: "war.market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "war.market",
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
    <html lang="en" className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-war-deep text-text-primary font-sans antialiased">
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
      </body>
    </html>
  );
}
