"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";
import AuthorSelector from "./AuthorSelector";
import ThemeEditor from "@/components/ThemeEditor";
import { Button } from "@/components/ui/button";
import { PaintbrushIcon } from "lucide-react";
import { createClient } from "@/lib/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ThemeVariables,
  applyTheme,
  resetTheme,
  getAllThemeVariables,
} from "@/lib/utils/theme-utils";

interface Author {
  id: string;
  username?: string;
  theme?: string;
  custom_theme?: ThemeVariables;
  primary?: boolean;
  [key: string]: any;
}

// Extend the NextThemesProviderProps to include onThemeChange
interface ExtendedNextThemesProviderProps extends NextThemesProviderProps {
  onThemeChange?: (theme: string) => void;
}

interface ThemeProviderProps
  extends Omit<ExtendedNextThemesProviderProps, "defaultTheme"> {
  defaultAuthor?: Author;
  authors?: Author[];
  showAuthorSelection?: boolean;
}

// Define available themes
const AVAILABLE_THEMES = [
  "light",
  "dark",
  "tokyo-night",
  "nord",
  "dracula",
  "solarized",
];

// Define the custom event interface
interface ThemeChangedEvent extends CustomEvent {
  detail: {
    theme: string;
    authorId: string;
  };
}

export function ThemeProvider({
  children,
  defaultAuthor,
  authors = [],
  showAuthorSelection = false,
  ...props
}: ThemeProviderProps) {
  const router = useRouter();
  // Author selection state
  const [currentAuthor, setCurrentAuthor] = useState<Author | null>(
    defaultAuthor || null
  );
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  const previousAuthorIdRef = useRef<string | null>(
    defaultAuthor?.id ? String(defaultAuthor.id) : null
  );
  const [nextThemeValue, setNextThemeValue] = useState<string | undefined>(
    currentAuthor?.theme || "system"
  );

  // Log initial props for debugging
  useEffect(() => {
    console.log("ThemeProvider initialized with:", {
      defaultAuthor: defaultAuthor
        ? {
            id: defaultAuthor.id,
            username: defaultAuthor.username,
            theme: defaultAuthor.theme,
            hasCustomTheme: !!defaultAuthor.custom_theme,
            primary: defaultAuthor.primary,
          }
        : null,
      authorsCount: authors.length,
      showAuthorSelection,
    });

    // If we have a defaultAuthor, ensure it's set as the current author
    if (
      defaultAuthor &&
      (!currentAuthor || currentAuthor.id !== defaultAuthor.id)
    ) {
      console.log(
        "Setting defaultAuthor as currentAuthor:",
        defaultAuthor.username || defaultAuthor.id
      );
      setCurrentAuthor(defaultAuthor);
      previousAuthorIdRef.current = String(defaultAuthor.id);
      setNextThemeValue(defaultAuthor.theme || "system");
    }
    // If we have authors but no defaultAuthor or currentAuthor, use the primary author or first one
    else if (!defaultAuthor && !currentAuthor && authors.length > 0) {
      const primaryAuthor = authors.find((author) => author.primary === true);
      const authorToUse = primaryAuthor || authors[0];
      console.log(
        "No defaultAuthor, using author from list:",
        authorToUse.username || authorToUse.id
      );
      setCurrentAuthor(authorToUse);
      previousAuthorIdRef.current = String(authorToUse.id);
      setNextThemeValue(authorToUse.theme || "system");
    }
  }, [defaultAuthor, authors, showAuthorSelection, currentAuthor]);

  // Ensure all authors have string IDs
  const normalizedAuthors = authors.map((author) => ({
    ...author,
    id: String(author.id),
  }));

  // Function to revalidate and refresh
  const revalidateAndRefresh = useCallback(() => {
    console.log("Revalidating and refreshing...");

    // Revalidate the current path
    router.refresh();

    // Optionally, you can also force a full page reload
    // window.location.reload();

    console.log("Revalidation triggered");
  }, [router]);

  // Handle author change
  const handleAuthorChange = useCallback(async (author: Author) => {
    console.log(
      "ThemeProvider handling author change:",
      author.username || author.id,
      "Theme:",
      author.theme
    );

    // Only update if the author has actually changed
    if (String(author.id) !== previousAuthorIdRef.current) {
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
          return;
        }

        console.log("Setting author as primary:", author.id);

        // First, set all authors for this user to primary=false
        await supabase
          .from("author")
          .update({ primary: false })
          .eq("user", user.id);

        // Then, set the selected author to primary=true
        await supabase
          .from("author")
          .update({ primary: true })
          .eq("id", author.id);

        console.log(
          "Successfully updated primary author to:",
          author.username || author.id
        );

        // Update the current author state
        setCurrentAuthor(author);
        previousAuthorIdRef.current = String(author.id);

        // Update the next theme value based on the new author's theme
        setNextThemeValue(author.theme || "system");

        // Show success message
        toast.success(`Switched to author: ${author.username || author.id}`);

        // Dispatch a custom event to notify other components of the author change
        const authorChangedEvent = new CustomEvent("authorChanged", {
          detail: {
            authorId: author.id,
            isPrimary: true,
          },
        });
        document.dispatchEvent(authorChangedEvent);
        console.log("Author changed event dispatched");
      } catch (err) {
        console.error("Error updating primary author status:", err);
        toast.error("Failed to update author status");
      }
    }
  }, []);

  // Handle saving custom theme
  const handleSaveTheme = useCallback(
    async (updatedTheme: ThemeVariables) => {
      if (!currentAuthor) return;

      console.log("Saving custom theme for author:", currentAuthor.id);

      try {
        // Create Supabase client
        const supabase = createClient();

        // Update the author record in the database
        const { error } = await supabase
          .from("author")
          .update({
            theme: "custom", // Always set theme to "custom" for custom themes
            custom_theme: updatedTheme,
          })
          .eq("id", currentAuthor.id);

        if (error) {
          console.error("Error updating theme in database:", error);
          toast.error("Failed to save theme to database");
          throw error;
        }

        // Show success message
        toast.success("Custom theme saved successfully");

        // Update the current author with the new custom theme
        setCurrentAuthor((prevAuthor) => {
          if (!prevAuthor) return null;

          return {
            ...prevAuthor,
            theme: "custom", // Ensure theme is set to custom
            custom_theme: updatedTheme,
          };
        });

        // Update the next-theme value
        setNextThemeValue("custom");

        // First, reset any existing theme
        resetTheme(getAllThemeVariables());

        // Remove all theme classes
        AVAILABLE_THEMES.forEach((themeName) => {
          document.documentElement.classList.remove(themeName);
        });

        // Apply the custom theme
        applyTheme(updatedTheme);
        console.log("Applied custom theme for author:", currentAuthor.id);

        // Dispatch a custom event to notify other components of the theme change
        const themeChangedEvent = new CustomEvent("themeChanged", {
          detail: {
            theme: "custom",
            authorId: currentAuthor.id,
            customTheme: updatedTheme,
          },
        });
        document.dispatchEvent(themeChangedEvent);
        console.log("Theme changed event dispatched");

        // Revalidate and refresh
        revalidateAndRefresh();
      } catch (err) {
        console.error("Error in handleSaveTheme:", err);
      }
    },
    [currentAuthor, revalidateAndRefresh]
  );

  // Handle theme change (for preset themes)
  const handleThemeChange = useCallback(
    async (newTheme: string) => {
      if (!currentAuthor) {
        console.log("No current author, skipping theme change");
        return;
      }

      console.log(
        "ThemeProvider.handleThemeChange called with theme:",
        newTheme,
        "for author:",
        currentAuthor.id
      );

      try {
        // Create Supabase client
        const supabase = createClient();
        console.log("Supabase client created");

        // Update the author record in the database
        console.log(
          "Updating author theme in database for author:",
          currentAuthor.id
        );
        const { data: updateData, error } = await supabase
          .from("author")
          .update({
            theme: newTheme,
          })
          .eq("id", currentAuthor.id)
          .select();

        if (error) {
          console.error("Error updating theme in database:", error);
          toast.error("Failed to save theme preference");
          throw error;
        }

        console.log("Theme updated successfully in database:", updateData);

        // Show success message
        toast.success(`Theme changed to ${newTheme}`);

        // Update the current author with the new theme
        setCurrentAuthor((prevAuthor) => {
          if (!prevAuthor) return null;

          const updatedAuthor = {
            ...prevAuthor,
            theme: newTheme,
          };

          console.log("Updated current author state:", updatedAuthor);
          return updatedAuthor;
        });

        // Update the next-theme value
        setNextThemeValue(newTheme);

        // First, reset any existing theme
        resetTheme(getAllThemeVariables());

        // Remove all theme classes
        AVAILABLE_THEMES.forEach((themeName) => {
          document.documentElement.classList.remove(themeName);
        });

        // Apply the theme
        document.documentElement.classList.add(newTheme);
        console.log(
          "Applied theme class to document:",
          newTheme,
          "for author:",
          currentAuthor.id
        );

        // Dispatch a custom event to notify other components of the theme change
        const themeChangedEvent = new CustomEvent("themeChanged", {
          detail: { theme: newTheme, authorId: currentAuthor.id },
        });
        document.dispatchEvent(themeChangedEvent);
        console.log("Theme changed event dispatched");

        // Revalidate and refresh
        revalidateAndRefresh();
      } catch (err) {
        console.error("Error in handleThemeChange:", err);
      }
    },
    [currentAuthor, revalidateAndRefresh]
  );

  // Apply author's theme when it changes
  useEffect(() => {
    if (!currentAuthor) return;

    console.log(
      "Applying theme for author:",
      currentAuthor.username || currentAuthor.id,
      "Theme:",
      currentAuthor.theme
    );

    // First, reset any existing theme
    resetTheme(getAllThemeVariables());

    // Remove all theme classes
    AVAILABLE_THEMES.forEach((themeName) => {
      document.documentElement.classList.remove(themeName);
    });

    // Apply theme based on author's theme setting
    if (currentAuthor.theme === "custom" && currentAuthor.custom_theme) {
      // Apply custom theme if theme is explicitly set to "custom"
      applyTheme(currentAuthor.custom_theme);
      console.log("Applied custom theme for author:", currentAuthor.id);
    } else if (
      currentAuthor.theme &&
      AVAILABLE_THEMES.includes(currentAuthor.theme)
    ) {
      // Apply theme directly if it's one of the available themes
      document.documentElement.classList.add(currentAuthor.theme);
      console.log(
        "Applied theme:",
        currentAuthor.theme,
        "for author:",
        currentAuthor.id
      );
    }

    // Update the next-theme value
    setNextThemeValue(currentAuthor.theme || "system");

    // Cleanup function
    return () => {
      // Reset theme variables when component unmounts
      resetTheme(getAllThemeVariables());
      console.log("Reset theme variables (cleanup)");
    };
  }, [currentAuthor]);

  // Handle theme change from NextThemesProvider
  const handleNextThemeChange = useCallback(
    (theme: string) => {
      console.log("NextThemesProvider theme changed to:", theme);
      if (currentAuthor && theme !== currentAuthor.theme) {
        console.log("Forwarding theme change to handleThemeChange");
        handleThemeChange(theme);
      }
    },
    [currentAuthor, handleThemeChange]
  );

  // Set up theme change listener for storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      console.log("Storage event detected:", e.key, e.newValue);
      if (e.key === "theme" && e.newValue && currentAuthor) {
        if (e.newValue !== currentAuthor.theme) {
          console.log("Theme changed in storage, updating");
          handleThemeChange(e.newValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    console.log("Storage event listener added");

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      console.log("Storage event listener removed");
    };
  }, [currentAuthor, handleThemeChange]);

  // Set up theme change listener for custom themeChanged events
  useEffect(() => {
    const handleThemeChangedEvent = (e: Event) => {
      const customEvent = e as ThemeChangedEvent;
      console.log(
        "ThemeProvider received themeChanged event:",
        customEvent.detail
      );

      // Only update if this is for the current author
      if (
        currentAuthor &&
        String(currentAuthor.id) === String(customEvent.detail.authorId)
      ) {
        const newTheme = customEvent.detail.theme;
        console.log("Updating current author theme from event:", newTheme);

        // Update the current author with the new theme
        setCurrentAuthor((prevAuthor) => {
          if (!prevAuthor) return null;

          const updatedAuthor = {
            ...prevAuthor,
            theme: newTheme,
          };

          console.log("Updated author state from event:", updatedAuthor);
          return updatedAuthor;
        });

        // Update the next-theme value
        setNextThemeValue(newTheme);

        // First, reset any existing theme
        resetTheme(getAllThemeVariables());

        // Remove all theme classes
        AVAILABLE_THEMES.forEach((themeName) => {
          document.documentElement.classList.remove(themeName);
        });

        // Apply the theme
        if (newTheme === "custom") {
          if (currentAuthor.custom_theme) {
            // Apply custom theme from author's saved custom theme
            applyTheme(currentAuthor.custom_theme);
            console.log(
              "Applied custom theme from event for author:",
              currentAuthor.id
            );
          }
        } else if (AVAILABLE_THEMES.includes(newTheme)) {
          // Apply the theme class
          document.documentElement.classList.add(newTheme);
          console.log(
            "Applied theme from event:",
            newTheme,
            "for author:",
            currentAuthor.id
          );
        }
      } else {
        console.log(
          "Ignoring theme change event for different author. Current:",
          currentAuthor?.id,
          "Event for:",
          customEvent.detail.authorId
        );
      }
    };

    document.addEventListener("themeChanged", handleThemeChangedEvent);
    console.log("Theme changed event listener added");

    return () => {
      document.removeEventListener("themeChanged", handleThemeChangedEvent);
      console.log("Theme changed event listener removed");
    };
  }, [currentAuthor]);

  // Render with author selection if enabled
  const renderWithAuthorSelection = () => {
    // Log the current state for debugging
    console.log("renderWithAuthorSelection called with:", {
      currentAuthor: currentAuthor
        ? {
            id: currentAuthor.id,
            username: currentAuthor.username,
            primary: currentAuthor.primary,
          }
        : null,
      authorsCount: normalizedAuthors.length,
      normalizedAuthorsIds: normalizedAuthors.map((a) => a.id),
    });

    if (!currentAuthor && normalizedAuthors.length > 0) {
      // If we have authors but no current author, use the primary author or the first one
      const primaryAuthor = normalizedAuthors.find(
        (author) => author.primary === true
      );
      const authorToUse = primaryAuthor || normalizedAuthors[0];

      console.log(
        "No current author but authors exist, using:",
        authorToUse.username || authorToUse.id
      );

      // Update the current author state immediately
      setTimeout(() => {
        setCurrentAuthor(authorToUse);
        previousAuthorIdRef.current = String(authorToUse.id);
        setNextThemeValue(authorToUse.theme || "system");

        // Apply theme based on author's theme setting immediately
        resetTheme(getAllThemeVariables());
        AVAILABLE_THEMES.forEach((themeName) => {
          document.documentElement.classList.remove(themeName);
        });

        if (authorToUse.theme === "custom" && authorToUse.custom_theme) {
          applyTheme(authorToUse.custom_theme);
          console.log("Applied custom theme for author:", authorToUse.id);
        } else if (
          authorToUse.theme &&
          AVAILABLE_THEMES.includes(authorToUse.theme)
        ) {
          document.documentElement.classList.add(authorToUse.theme);
          console.log(
            "Applied theme:",
            authorToUse.theme,
            "for author:",
            authorToUse.id
          );
        }
      }, 0);

      // Return a loading state while we update the current author
      return (
        <div className="flex items-center justify-center h-screen">
          <p>Initializing theme...</p>
        </div>
      );
    }

    if (normalizedAuthors.length === 0) {
      console.log("No authors available, using placeholder");

      // Create a placeholder author if no authors exist
      const placeholderAuthor = {
        id: "placeholder",
        username: "Default Author",
        theme: "system",
      };

      return (
        <>
          <AuthorSelector
            authors={[placeholderAuthor]}
            selectedAuthor={placeholderAuthor}
            onAuthorChange={handleAuthorChange}
          >
            <NextThemesProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              themes={AVAILABLE_THEMES}
              {...props}
            >
              {children}
            </NextThemesProvider>
          </AuthorSelector>
        </>
      );
    }

    // If we have a current author but it's not in the normalized authors list,
    // use the primary author or first author from the list
    if (
      currentAuthor &&
      !normalizedAuthors.some((a) => a.id === currentAuthor.id)
    ) {
      console.log(
        "Current author not found in authors list, finding replacement"
      );
      const primaryAuthor = normalizedAuthors.find(
        (author) => author.primary === true
      );
      const authorToUse = primaryAuthor || normalizedAuthors[0];

      console.log(
        "Replacing current author with:",
        authorToUse.username || authorToUse.id
      );
      setTimeout(() => {
        setCurrentAuthor(authorToUse);
        previousAuthorIdRef.current = String(authorToUse.id);
        setNextThemeValue(authorToUse.theme || "system");
      }, 0);
    }

    if (normalizedAuthors.length > 0 && !currentAuthor) {
      console.log(
        "Rendering without current author or with empty authors list, but still showing author selector UI"
      );
    }

    console.log(
      "Rendering with author selection, current theme:",
      currentAuthor?.theme,
      "nextThemeValue:",
      nextThemeValue,
      "for author:",
      currentAuthor?.username || currentAuthor?.id
    );

    return (
      <>
        {currentAuthor && (
          <ThemeEditor
            author={currentAuthor}
            onSave={handleSaveTheme}
            open={themeEditorOpen}
            onOpenChange={setThemeEditorOpen}
          />
        )}

        <AuthorSelector
          authors={normalizedAuthors}
          selectedAuthor={currentAuthor || normalizedAuthors[0]}
          onAuthorChange={handleAuthorChange}
          onThemeEditorOpen={() => setThemeEditorOpen(true)}
        >
          <NextThemesProvider
            attribute="class"
            defaultTheme={nextThemeValue}
            enableSystem
            themes={AVAILABLE_THEMES}
            onThemeChange={handleNextThemeChange}
            {...props}
          >
            <div className="flex flex-col min-h-screen">{children}</div>
          </NextThemesProvider>
        </AuthorSelector>
      </>
    );
  };

  // Render without author selection
  const renderWithoutAuthorSelection = () => {
    console.log(
      "Rendering without author selection, current theme:",
      currentAuthor?.theme,
      "nextThemeValue:",
      nextThemeValue
    );
    return (
      <NextThemesProvider
        attribute="class"
        defaultTheme={nextThemeValue}
        enableSystem
        themes={AVAILABLE_THEMES}
        onThemeChange={handleNextThemeChange}
        {...props}
      >
        {currentAuthor && (
          <ThemeEditor
            author={currentAuthor}
            onSave={handleSaveTheme}
            open={themeEditorOpen}
            onOpenChange={setThemeEditorOpen}
          />
        )}
        {children}
      </NextThemesProvider>
    );
  };

  return showAuthorSelection
    ? renderWithAuthorSelection()
    : renderWithoutAuthorSelection();
}
