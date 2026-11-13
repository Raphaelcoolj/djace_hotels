import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Luxury Hotel & Lounge",
    template: "%s — Luxury Hotel & Lounge",
  },
  description: "Experience unparalleled luxury and breathtaking views.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F6F1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-ivory text-charcoal font-body antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#242522",
              color: "#F8F6F1",
              borderRadius: "0px",
              fontSize: "14px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              boxShadow: "0 18px 40px rgba(36, 37, 34, 0.18)",
              padding: "14px 18px",
            },
            success: { iconTheme: { primary: "#B69A67", secondary: "#F8F6F1" } },
            error: { iconTheme: { primary: "#B69A67", secondary: "#F8F6F1" } },
          }}
        />
        {children}
      </body>
    </html>
  );
}
