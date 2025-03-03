import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { TypoH1 } from "./typography";
import { Suspense } from "react";
import AuthorContext from "../../components/AuthorContext";
import { getBookmarks } from "../../lib/query/queries";
import { getPrimaryAuthor } from "../../lib/query/queries";
import { Database } from "@/database.types";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
// ┌──────────────────────────────────────────────────────────────────────────┐
// │ ██████╗  ██████╗  ██████╗ ████████╗    ██████╗  █████╗  ██████╗ ███████╗ │
// │ ██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝    ██╔══██╗██╔══██╗██╔════╝ ██╔════╝ │
// │ ██████╔╝██║   ██║██║   ██║   ██║       ██████╔╝███████║██║  ███╗█████╗   │
// │ ██╔══██╗██║   ██║██║   ██║   ██║       ██╔═══╝ ██╔══██║██║   ██║██╔══╝   │
// │ ██║  ██║╚██████╔╝╚██████╔╝   ██║       ██║     ██║  ██║╚██████╔╝███████╗ │
// │ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝ │
// └──────────────────────────────────────────────────────────────────────────┘

type Bookmark = Database["public"]["Tables"]["bookmark"]["Row"];
type Author = Database["public"]["Tables"]["author"]["Row"];
type Chapter = Database["public"]["Tables"]["chapter"]["Row"];
type Story = Database["public"]["Tables"]["story"]["Row"];

// ┌──────────────────────────────── MAIN COMPONENT ──────────────────────────────────────────┐

const Dashboard = async () => {
  const primaryAuthor = await getPrimaryAuthor();
  const bookmarks = await getBookmarks(primaryAuthor.id);
  console.log(bookmarks);

  return (
    <>
      {/* SO YOU KNOW WHO IS WHO, NOW */}
      <Suspense></Suspense>

      {/* BOOKMARKS */}
      <Suspense>
        <BookmarkCard bookmarks={bookmarks} />
      </Suspense>
    </>
  );
};

export default Dashboard;

// ┌──────────────────────────────── BOOKMARK CARD ──────────────────────────────────────────┐
const BookmarkCard = ({
  bookmarks,
}: {
  bookmarks: {
    bookmark: Bookmark;
    author: Author;
    chapter: Chapter;
    story: Story;
  }[];
}) => {
  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>HAVING A PROBLEM?</AccordionTrigger>
          <AccordionContent>
            <pre>{JSON.stringify(bookmarks, null, 2)}</pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {bookmarks.map((bookmark) => (
        <Card key={bookmark.bookmark.id}>
          <CardHeader>
            <b>Bookmarked:</b> on {bookmark.bookmark.created_at}
            <br />
            {bookmark.story.title} by {bookmark.author.username}
          </CardHeader>
          <CardContent>
            {/* Pairings */}
            <Link href={`/story/${bookmark.story.primary_pairing?.pairing_id}`}>
              <div>
                {bookmark.story.primary_pairing?.p.map(
                  (pairing: string, index: number) =>
                    (index > 0 ? " x " : "") + pairing
                )}
              </div>
            </Link>
            <Link
              href={`/story/${bookmark.story.id}/chapter/${bookmark.chapter.id}`}
            >
              CH{bookmark.chapter.chapter_index} : {bookmark.chapter.title}
            </Link>
            <p>
              <b>Summary: </b>
              {bookmark.story.summary}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
