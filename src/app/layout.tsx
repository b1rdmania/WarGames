import type { Metadata } from "next";
import { WalletProvider } from "@/components/WalletProvider";
import { PearProvider } from "@/contexts/PearContext";
import { MusicProvider } from "@/contexts/MusicContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
    <html lang="en">
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
