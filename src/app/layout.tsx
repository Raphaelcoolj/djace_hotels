import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSerif = Noto_Serif({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-serif" });

export const metadata: Metadata = {
  title: "Djace Hotels & Lounge",
  description: "Experience unparalleled luxury and breathtaking views.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerif.variable}`}>
      <body className="bg-background text-text-main font-body antialiased">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
