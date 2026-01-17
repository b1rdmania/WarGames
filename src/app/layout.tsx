import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { WalletProvider } from "@/components/WalletProvider";
import { PearProvider } from "@/contexts/PearContext";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
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
    <html lang="en" data-ui="terminal" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-pear-dark text-white font-sans antialiased">
        <WalletProvider>
          <PearProvider>
            <Navbar />
            {children}
            <Toaster position="bottom-right" />
          </PearProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
