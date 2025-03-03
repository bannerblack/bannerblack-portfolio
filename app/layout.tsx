import type { Metadata } from "next";
import { Alegreya, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Grain from "@/components/visual/Grain";
import { createClient } from "@/lib/utils/supabase/server";
import { ThemeVariables } from "@/lib/utils/theme-utils";
import { redirect } from "next/navigation";
import AppProvider from "../lib/Providers/AppProvider";
import { Database } from "@/database.types";
import Nav from "@/components/Nav";
import { getUserId } from "@/lib/query/auth";

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
  // Create Supabase client
  const supabase = await createClient();

  // Get the current user
  const userData = await getUserId();

  if (!userData) {
    redirect("/login");
  }

  // Get all authors for the current user
  const { data: authorData, error: authorError } = await supabase
    .from("author")
    .select("*")
    .eq("user", userData.user_id)
    .order("created_at", { ascending: true });

  const primaryAuthor =
    authorData?.find((author) => author.primary === true) || authorData?.[0];

  // Get the theme from the primary author
  const themeId = primaryAuthor?.theme || "system";
  const initialTheme = { id: themeId };
  console.log("initialTheme", initialTheme.id);

  return (
    <AppProvider
      authors={authorData || []}
      primaryAuthor={primaryAuthor || null}
      initialTheme={initialTheme}
    >
      <Grain />
      <Nav
        avatarUrl={userData.avatar_url}
        primaryAuthor={primaryAuthor}
        username={userData.username}
      />
      <div className={`antialiased`}>
        <div className="container mx-auto px-4 py-6">{children}</div>
      </div>
    </AppProvider>
  );
}
