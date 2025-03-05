import React from "react";
import { Database } from "@/database.types";
import Link from "next/link";
import { AuthorSwitcher } from "./AuthorSwitcher";
import AuthorContext from "./AuthorContext";
import { NavMenu } from "@/components/NavMenu";

type Author = Database["public"]["Tables"]["author"]["Row"];

const Nav = ({
  avatarUrl,
  primaryAuthor,
  username,
}: {
  avatarUrl: string;
  primaryAuthor: Author;
  username: string;
}) => {
  return (
    <div className="p-10 flex flex-row justify-center items-center gap-10">
      <h1 className="freight-title text-5xl font-bold">BlackBanner</h1>
      <NavMenu />
      <AuthorSwitcher />
      <AuthorContext avatarUrl={avatarUrl} username={username} />
    </div>
  );
};

export default Nav;
