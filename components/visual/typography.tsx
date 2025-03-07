import React from "react";

interface TypoH1Props {
  children: React.ReactNode;
  className?: string;
}

export function TypoH1({ children, className }: TypoH1Props) {
  return (
    <h1
      className={`freight-title scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl font-alegreya
        ${className || ""}
      `}
    >
      {children}
    </h1>
  );
}
