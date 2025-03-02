import type { Metadata } from "next";
import { Alegreya, Geist_Mono } from "next/font/google";
import "../globals.css";
import AuthorProvider from "./AuthorProvider";
import Grain from "./Grain";

const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlackBanner - Everything",
  description: "BlackBanner fiction portfolio",
};

export default async function EverythingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthorProvider>
      <Grain />
      <div className={`${alegreya.variable} ${geistMono.variable} antialiased`}>
        <div className="container mx-auto px-4 py-6">{children}</div>
      </div>
    </AuthorProvider>
  );
}
