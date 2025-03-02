import { createClient } from "@/lib/utils/supabase/server";
import { getUserId } from "./auth";

// Get author stories
export async function getAuthorStories() {
  const supabase = await createClient();
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("author")
    .select(`*, story(*, chapter(*))`)
    .eq("user", userId);

  if (error) {
    throw error;
  }

  return data;
}

// Get likes, recs, comments, bookmarks by author
export async function getAuthorInteractions() {
  const supabase = await createClient();
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("author")
    .select(`*, like(*), rec(*), comment(*), bookmark(*)`)
    .eq("user", userId);

  if (error) {
    throw error;
  }

  return data;
}

// Get primary author for user
export async function getPrimaryAuthor() {
  const supabase = await createClient();
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("author")
    .select(`*`)
    .eq("user", userId)
    .eq("primary", true)
    .single();

  if (error) {
    // If no primary author is found, get the first author for the user
    if (error.code === "PGRST116") {
      const { data: firstAuthor, error: firstAuthorError } = await supabase
        .from("author")
        .select(`*`)
        .eq("user", userId)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (firstAuthorError) {
        throw firstAuthorError;
      }

      // Set this author as primary
      if (firstAuthor) {
        const { error: updateError } = await supabase
          .from("author")
          .update({ primary: true })
          .eq("id", firstAuthor.id);

        if (updateError) {
          console.error("Error setting primary author:", updateError);
        }
      }

      return firstAuthor;
    }

    throw error;
  }

  return data;
}
