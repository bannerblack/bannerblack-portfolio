"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  ThemeVariables,
  themeGroups,
  hslToHex,
  hexToHsl,
  applyTheme,
  resetTheme,
  getCurrentTheme,
  getAllThemeVariables,
} from "@/lib/utils/theme-utils";
import { updateAuthorCustomTheme } from "@/app/actions/theme-actions";
import { useRouter } from "next/navigation";

interface Author {
  id: string;
  username?: string;
  theme?: string;
  custom_theme?: ThemeVariables;
  [key: string]: any;
}

interface ThemeEditorProps {
  author: Author;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (theme: ThemeVariables) => void;
}

export default function ThemeEditor({
  author,
  open,
  onOpenChange,
  onSave,
}: ThemeEditorProps) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const { applyAuthorTheme } = useAppContext();
  const [theme, setTheme] = useState<ThemeVariables>(author.custom_theme || {});
  const [activeTab, setActiveTab] = useState("base");
  const [previewMode, setPreviewMode] = useState(false);

  // Load current theme values when the dialog opens
  useEffect(() => {
    if (open) {
      // Start with author's custom theme if it exists
      const initialTheme: ThemeVariables = { ...(author.custom_theme || {}) };

      // If no custom theme or missing values, get current CSS variables from the document
      if (!initialTheme || Object.keys(initialTheme).length === 0) {
        const allVariables = getAllThemeVariables();
        const currentTheme = getCurrentTheme(allVariables);
        Object.assign(initialTheme, currentTheme);
      }

      setTheme(initialTheme);
    }
  }, [open, author.custom_theme]);

  // Handle input changes
  const handleChange = (variable: string, value: string) => {
    setTheme((prev) => ({
      ...prev,
      [variable]: value,
    }));

    // If preview mode is on, apply the change immediately
    if (previewMode) {
      document.documentElement.style.setProperty(variable, value);
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);

    if (newPreviewMode) {
      // Apply all current theme values
      applyTheme(theme);
    } else {
      // Reset to original values
      resetTheme(Object.keys(theme));
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      // Start loading with a message
      startLoading("Saving custom theme...");

      // Call the onSave callback for backward compatibility
      onSave(theme);

      // Use the server action to update the theme
      const result = await updateAuthorCustomTheme(author.id, theme);

      if (!result.success) {
        console.error("Error saving custom theme:", result.error);
        toast.error("Failed to save theme");
        stopLoading();
        return;
      }

      // Close the dialog
      onOpenChange(false);

      // Reset preview mode
      if (previewMode) {
        setPreviewMode(false);
        resetTheme(Object.keys(theme));
      }

      // Apply the theme immediately for visual feedback
      if (typeof applyAuthorTheme === "function") {
        // Create a temporary author object with the updated theme
        const tempAuthor = {
          ...author,
          theme: "custom",
          custom_theme: theme,
        };
        applyAuthorTheme(tempAuthor);
      }

      toast.success("Theme saved successfully");

      // Use Next.js router to refresh the page without a hard reload
      router.refresh();

      // Stop loading after a short delay
      setTimeout(() => {
        stopLoading();
      }, 300);
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Failed to save theme");
      stopLoading();
    }
  };

  // Render a color input with label
  const renderColorInput = (variable: string) => {
    const value = theme[variable] || "";

    return (
      <div key={variable} className="grid gap-2">
        <Label htmlFor={`theme-${variable}`} className="text-sm font-medium">
          {variable.replace(/--/g, "")}
        </Label>
        <div className="flex gap-2">
          <Input
            id={`theme-${variable}`}
            type="text"
            value={value}
            onChange={(e) => handleChange(variable, e.target.value)}
            placeholder={`e.g., hsl(220, 16%, 22%)`}
            className="flex-1"
          />
          <Input
            type="color"
            value={value.startsWith("hsl") ? hslToHex(value) : value}
            onChange={(e) => {
              // Convert hex to HSL for consistency
              const hslValue = hexToHsl(e.target.value);
              handleChange(variable, hslValue);
            }}
            className="w-12 p-1 h-10"
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Theme Editor</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={togglePreview}
          >
            {previewMode ? "Preview On" : "Preview Off"}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="base">Base</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="elements">Elements</TabsTrigger>
          </TabsList>

          <TabsContent value="base" className="space-y-4">
            {themeGroups.base.map((variable) => renderColorInput(variable))}
          </TabsContent>

          <TabsContent value="components" className="space-y-4">
            {themeGroups.components.map((variable) =>
              renderColorInput(variable)
            )}
          </TabsContent>

          <TabsContent value="elements" className="space-y-4">
            {themeGroups.elements.map((variable) => renderColorInput(variable))}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Theme</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
