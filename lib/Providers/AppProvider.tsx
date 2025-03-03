"use client";

import { Database } from "@/database.types";
import { createContext, useState } from "react";

// Primary author uses type author
type Author = Database["public"]["Tables"]["author"]["Row"];

// Authors uses type author[]
type Authors = Database["public"]["Tables"]["author"]["Row"][];

// Theme uses type theme
type Theme = {
  id: string;
};

const defaultTheme: Theme = {
  id: "light",
};

// Create the context
export const AppContext = createContext<{
  primaryAuthor: Author | null;
  authors: Authors;
  initialTheme: Theme;
}>({
  primaryAuthor: null,
  authors: [],
  initialTheme: defaultTheme,
});

export const ThemeContext = createContext<{
  theme: Theme;
}>({
  theme: defaultTheme,
});

export default function AppProvider({
  children,
  primaryAuthor,
  authors,
  initialTheme,
}: {
  children: React.ReactNode;
  primaryAuthor: Author | null;
  authors: Authors;
  initialTheme: Theme;
}) {
  return (
    <AppContext.Provider value={{ primaryAuthor, authors, initialTheme }}>
      {/* Commenting out ThemeContext.Provider for now
      <ThemeContext.Provider value={{ theme: initialTheme }}>
        
      */}

      <html
        lang="en"
        className={`antialiased ${initialTheme.id}`}
        suppressHydrationWarning
        data-initial-theme="system"
      >
        <body>
          {/* Debug info */}
          {/* <div>
            Available Authors:
            {authors.map((author) => (
              <div key={author.id}>
                {author.id} {author.username}
              </div>
            ))}
          </div>
          <div>
            Primary Author: {primaryAuthor?.id} {primaryAuthor?.theme}
            {primaryAuthor?.username}
          </div>
          <div>Derived theme: {initialTheme.id}</div> */}
          {children}

          {/* Commenting out closing tags for ThemeContext.Provider */}
        </body>
      </html>
      {/* </ThemeContext.Provider> */}
    </AppContext.Provider>
  );
}
