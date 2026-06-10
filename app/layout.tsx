import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/scroll-to-top";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alshrqawy Store",
  description: "Modern E-Commerce Platform",
  icons: {
    icon: "/icons.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gray-50" suppressHydrationWarning>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
              }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
