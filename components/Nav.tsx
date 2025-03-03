import React from "react";
import { Database } from "@/database.types";
import Link from "next/link";
import { AuthorSwitcher } from "./AuthorSwitcher";
import AuthorContext from "./AuthorContext";
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
    <div className="flex flex-row justify-between items-center">
      <h1 className="text-2xl font-bold">BlackBanner</h1>
      <AuthorContext avatarUrl={avatarUrl} username={username} />
      <AuthorSwitcher />
      <div>
        <button>
          <Link href="/everything/settings">Settings</Link>
        </button>
      </div>
    </div>
  );
};

export default Nav;
