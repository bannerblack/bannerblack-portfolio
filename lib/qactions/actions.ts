"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// set primary author
export async function setPrimaryAuthor(authorId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // set all authors with user = user.id authors to primary = false
  const { data, error } = await supabase
    .from("author")
    .update({ primary: false })
    .eq("user", user.data.user?.id);

  // set the author with id = authorId to primary = true
  const { data: authorData, error: authorError } = await supabase
    .from("author")
    .update({ primary: true })
    .eq("id", authorId);

  revalidatePath("/");
  redirect("/");

  return authorData;
}

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
