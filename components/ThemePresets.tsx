export interface CustomTheme {
  primary?: string;
  secondary?: string;
  background?: string;
  text?: string;
  accent?: string;
  muted?: string;
  card?: string;
  border?: string;
  [key: string]: string | undefined;
}

export interface ThemePreset {
  name: string;
  description: string;
  theme: Partial<CustomTheme>;
}

export const themePresets: ThemePreset[] = [
  {
    name: "Tokyo Night",
    description:
      "A dark theme inspired by Tokyo Night with deep blues and vibrant accents",
    theme: {
      // Deep blue-purple background
      background: "hsl(225 27% 15%)",
      // Light gray text with a hint of blue
      text: "hsl(220 14% 85%)",
      // Vibrant purple-blue primary
      primary: "hsl(250 95% 76%)",
      // Soft teal secondary
      secondary: "hsl(180 70% 48%)",
      // Bright pink accent
      accent: "hsl(330 100% 65%)",
      // Subtle dark blue-gray for muted elements
      muted: "hsl(235 25% 25%)",
      // Slightly lighter than background for cards
      card: "hsl(225 27% 18%)",
      // Subtle border color
      border: "hsl(235 25% 30%)",
    },
  },
  {
    name: "Light Mode",
    description: "A clean light theme with good contrast",
    theme: {
      background: "hsl(0 0% 100%)",
      text: "hsl(222 47% 11%)",
      primary: "hsl(222 47% 11%)",
      secondary: "hsl(210 40% 96%)",
      accent: "hsl(262 83% 58%)",
      muted: "hsl(210 40% 96%)",
      card: "hsl(0 0% 100%)",
      border: "hsl(214 32% 91%)",
    },
  },
];

export function getThemePreset(name: string): ThemePreset | undefined {
  return themePresets.find(
    (preset) => preset.name.toLowerCase() === name.toLowerCase()
  );
}
