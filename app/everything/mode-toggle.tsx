"use client";

import * as React from "react";
import { Moon, Sun, Palette, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

// Define available themes with more metadata
interface ThemeOption {
  id: string;
  name: string;
  type: "system" | "base" | "preset";
  icon?: React.ReactNode;
  description?: string;
  preview?: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "light",
    name: "Light",
    type: "base",
    icon: <Sun className="h-4 w-4 mr-2" />,
    description: "Clean light theme with good contrast",
  },
  {
    id: "dark",
    name: "Dark",
    type: "base",
    icon: <Moon className="h-4 w-4 mr-2" />,
    description: "Dark theme for reduced eye strain",
  },
  {
    id: "system",
    name: "System",
    type: "system",
    description: "Follow your system preferences",
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    type: "preset",
    description: "Deep blues with vibrant accents",
    preview: "bg-[hsl(225,27%,15%)]",
  },
  {
    id: "nord",
    name: "Nord",
    type: "preset",
    description: "Cool blue-gray with soft colors",
    preview: "bg-[hsl(220,16%,22%)]",
  },
  {
    id: "dracula",
    name: "Dracula",
    type: "preset",
    description: "Dark purple with vibrant highlights",
    preview: "bg-[hsl(231,15%,18%)]",
  },
  {
    id: "solarized",
    name: "Solarized",
    type: "preset",
    description: "Teal-based theme with warm accents",
    preview: "bg-[hsl(194,14%,20%)]",
  },
];

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const router = useRouter();
  const [activeTheme, setActiveTheme] = React.useState<string>("system");

  // Initialize active theme from current theme
  React.useEffect(() => {
    if (theme) {
      setActiveTheme(theme);
    }
  }, [theme]);

  // Function to revalidate and refresh
  const revalidateAndRefresh = React.useCallback(() => {
    console.log("ModeToggle: Revalidating and refreshing...");
    router.refresh();
    console.log("ModeToggle: Revalidation triggered");
  }, [router]);

  const updateAuthorTheme = React.useCallback(
    async (newTheme: string) => {
      console.log("updateAuthorTheme called with theme:", newTheme);

      if (isUpdating) {
        console.log("Already updating, skipping");
        return;
      }

      try {
        setIsUpdating(true);
        console.log("Setting isUpdating to true");

        // Create Supabase client
        const supabase = createClient();
        console.log("Supabase client created");

        // Get the current user
        console.log("Getting current user...");
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Error getting current user:", userError);
          return;
        }
        console.log("Current user found:", user.id);

        // Get the primary author profile for the current user
        console.log("Getting primary author profile for user:", user.id);
        let { data: currentAuthor, error: authorError } = await supabase
          .from("author")
          .select("*")
          .eq("user", user.id)
          .eq("primary", true)
          .single();

        if (authorError || !currentAuthor) {
          console.error("Error getting primary author profile:", authorError);
          // Fallback to any author if no primary author is found
          const { data: fallbackAuthor, error: fallbackError } = await supabase
            .from("author")
            .select("*")
            .eq("user", user.id)
            .limit(1)
            .single();

          if (fallbackError || !fallbackAuthor) {
            console.error(
              "Error getting fallback author profile:",
              fallbackError
            );
            toast.error("Could not find an author profile to update");
            return;
          }

          console.log("Using fallback author:", fallbackAuthor.id);
          currentAuthor = fallbackAuthor;
        }

        console.log(
          "Author profile found:",
          currentAuthor.id,
          "Current theme:",
          currentAuthor.theme
        );

        // Check if this is a preset theme
        const themeOption = THEME_OPTIONS.find((t) => t.id === newTheme);
        const isPresetTheme = themeOption?.type === "preset";
        const isBaseTheme =
          themeOption?.type === "base" || themeOption?.type === "system";

        // Update the author's theme preference
        console.log(
          "Updating author theme to:",
          newTheme,
          isPresetTheme ? "(preset theme)" : ""
        );

        // Simply update the theme property - it stores either the preset name or "custom"
        const { data: updatedData, error: updateError } = await supabase
          .from("author")
          .update({
            theme: newTheme, // Store the actual theme name in the theme property
          })
          .eq("id", currentAuthor.id)
          .select();

        if (updateError) {
          console.error("Error updating author theme:", updateError);
          toast.error("Failed to save theme preference");
          return;
        }

        console.log("Theme updated successfully in database:", updatedData);

        // Dispatch a custom event to notify other components of the theme change
        const themeChangedEvent = new CustomEvent("themeChanged", {
          detail: {
            theme: newTheme,
            authorId: currentAuthor.id,
          },
        });
        document.dispatchEvent(themeChangedEvent);
        console.log("Theme changed event dispatched");

        console.log("Theme preference saved:", newTheme);
        toast.success(`Theme changed to ${themeOption?.name || newTheme}`);

        // Revalidate and refresh
        revalidateAndRefresh();
      } catch (error) {
        console.error("Error in updateAuthorTheme:", error);
        toast.error("An error occurred while updating theme");
      } finally {
        console.log("Setting isUpdating to false");
        setIsUpdating(false);
      }
    },
    [isUpdating, revalidateAndRefresh]
  );

  const handleThemeChange = React.useCallback(
    (newTheme: string) => {
      console.log("handleThemeChange called with theme:", newTheme);
      setActiveTheme(newTheme);

      // Set the theme in next-themes
      setTheme(newTheme);
      console.log("Theme set in next-themes");

      // Update the author's theme in the database
      updateAuthorTheme(newTheme);

      // Apply the theme class directly to ensure immediate visual feedback
      const themeOption = THEME_OPTIONS.find((t) => t.id === newTheme);

      // Remove all theme classes first
      THEME_OPTIONS.forEach((option) => {
        if (option.type === "preset" || option.type === "base") {
          document.documentElement.classList.remove(option.id);
        }
      });

      // Add the new theme class if it's a preset or base theme (not system)
      if (themeOption && themeOption.type !== "system") {
        document.documentElement.classList.add(newTheme);
        console.log("Theme class applied to document:", newTheme);
      }
    },
    [setTheme, updateAuthorTheme]
  );

  // Get the current theme option
  const currentThemeOption =
    THEME_OPTIONS.find((t) => t.id === activeTheme) || THEME_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuRadioGroup
          value={activeTheme}
          onValueChange={handleThemeChange}
        >
          {/* Base themes */}
          {THEME_OPTIONS.filter(
            (t) => t.type === "base" || t.type === "system"
          ).map((option) => (
            <DropdownMenuRadioItem
              key={option.id}
              value={option.id}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                {option.icon}
                <span>{option.name}</span>
              </div>
              {activeTheme === option.id && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </DropdownMenuRadioItem>
          ))}

          <DropdownMenuSeparator />

          {/* Preset themes */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className="mr-2 h-4 w-4" />
              <span>Theme Presets</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-56">
                {THEME_OPTIONS.filter((t) => t.type === "preset").map(
                  (option) => (
                    <DropdownMenuRadioItem
                      key={option.id}
                      value={option.id}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full ${option.preview}`}
                        ></div>
                        <div className="flex flex-col">
                          <span>{option.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </div>
                      {activeTheme === option.id && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuRadioItem>
                  )
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
