"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { ThemeProvider } from "./theme-provider";
import { ThemeVariables } from "@/lib/utils/theme-utils";
import { toast } from "sonner";
import Navbar from "./Navbar";
export interface Author {
  id: string;
  username?: string;
  theme?: string;
  custom_theme?: ThemeVariables;
  primary?: boolean;
  [key: string]: any;
}

interface AuthorProviderProps {
  children: React.ReactNode;
}

// Define the custom event interface
interface AuthorChangedEvent extends CustomEvent {
  detail: {
    authorId: string;
    isPrimary: boolean;
  };
}

export default function AuthorProvider({ children }: AuthorProviderProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [primaryAuthor, setPrimaryAuthor] = useState<Author | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to load authors
  const loadAuthors = async () => {
    setLoading(true);
    try {
      // Create Supabase client
      const supabase = createClient();

      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting current user:", userError);
        setError("Unable to authenticate user. Please sign in again.");
        setLoading(false);
        return;
      }

      console.log("User ID Origin: ", user.id);

      // Get all authors for the current user
      const { data: authorData, error: authorError } = await supabase
        .from("author")
        .select("*")
        .eq("user", user.id)
        .order("created_at", { ascending: true });

      if (authorError) {
        console.error("Error getting authors:", authorError);
        setError("Unable to load author profiles.");
        setLoading(false);
        return;
      }

      if (!authorData || authorData.length === 0) {
        console.log("No authors found for user");
        setError("No author profiles found for this user.");
        setLoading(false);
        return;
      }

      console.log("User ID In User Info: ", user.id);
      console.log("Data: ", authorData);

      // Normalize author IDs to strings
      const normalizedAuthors = authorData.map((author) => ({
        ...author,
        id: String(author.id),
      }));

      setAuthors(normalizedAuthors);

      // Find the primary author
      const primary = normalizedAuthors.find(
        (author) => author.primary === true
      );

      if (primary) {
        console.log("Primary author found:", primary.username || primary.id);
        setPrimaryAuthor(primary);
      } else if (normalizedAuthors.length > 0) {
        // If no primary author is found, set the first one as primary
        const firstAuthor = normalizedAuthors[0];
        console.log(
          "No primary author found, using first author:",
          firstAuthor.username || firstAuthor.id
        );

        // Update the database to set this author as primary
        const { error: updateError } = await supabase
          .from("author")
          .update({ primary: true })
          .eq("id", firstAuthor.id);

        if (updateError) {
          console.error("Error setting primary author:", updateError);
        } else {
          console.log("Set first author as primary");
          // Update the local author object to reflect the change
          firstAuthor.primary = true;
        }

        setPrimaryAuthor(firstAuthor);
      }
    } catch (err) {
      console.error("Error in loadAuthors:", err);
      setError("An unexpected error occurred while loading author data.");
    } finally {
      setLoading(false);
    }
  };

  // Load authors when component mounts
  useEffect(() => {
    loadAuthors();
  }, []);

  // Listen for authorChanged events
  useEffect(() => {
    const handleAuthorChangedEvent = (e: Event) => {
      const customEvent = e as AuthorChangedEvent;
      console.log(
        "AuthorProvider received authorChanged event:",
        customEvent.detail
      );

      // Refresh the authors list
      loadAuthors();
    };

    document.addEventListener("authorChanged", handleAuthorChangedEvent);
    console.log("Author changed event listener added");

    return () => {
      document.removeEventListener("authorChanged", handleAuthorChangedEvent);
      console.log("Author changed event listener removed");
    };
  }, []);

  // Show theme provider with authors
  // const showAuthorSelection = authors.length > 1;
  const showAuthorSelection = true; // Always show author selection

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading authors...
      </div>
    );
  }

  if (authors.length === 0) {
    console.log("No authors available in AuthorProvider");
    return (
      <div className="flex items-center justify-center h-screen">
        No authors available
      </div>
    );
  }

  if (!primaryAuthor && authors.length > 0) {
    console.log(
      "No primary author found, but authors exist. Using first author."
    );
    setPrimaryAuthor(authors[0]);
  }

  console.log("AuthorProvider rendering with:", {
    primaryAuthor: primaryAuthor ? primaryAuthor.username : "none",
    authorsCount: authors.length,
    showAuthorSelection,
  });

  return (
    <ThemeProvider
      defaultAuthor={primaryAuthor || undefined}
      authors={authors}
      showAuthorSelection={showAuthorSelection}
    >
      {children}
    </ThemeProvider>
  );
}
