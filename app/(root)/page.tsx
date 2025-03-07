import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { TypoH1 } from "../../components/visual/typography";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { convertDate } from "@/lib/utils/convert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { CheckIcon } from "@/components/visual/icons";
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

// Icons
import {
  CheckIcon,
  BookOpenUserIcon,
  BookmarkIcon,
} from "@/components/visual/icons";
import CustomAcc from "@/components/customacc";
import PaginationContainer from "@/components/Pagination";
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
      {/* ┌───────────────────────────── ACCORDION ─────────────────────────────────┐ */}
      {/* <Accordion className="mb-4 flex flex-row" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>HAVING A PROBLEM?</AccordionTrigger>
          <AccordionContent>
            <pre>{JSON.stringify(bookmarks, null, 2)}</pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion> */}

      {/* ┌───────────────────────────── GREETING ─────────────────────────────────┐ */}
      <Card className="mb-18">
        <CardHeader>
          <TypoH1 className="flex flex-row items-center gap-2">
            Welcome to your Dashboard
          </TypoH1>
        </CardHeader>
        <CardContent className="text-lg">
          <p>
            This is where you will find your bookmarks, recs, and the content
            you've interacted with.
          </p>
        </CardContent>
      </Card>

      <TypoH1 className="flex flex-row items-center gap-2 mb-10 border-b border-muted-foreground pb-5">
        <BookmarkIcon />
        Bookmarks
      </TypoH1>
      {bookmarks.map((bookmark) => (
        <Card className="mb-15" key={bookmark.bookmark.id}>
          {/* ┌───────────────────────────── TOP ─────────────────────────────────┐ */}
          <CardHeader className="flex flex-row justify-start items-center">
            {/* Story Title */}
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center gap-4 text-3xl font-bold freight-title">
                {bookmark.story.title}
              </div>

              {/* BY */}
              <div className="mx-5 text-sm">BY</div>

              {/* Author Username */}
              <div className="text-xl font-bold">
                {bookmark.author.username}
              </div>
            </div>

            {/* Created At */}
            <div className="border-l-2 border-border ml-10 pl-10 text-sm">
              CREATED ON {convertDate(bookmark.bookmark.created_at)}
            </div>

            <div className="icons ml-auto flex flex-row gap-2">
              <Button variant="outline">
                <CheckIcon />
              </Button>
              <Button variant="outline">
                <BookOpenUserIcon />
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent>
            {/* ┌───────────────────────────── MIDDLE ─────────────────────────────────┐ */}
            <div className="border-border flex flex-row items-center gap-5 pb-3">
              {/* Pairings */}
              <div className="pairings">
                <Link
                  href={`/story/${bookmark.story.id}/pairings/${bookmark.story.primary_pairing?.id}`}
                >
                  <div className="pairing">
                    {bookmark.story.primary_pairing?.p?.map(
                      (character: string, index: number) =>
                        (index > 0 ? " x " : "") + character
                    )}
                  </div>
                </Link>
              </div>

              {/* Chapter Info */}
              <div className="flex flex-row items-center gap-2">
                <div className="ch-index border rounded-md px-2  py-1 ml-4">
                  CH {bookmark.chapter.chapter_index}
                </div>
                <div className="ch-title">
                  <Link
                    href={`/story/${bookmark.story.id}/chapter/${bookmark.chapter.id}`}
                  >
                    {bookmark.chapter.title}
                  </Link>
                </div>
              </div>
            </div>
            <Separator />
            {/* ┌───────────────────────────── Preview ─────────────────────────────────┐ */}
            <div className="flex flex-row items-center gap-2">
              {/* Content */}
              <div className="content-preview text-sm mt-6 mb-6">
                <b>Preview: </b> {bookmark.chapter.preview}
              </div>
            </div>
            {/* Summary */}
            <Separator />
            {/* ┌───────────────────────────── Summary ─────────────────────────────────┐ */}
            <div className="summary mt-5">
              <p>
                <b>Summary: </b>
                {bookmark.story.summary}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
