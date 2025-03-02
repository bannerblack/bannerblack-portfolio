/**
 * Theme utility functions for managing CSS variables and theme settings
 */

// Define the theme variable types with CSS variable names including "--" prefix
export interface ThemeVariables {
  [key: string]: string | undefined;
}

/**
 * Apply a theme to the document by setting CSS variables
 * @param theme The theme variables to apply
 */
export function applyTheme(theme: ThemeVariables): void {
  if (!theme) return;

  Object.entries(theme).forEach(([variable, value]) => {
    if (value) {
      document.documentElement.style.setProperty(variable, value);
    }
  });
}

/**
 * Reset all theme variables to their default values
 * @param variables List of CSS variable names to reset
 */
export function resetTheme(variables: string[]): void {
  variables.forEach((variable) => {
    document.documentElement.style.removeProperty(variable);
  });
}

/**
 * Get the current theme variables from the document
 * @param variables List of CSS variable names to get
 * @returns Object with CSS variable names and their values
 */
export function getCurrentTheme(variables: string[]): ThemeVariables {
  const theme: ThemeVariables = {};
  const computedStyle = getComputedStyle(document.documentElement);

  variables.forEach((variable) => {
    const value = computedStyle.getPropertyValue(variable).trim();
    if (value) {
      theme[variable] = value;
    }
  });

  return theme;
}

/**
 * Convert HSL color format to HEX
 * @param hsl HSL color string (e.g., "hsl(220, 16%, 22%)")
 * @returns HEX color string (e.g., "#2a3441")
 */
export function hslToHex(hsl: string): string {
  try {
    // Parse HSL value
    const match = hsl.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
    if (!match) return "#000000";

    const h = parseInt(match[1], 10) / 360;
    const s = parseInt(match[2], 10) / 100;
    const l = parseInt(match[3], 10) / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch (error) {
    console.error("Error converting HSL to HEX:", error);
    return "#000000";
  }
}

/**
 * Convert HEX color format to HSL
 * @param hex HEX color string (e.g., "#2a3441")
 * @returns HSL color string (e.g., "hsl(220, 16%, 22%)")
 */
export function hexToHsl(hex: string): string {
  try {
    // Convert hex to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "hsl(0, 0%, 0%)";

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    // Convert to HSL format with commas for compatibility
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    const lightness = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${lightness}%)`;
  } catch (error) {
    console.error("Error converting HEX to HSL:", error);
    return "hsl(0, 0%, 0%)";
  }
}

/**
 * Get all theme variables used in the application
 * @returns Array of CSS variable names
 */
export function getAllThemeVariables(): string[] {
  return [
    "--background",
    "--foreground",
    "--card",
    "--card-foreground",
    "--popover",
    "--popover-foreground",
    "--primary",
    "--primary-foreground",
    "--secondary",
    "--secondary-foreground",
    "--muted",
    "--muted-foreground",
    "--accent",
    "--accent-foreground",
    "--destructive",
    "--destructive-foreground",
    "--border",
    "--input",
    "--ring",
  ];
}

/**
 * Group theme variables for better organization
 */
export const themeGroups = {
  base: ["--background", "--foreground", "--border", "--input", "--ring"],
  components: [
    "--primary",
    "--primary-foreground",
    "--secondary",
    "--secondary-foreground",
    "--accent",
    "--accent-foreground",
    "--muted",
    "--muted-foreground",
    "--destructive",
    "--destructive-foreground",
  ],
  elements: [
    "--card",
    "--card-foreground",
    "--popover",
    "--popover-foreground",
  ],
};
