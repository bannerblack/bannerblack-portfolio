"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ThemeTest() {
  const [showingVariables, setShowingVariables] = useState(false);
  const [cssVariables, setCssVariables] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [lastThemeChange, setLastThemeChange] = useState<string | null>(null);
  const [colorValues, setColorValues] = useState<Record<string, string>>({});
  const [currentTheme, setCurrentTheme] = useState<string>("system");

  // Update when component mounts and every 2 seconds to catch theme changes
  useEffect(() => {
    // Initial load with a slight delay to ensure CSS variables are applied
    setTimeout(() => {
      getCssVariables();
      getComputedColors();
      detectCurrentTheme();
      setIsLoading(false);
    }, 500);

    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 2000);

    // Listen for theme changes
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Theme changed event received:", customEvent.detail);
      setLastThemeChange(customEvent.detail?.authorId || "unknown");

      // Update current theme
      if (customEvent.detail?.theme) {
        setCurrentTheme(customEvent.detail.theme);
        if (
          customEvent.detail.theme === "custom" &&
          customEvent.detail.presetTheme
        ) {
          setCurrentTheme(customEvent.detail.presetTheme);
        }
      }

      forceRefresh();
    };

    document.addEventListener("themeChanged", handleThemeChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  // Get CSS variables whenever lastUpdate changes
  useEffect(() => {
    if (!isLoading) {
      getCssVariables();
      getComputedColors();
      detectCurrentTheme();
    }
  }, [lastUpdate, isLoading]);

  // Detect the current theme based on CSS classes or variables
  const detectCurrentTheme = () => {
    const root = document.documentElement;
    const classList = Array.from(root.classList);

    // Check for theme classes
    const themeClasses = [
      "light",
      "dark",
      "tokyo-night",
      "nord",
      "dracula",
      "solarized",
    ];
    for (const themeClass of themeClasses) {
      if (classList.includes(themeClass)) {
        setCurrentTheme(themeClass);
        return;
      }
    }

    // If no theme class found, check if it's system or custom
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setCurrentTheme("system (dark)");
    } else {
      setCurrentTheme("system (light)");
    }
  };

  // Get the actual computed colors from the DOM
  const getComputedColors = () => {
    if (typeof window === "undefined") return;

    const colorClasses = [
      "primary",
      "secondary",
      "accent",
      "muted",
      "card",
      "background",
    ];

    const newColorValues: Record<string, string> = {};

    // Create temporary elements to get computed styles
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    document.body.appendChild(tempDiv);

    colorClasses.forEach((colorClass) => {
      // For background color
      tempDiv.className = `bg-${colorClass}`;
      const bgStyle = window.getComputedStyle(tempDiv);
      const bgColor = bgStyle.backgroundColor;
      newColorValues[`bg-${colorClass}`] = bgColor;

      // For text color
      tempDiv.className = `text-${colorClass}-foreground`;
      const textStyle = window.getComputedStyle(tempDiv);
      const textColor = textStyle.color;
      newColorValues[`text-${colorClass}-foreground`] = textColor;
    });

    document.body.removeChild(tempDiv);
    setColorValues(newColorValues);
    return newColorValues;
  };

  const getCssVariables = () => {
    // Get all CSS variables from the document root
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    // Filter for relevant CSS variables
    const themeVars: string[] = [];

    // First check our expected theme variables
    const expectedVars = [
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--secondary-foreground",
      "--background",
      "--foreground",
      "--card",
      "--card-foreground",
      "--accent",
      "--accent-foreground",
      "--muted",
      "--muted-foreground",
      "--border",
      "--theme-name",
      "--test-variable",
    ];

    expectedVars.forEach((varName) => {
      const value = computedStyle.getPropertyValue(varName).trim();
      themeVars.push(`${varName}: ${value || "not set"}`);
    });

    // Then add any other CSS variables we find (excluding Tailwind utility vars)
    for (let i = 0; i < computedStyle.length; i++) {
      const prop = computedStyle[i];
      if (
        prop.startsWith("--") &&
        !prop.startsWith("--tw-") &&
        !expectedVars.includes(prop)
      ) {
        const value = computedStyle.getPropertyValue(prop).trim();
        if (value) {
          themeVars.push(`${prop}: ${value}`);
        }
      }
    }

    setCssVariables(themeVars);
    return themeVars;
  };

  const showThemeVariables = () => {
    setShowingVariables(true);
    const vars = getCssVariables();
    alert("Current CSS Variables:\n" + vars.join("\n"));
    setShowingVariables(false);
  };

  const setTestVariable = () => {
    // Manually apply a CSS variable to test if they're working
    const root = document.documentElement;
    const testValue = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    root.style.setProperty("--test-variable", testValue);
    alert(
      `Test variable set to ${testValue}. Check the debug panel to see if it appears.`
    );
    getCssVariables();
  };

  const forceRefresh = () => {
    // Force a refresh of CSS variables
    setIsLoading(true);
    setTimeout(() => {
      getCssVariables();
      getComputedColors();
      setIsLoading(false);
    }, 100);
  };

  // Helper function to convert RGB to Hex
  const rgbToHex = (rgb: string) => {
    // Handle rgb and rgba formats
    const rgbMatch = rgb.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
    );
    if (!rgbMatch) return rgb;

    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Theme preview cards
  const ThemePreviewCard = ({
    name,
    className,
    active,
  }: {
    name: string;
    className: string;
    active: boolean;
  }) => (
    <div
      className={`relative rounded-md overflow-hidden border-2 ${
        active ? "border-primary" : "border-border"
      }`}
    >
      <div className={`${className} h-16 w-full`}></div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
        {name}
        {active && <span className="ml-1 text-xs">✓</span>}
      </div>
    </div>
  );

  return (
    <div
      className="p-6 space-y-6"
      key={`theme-test-${lastThemeChange || "initial"}`}
    >
      <h2 className="text-2xl font-bold">Theme Test Component</h2>

      <div className="p-4 bg-card text-card-foreground rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-3">
          Current Theme: {currentTheme}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
          <ThemePreviewCard
            name="Light"
            className="bg-white"
            active={currentTheme === "light"}
          />
          <ThemePreviewCard
            name="Dark"
            className="bg-slate-900"
            active={currentTheme === "dark"}
          />
          <ThemePreviewCard
            name="Tokyo Night"
            className="bg-[hsl(225,27%,15%)]"
            active={currentTheme === "tokyo-night"}
          />
          <ThemePreviewCard
            name="Nord"
            className="bg-[hsl(220,16%,22%)]"
            active={currentTheme === "nord"}
          />
          <ThemePreviewCard
            name="Dracula"
            className="bg-[hsl(231,15%,18%)]"
            active={currentTheme === "dracula"}
          />
          <ThemePreviewCard
            name="Solarized"
            className="bg-[hsl(194,14%,20%)]"
            active={currentTheme === "solarized"}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Click the theme toggle in the top right corner to change themes.
        </p>
      </div>

      {lastThemeChange && (
        <div className="p-2 bg-accent text-accent-foreground rounded-md">
          Theme changed to author ID: {lastThemeChange}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary */}
        <div className="p-4 bg-primary text-primary-foreground rounded-md">
          <div>Primary Background with Primary Foreground</div>
          <div className="mt-2 text-xs font-mono">
            <div>
              BG:{" "}
              {colorValues["bg-primary"]
                ? rgbToHex(colorValues["bg-primary"])
                : "Loading..."}
            </div>
            <div>
              Text:{" "}
              {colorValues["text-primary-foreground"]
                ? rgbToHex(colorValues["text-primary-foreground"])
                : "Loading..."}
            </div>
            <div>
              CSS Var:{" "}
              {cssVariables
                .find((v) => v.startsWith("--primary:"))
                ?.split(": ")[1] || "not found"}
            </div>
          </div>
        </div>

        {/* Secondary */}
        <div className="p-4 bg-secondary text-secondary-foreground rounded-md">
          <div>Secondary Background with Secondary Foreground</div>
          <div className="mt-2 text-xs font-mono">
            <div>
              BG:{" "}
              {colorValues["bg-secondary"]
                ? rgbToHex(colorValues["bg-secondary"])
                : "Loading..."}
            </div>
            <div>
              Text:{" "}
              {colorValues["text-secondary-foreground"]
                ? rgbToHex(colorValues["text-secondary-foreground"])
                : "Loading..."}
            </div>
            <div>
              CSS Var:{" "}
              {cssVariables
                .find((v) => v.startsWith("--secondary:"))
                ?.split(": ")[1] || "not found"}
            </div>
          </div>
        </div>

        {/* Accent */}
        <div className="p-4 bg-accent text-accent-foreground rounded-md">
          <div>Accent Background with Accent Foreground</div>
          <div className="mt-2 text-xs font-mono">
            <div>
              BG:{" "}
              {colorValues["bg-accent"]
                ? rgbToHex(colorValues["bg-accent"])
                : "Loading..."}
            </div>
            <div>
              Text:{" "}
              {colorValues["text-accent-foreground"]
                ? rgbToHex(colorValues["text-accent-foreground"])
                : "Loading..."}
            </div>
            <div>
              CSS Var:{" "}
              {cssVariables
                .find((v) => v.startsWith("--accent:"))
                ?.split(": ")[1] || "not found"}
            </div>
          </div>
        </div>

        {/* Muted */}
        <div className="p-4 bg-muted text-muted-foreground rounded-md">
          <div>Muted Background with Muted Foreground</div>
          <div className="mt-2 text-xs font-mono">
            <div>
              BG:{" "}
              {colorValues["bg-muted"]
                ? rgbToHex(colorValues["bg-muted"])
                : "Loading..."}
            </div>
            <div>
              Text:{" "}
              {colorValues["text-muted-foreground"]
                ? rgbToHex(colorValues["text-muted-foreground"])
                : "Loading..."}
            </div>
            <div>
              CSS Var:{" "}
              {cssVariables
                .find((v) => v.startsWith("--muted:"))
                ?.split(": ")[1] || "not found"}
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="p-4 bg-card text-card-foreground rounded-md border">
          <div>Card Background with Card Foreground</div>
          <div className="mt-2 text-xs font-mono">
            <div>
              BG:{" "}
              {colorValues["bg-card"]
                ? rgbToHex(colorValues["bg-card"])
                : "Loading..."}
            </div>
            <div>
              Text:{" "}
              {colorValues["text-card-foreground"]
                ? rgbToHex(colorValues["text-card-foreground"])
                : "Loading..."}
            </div>
            <div>
              CSS Var:{" "}
              {cssVariables
                .find((v) => v.startsWith("--card:"))
                ?.split(": ")[1] || "not found"}
            </div>
          </div>
        </div>

        {/* Default */}
        <div className="p-4 bg-background text-foreground rounded-md border">
          <div>Default Background with Default Foreground</div>
          <div className="mt-2 text-xs font-mono">
            <div>
              BG:{" "}
              {colorValues["bg-background"]
                ? rgbToHex(colorValues["bg-background"])
                : "Loading..."}
            </div>
            <div>
              Text:{" "}
              {colorValues["text-background-foreground"]
                ? rgbToHex(colorValues["text-background-foreground"])
                : "Loading..."}
            </div>
            <div>
              CSS Var:{" "}
              {cssVariables
                .find((v) => v.startsWith("--background:"))
                ?.split(": ")[1] || "not found"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          onClick={showThemeVariables}
          disabled={showingVariables || isLoading}
        >
          {showingVariables ? "Loading..." : "Show Current Theme Variables"}
        </button>

        <button
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          onClick={setTestVariable}
          disabled={isLoading}
        >
          Set Test Variable
        </button>

        <button
          className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90"
          onClick={() => {
            document.body.classList.toggle("dark");
            document.documentElement.classList.toggle("dark");
            getCssVariables();
            getComputedColors();
            detectCurrentTheme();
          }}
          disabled={isLoading}
        >
          Toggle Dark Mode
        </button>

        <button
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
          onClick={forceRefresh}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh Variables"}
        </button>
      </div>

      <div className="mt-4 p-4 border rounded bg-muted">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p>
          If theme variables aren't showing, check the browser console for
          errors.
        </p>
        <p>
          Current theme variables should be applied to the document root
          element.
        </p>
        <p>The colored boxes above should reflect the current theme colors.</p>

        <div className="mt-4 p-2 bg-card text-card-foreground rounded max-h-60 overflow-auto">
          <h4 className="font-medium mb-2">Current CSS Variables:</h4>
          {isLoading ? (
            <div className="text-center p-4">Loading variables...</div>
          ) : (
            <pre className="text-xs whitespace-pre-wrap">
              {cssVariables.join("\n")}
            </pre>
          )}
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Body Classes:</h4>
          <pre className="text-xs bg-card p-2 rounded">
            {typeof document !== "undefined"
              ? document.body.className
              : "Not available on server"}
          </pre>
        </div>
      </div>
    </div>
  );
}
