import { createClient } from "@/lib/utils/supabase/server";
import { getUserId } from "./auth";
import { Database } from "@/database.types";
import { redirect } from "next/navigation";
type Author = Database["public"]["Tables"]["author"]["Row"];
type Bookmark = Database["public"]["Tables"]["bookmark"]["Row"];
type Chapter = Database["public"]["Tables"]["chapter"]["Row"];
type Story = Database["public"]["Tables"]["story"]["Row"];

// Get primary author
export async function getPrimaryAuthor() {
  const supabase = await createClient();
  const userData = await getUserId();

  if (!userData) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("author")
    .select("*")
    .eq("user", userData.user_id)
    .eq("primary", true)
    .single();

  if (error) {
    throw error;
  }

  return data as Author;
}

// Get author stories
export async function getAuthorStories() {
  const supabase = await createClient();
  const userData = await getUserId();

  if (!userData) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("author")
    .select(`*, story(*, chapter(*, content.limit(100)))`)
    .eq("user", userData.user_id);

  if (error) {
    throw error;
  }

  return data as Author[];
}

// Get likes, recs, comments, bookmarks by author
export async function getAuthorInteractions() {
  const supabase = await createClient();
  const userData = await getUserId();

  if (!userData) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("author")
    .select(`*, like(*), rec(*), comment(*), bookmark(*)`)
    .eq("user", userData.user_id);

  if (error) {
    throw error;
  }

  return data as Author[];
}

// Get bookmarks
export async function getBookmarks(authorId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookmark")
    .select(`*, chapter(*, story(*)), author(*)`)
    .eq("author", authorId);

  if (error) {
    throw error;
  }

  return data.map((bookmark) => ({
    bookmark: bookmark,
    author: bookmark.author,
    chapter: bookmark.chapter,
    story: bookmark.chapter?.story,
  }));
}
