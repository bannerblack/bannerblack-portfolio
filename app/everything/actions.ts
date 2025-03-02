"use server";

import { createClient } from "@/lib/utils/supabase/server";

// set author theme

export async function setAuthorTheme(authorId: string, theme: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("author")
    .update({ theme })
    .eq("id", authorId);
  return data;
}

// set author's custom theme
export async function setAuthorCustomTheme(
  authorId: string,
  customTheme: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("author")
    .update({ custom_theme: customTheme })
    .eq("id", authorId);
  return data;
}
