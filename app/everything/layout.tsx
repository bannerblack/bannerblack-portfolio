import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AuthorProvider from "./AuthorProvider";
import Grain from "./Grain";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="container mx-auto px-4 py-6">{children}</div>
      </div>
    </AuthorProvider>
  );
}
