import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import GoogleProvider from "@/components/GoogleProvider";

export const metadata: Metadata = {
  title: "UniHealth – One Health Record. Every Hospital. Anywhere.",
  description:
    "UniHealth gives you a single, unified health record accessible at any hospital, anywhere in the world.",
  keywords: ["health record", "medical record", "hospitals", "patient portal"],
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0f0a] text-white antialiased">
        <Script
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          strategy="beforeInteractive"
        />
        <GoogleProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#1a2a1a",
                  color: "#ffffff",
                  border: "1px solid #2d4a2d",
                  borderRadius: "12px",
                },
                success: {
                  iconTheme: {
                    primary: "#4ade80",
                    secondary: "#0a0f0a",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
          </AuthProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
