"use client";

import React from "react";
import { useContext } from "react";
import { AppContext, ThemeContext } from "../lib/Providers/AppProvider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AuthorDisplay = ({
  avatarUrl,
  username,
}: {
  avatarUrl: string;
  username: string;
}) => {
  const { primaryAuthor, authors } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);

  if (!primaryAuthor) {
    return <div>No author selected</div>;
  }

  return (
    <div id="author-display" className="w-100">
      <div className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            {primaryAuthor.username?.charAt(0) || "A"}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{primaryAuthor.username || "Unnamed Author"}</CardTitle>
          <CardDescription>{primaryAuthor.theme}</CardDescription>
        </div>
      </div>
    </div>
  );
};

export default AuthorDisplay;
