"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeEditor from "@/components/ThemeEditor";
import { toast } from "sonner";
import { ThemeVariables } from "@/lib/utils/theme-utils";

interface Author {
  id: string;
  username?: string;
  theme?: string;
  custom_theme?: ThemeVariables;
  [key: string]: any;
}

export default function ThemeSettingsPage() {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("system");
  const router = useRouter();

  // Predefined themes
  const predefinedThemes = [
    { id: "system", name: "System" },
    { id: "light", name: "Light" },
    { id: "dark", name: "Dark" },
    { id: "tokyo-night", name: "Tokyo Night" },
    { id: "nord", name: "Nord" },
    { id: "dracula", name: "Dracula" },
    { id: "solarized", name: "Solarized" },
    { id: "custom", name: "Custom" },
  ];

  // Fetch the current user's author profile
  useEffect(() => {
    async function fetchAuthorProfile() {
      try {
        setLoading(true);
        const supabase = createClient();

        // Get the current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("Not authenticated");
        }

        // Get the author profile for the current user
        const { data: authors, error: authorError } = await supabase
          .from("author")
          .select("*")
          .eq("user", user.id)
          .eq("primary", true)
          .single();

        if (authorError) {
          throw authorError;
        }

        // Set the author and selected theme
        setAuthor(authors);
        setSelectedTheme(authors.theme || "system");
      } catch (error) {
        console.error("Error fetching author profile:", error);
        toast.error("Failed to load your profile");
      } finally {
        setLoading(false);
      }
    }

    fetchAuthorProfile();
  }, []);

  // Handle theme change
  const handleThemeChange = async (theme: string) => {
    if (!author) return;

    try {
      setSelectedTheme(theme);

      // Update the theme in the database
      const supabase = createClient();
      const { error } = await supabase
        .from("author")
        .update({ theme })
        .eq("id", author.id);

      if (error) {
        throw error;
      }

      // Update local state
      setAuthor((prev) => (prev ? { ...prev, theme } : null));

      // Apply the theme to the document
      document.documentElement.className = theme;

      toast.success(`Theme changed to ${theme}`);
    } catch (error) {
      console.error("Error changing theme:", error);
      toast.error("Failed to update theme");
    }
  };

  // Handle custom theme save
  const handleSaveCustomTheme = async (customTheme: ThemeVariables) => {
    if (!author) return;

    try {
      // Update the database
      const supabase = createClient();
      const { error } = await supabase
        .from("author")
        .update({
          theme: "custom",
          custom_theme: customTheme,
        })
        .eq("id", author.id);

      if (error) {
        throw error;
      }

      // Update local state
      setAuthor((prev) =>
        prev
          ? {
              ...prev,
              theme: "custom",
              custom_theme: customTheme,
            }
          : null
      );

      setSelectedTheme("custom");

      toast.success("Custom theme saved successfully");
    } catch (error) {
      console.error("Error saving custom theme:", error);
      toast.error("Failed to save custom theme");
    }
  };

  // Helper function to get a display-friendly variable name
  const getDisplayName = (cssVar: string) => {
    return cssVar.replace(/^--/, "");
  };

  // Helper function to get a CSS color value for display
  const getColorValue = (cssValue: string | undefined) => {
    return cssValue || "transparent";
  };

  // if (loading) {
  //   return (
  //     <div className="container mx-auto py-10">
  //       <Card>
  //         <CardContent className="pt-6">
  //           <div className="flex items-center justify-center h-40">
  //             <p>Loading theme settings...</p>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  if (!author) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center h-40 gap-4">
              <p>You need to be signed in to access theme settings.</p>
              <Button onClick={() => router.push("/login")}>Sign In</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Customize the appearance of your Black Banner experience
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="preset-themes">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preset-themes">Preset Themes</TabsTrigger>
              <TabsTrigger value="custom-theme">Custom Theme</TabsTrigger>
            </TabsList>

            <TabsContent value="preset-themes" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {predefinedThemes.map((theme) => (
                  <Button
                    key={theme.id}
                    variant={selectedTheme === theme.id ? "default" : "outline"}
                    className="h-24 flex flex-col gap-2"
                    onClick={() => handleThemeChange(theme.id)}
                  >
                    <div
                      className={`w-full h-12 rounded-md ${
                        theme.id === "light"
                          ? "bg-white border"
                          : theme.id === "dark"
                          ? "bg-slate-900"
                          : theme.id === "tokyo-night"
                          ? "bg-[hsl(225,27%,15%)]"
                          : theme.id === "nord"
                          ? "bg-[hsl(220,16%,22%)]"
                          : theme.id === "dracula"
                          ? "bg-[hsl(231,15%,18%)]"
                          : theme.id === "solarized"
                          ? "bg-[hsl(194,14%,20%)]"
                          : theme.id === "custom"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900"
                      }`}
                    />
                    <span>{theme.name}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom-theme" className="pt-4">
              <div className="flex flex-col gap-4">
                <p>
                  Create your own custom theme by editing the CSS variables
                  directly.
                </p>

                <Button
                  onClick={() => setThemeEditorOpen(true)}
                  className="w-full md:w-auto"
                >
                  Open Theme Editor
                </Button>

                {author.custom_theme &&
                  Object.keys(author.custom_theme).length > 0 && (
                    <div className="mt-4 p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Current Custom Theme</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {Object.entries(author.custom_theme).map(
                          ([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: getColorValue(value),
                                }}
                              />
                              <span>
                                {getDisplayName(key)}: {value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/settings")}>
            Back to Settings
          </Button>
        </CardFooter>
      </Card>

      {author && (
        <ThemeEditor
          author={author}
          open={themeEditorOpen}
          onOpenChange={setThemeEditorOpen}
          onSave={handleSaveCustomTheme}
        />
      )}
    </div>
  );
}
