"use client";

import * as React from "react";
import { Moon, Sun, Palette, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/utils/supabase/client";
import { toast } from "sonner";
import { updateAuthorTheme } from "@/app/actions/theme-actions";
import { useRouter } from "next/navigation";
import {
  applyTheme,
  resetTheme,
  getAllThemeVariables,
} from "@/lib/utils/theme-utils";

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
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const { currentAuthor, applyAuthorTheme } = useAppContext();
  const [activeTheme, setActiveTheme] = React.useState<string>("system");

  // Initialize active theme from current theme
  React.useEffect(() => {
    if (theme) {
      setActiveTheme(theme);
    }
  }, [theme]);

  const handleThemeChange = React.useCallback(
    async (newTheme: string) => {
      try {
        if (!currentAuthor) {
          toast.error("No author selected");
          return;
        }

        // Start loading with a message
        startLoading("Changing theme...");

        // Apply the theme immediately for visual feedback
        if (typeof applyAuthorTheme === "function") {
          // Create a temporary author object with the new theme
          const tempAuthor = {
            ...currentAuthor,
            theme: newTheme,
          };
          applyAuthorTheme(tempAuthor);
        } else {
          // Fallback implementation
          // First, reset any existing theme
          resetTheme(getAllThemeVariables());

          // Define available themes for class removal
          const availableThemeClasses = [
            "light",
            "dark",
            "system",
            "tokyo-night",
            "nord",
            "dracula",
            "solarized",
            "custom",
          ];

          // Remove all theme classes
          availableThemeClasses.forEach((themeName) => {
            document.documentElement.classList.remove(themeName);
          });

          // Apply the new theme
          document.documentElement.classList.add(newTheme);
          setTheme(newTheme);
        }

        // Update the author's theme using our server action
        const result = await updateAuthorTheme(currentAuthor.id, newTheme);

        if (!result.success) {
          console.error("Error updating theme:", result.error);
          toast.error("Failed to save theme preference");
          stopLoading();
          return;
        }

        // Show success message
        const themeOption = THEME_OPTIONS.find((t) => t.id === newTheme);
        toast.success(`Theme changed to ${themeOption?.name || newTheme}`);

        // Use Next.js router to refresh the page without a hard reload
        router.refresh();

        // Stop loading after a short delay
        setTimeout(() => {
          stopLoading();
        }, 300);
      } catch (error) {
        console.error("Error changing theme:", error);
        toast.error("An error occurred while changing theme");
        stopLoading();
      }
    },
    [
      setTheme,
      router,
      startLoading,
      stopLoading,
      currentAuthor,
      applyAuthorTheme,
    ]
  );

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
