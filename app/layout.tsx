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
import { ScrollArea } from "@/components/ui/scroll-area";
import { headers } from "next/headers";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Link from "next/link";
import MainBreadcrumb from "@/components/MainBreadcrumb";
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

  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  console.log("pathname", pathname);

  return (
    <AppProvider
      authors={authorData || []}
      primaryAuthor={primaryAuthor || null}
      initialTheme={initialTheme}
    >
      <Nav
        avatarUrl={userData.avatar_url}
        primaryAuthor={primaryAuthor}
        username={userData.username}
      />

      <Grain />

      <div
        className={`ml-[12%] h-[100%] px-4 py-6 container antialiased grid grid-cols-12`}
      >
        <SidebarProvider>
          <ScrollArea className="rounded-xl border p-4 ">
            <MainBreadcrumb />
            <SidebarMenu className="mt-5">
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="text-lg">
                      Stories
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <Link href="/" className="text-sm">
                          Home
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link href="/" className="text-sm">
                          Home
                        </Link>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </ScrollArea>
        </SidebarProvider>

        <div className="px-10 py-10 col-span-10 col-start-4 border rounded-xl">
          {children}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-10 border-t p-3 subpixel-antialiased flex flex-row items-center justify-center gap-4 text-muted-foreground font-mono text-sm">
        <div>
          <p>WORDS READ: 2000</p>
        </div>
        <div>
          <p>WORDS WRITTEN: 1000</p>
        </div>
      </footer>
    </AppProvider>
  );
}
