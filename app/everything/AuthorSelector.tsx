"use client";

import { useState, useEffect } from "react";
import { ThemeVariables } from "@/lib/utils/theme-utils";
import Navbar from "./Navbar";
import { ModeToggle } from "./mode-toggle";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { SwatchesIcon } from "./icons";
import { NavMenu } from "./NavMenu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Author {
  id: string;
  username?: string;
  theme?: string;
  custom_theme?: ThemeVariables;
  primary?: boolean;
  [key: string]: any;
}

interface AuthorSelectorProps {
  authors: Author[];
  selectedAuthor: Author;
  children: React.ReactNode;
  onAuthorChange: (author: Author) => void;
  onThemeEditorOpen?: () => void;
}

export default function AuthorSelector({
  authors,
  selectedAuthor,
  children,
  onAuthorChange,
  onThemeEditorOpen,
}: AuthorSelectorProps) {
  // Add debugging for props
  useEffect(() => {
    console.log("AuthorSelector received props:", {
      authors: authors.map((a) => ({
        id: a.id,
        username: a.username,
        theme: a.theme,
        hasCustomTheme: !!a.custom_theme,
      })),
      selectedAuthor: {
        id: selectedAuthor.id,
        username: selectedAuthor.username,
        theme: selectedAuthor.theme,
        hasCustomTheme: !!selectedAuthor.custom_theme,
      },
    });
  }, [authors, selectedAuthor]);

  // This function handles both direct value changes (from shadcn Select)
  // and event-based changes (from HTML select)
  const handleAuthorChange = (
    valueOrEvent: string | React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Determine if this is a direct value or an event
    const authorId =
      typeof valueOrEvent === "string"
        ? valueOrEvent
        : valueOrEvent.target.value;

    console.log("Author selection changed to ID:", authorId);
    console.log(
      "Available author IDs:",
      authors.map((a) => a.id)
    );

    // Find the author by string ID comparison
    const newSelectedAuthor = authors.find(
      (author) => String(author.id) === String(authorId)
    );

    if (!newSelectedAuthor) {
      console.error("Could not find author with ID:", authorId);
      console.error("Authors array:", JSON.stringify(authors, null, 2));
      return;
    }

    console.log(
      "Found author:",
      newSelectedAuthor.username || newSelectedAuthor.id,
      "Theme:",
      newSelectedAuthor.theme,
      "Custom Theme:",
      newSelectedAuthor.custom_theme ? "Present" : "None"
    );
    onAuthorChange(newSelectedAuthor);
  };

  return (
    <>
      <div className="p-4 border-b mb-10">
        <div className="container flex flex-row justify-between items-center header-container p-4 mx-auto">
          {/* Navigation*/}
          <Navbar onThemeEditorOpen={onThemeEditorOpen} />

          <NavMenu />

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>

          <div className="flex flex-row items-center gap-2">
            {/* Author Selector - Using shadcn UI Select */}
            <Select
              value={String(selectedAuthor.id)}
              onValueChange={handleAuthorChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    selectedAuthor.username || `Author ${selectedAuthor.id}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={String(author.id)}>
                    {author.username || `Author ${author.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ModeToggle />

            {onThemeEditorOpen && (
              <Button
                onClick={onThemeEditorOpen}
                className="p-2 rounded-full w-8 h-8 flex items-center justify-center"
                title="Edit Theme"
                size="icon"
                variant="outline"
              >
                <SwatchesIcon />
              </Button>
            )}
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
