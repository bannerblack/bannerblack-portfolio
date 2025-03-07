import { TypoH1 } from "@/components/visual/typography";
import { createClient } from "@/lib/utils/supabase/server";
import { getPrimaryAuthor } from "@/lib/query/queries";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
export default async function StoryPage({
  params,
}: {
  params: { "story-id": string };
}) {
  const storyId = await params["story-id"];
  console.log("storyId", storyId);

  const supabase = await createClient();

  // Get the current author's ID
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const author = await getPrimaryAuthor();

  const authorId = author?.id;

  const { data: story, error } = await supabase
    .from("story")
    .select(
      `
      *,
      author(id, username),
      recs:rec(id, author(id), note),
      likes:like(id, author(id))
    `
    )
    .eq("id", storyId)
    .eq("recs.author.id", authorId)
    .eq("likes.author.id", authorId)
    .single();

  if (error) {
    console.error(error);
  }

  return (
    <div className="flex flex-col gap-4">
      <TypoH1>
        {story?.title} by {story?.author.username}
      </TypoH1>

      {story?.recs.length > 0 && (
        <div className="flex flex-col gap-4">
          <p>
            You recommended this story. Note: <em>{story?.recs[0].note}</em>
          </p>
        </div>
      )}

      {story?.likes.length > 0 ? (
        <p className="flex items-center gap-2">
          <CheckIcon className="text-green-500" /> You liked this story.
        </p>
      ) : (
        <p className="flex items-center gap-2 text-muted-foreground">
          <CheckIcon className="text-red-500" /> You have not liked this story
          yet.
        </p>
      )}

      <pre>{JSON.stringify(story, null, 2)}</pre>

      {/* Created at */}
      <p className="text-sm text-muted-foreground">
        Created at {story?.created_at}
      </p>
      {/* Series */}
      <p className="text-sm text-muted-foreground">
        Series:{" "}
        <Link href={`/series/${story?.series?.series_id}`}>
          {story?.series?.name}
        </Link>
      </p>

      {/* Main Pairing */}
      <p className="text-sm text-muted-foreground">
        Main Pairing:{" "}
        <Link href={`/pairing/${story?.primary_pairing?.pairing_id}`}>
          {story?.primary_pairing?.name}
        </Link>
      </p>

      {/* Other Pairings */}
      {story?.secondary_pairing && (
        <p className="text-sm text-muted-foreground">
          Other Pairings:{" "}
          <Link href={`/pairing/${story?.secondary_pairing?.pairing_id}`}>
            {story?.secondary_pairing?.name}
          </Link>
        </p>
      )}

      {/* Themes */}
      {/* "themes": {
        "Subunit": 2,
        "Fake Dating": 3,
        "Music Creation": 1
      }, */}
      {Object.entries(story?.themes || {}).map(([theme, count]) => (
        <p key={theme} className="text-sm text-muted-foreground">
          <span
            className={`border rounded-sm p-1 border-red-${
              Number(count) === 1
                ? "100"
                : Number(count) === 2
                ? "200"
                : Number(count) >= 3
                ? "300"
                : "200"
            }`}
          >
            {theme} ({count} time{Number(count) > 1 ? "s" : ""})
          </span>
        </p>
      ))}

      {/* Warnings */}
      {Object.entries(story?.warnings || {}).map(([warning, count]) => (
        <p key={warning} className="text-sm text-muted-foreground">
          <span
            className={`text-muted-foreground border rounded-sm p-1 border-accent saturate-${
              Number(count) === 1
                ? "200"
                : Number(count) === 2
                ? "400"
                : Number(count) >= 3
                ? "150"
                : "200"
            }`}
          >
            {warning} ({count} time{Number(count) > 1 ? "s" : ""})
          </span>
        </p>
      ))}
    </div>
  );
}
