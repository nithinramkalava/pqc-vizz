import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageTransition from "./components/PageTransition";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "PQC Visualization",
  description: "Interactive visualization of Post-Quantum Cryptography algorithms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-secondary-50 dark:bg-secondary-900 min-h-screen antialiased">
        <PageTransition>
          <div className="min-h-screen relative">
            {children}
          </div>
        </PageTransition>
      </body>
      <Analytics />
    </html>
  );
}
