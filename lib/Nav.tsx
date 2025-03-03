import React from "react";
import { Database } from "@/database.types";
import Link from "next/link";
import { AuthorSwitcher } from "../components/AuthorSwitcher";
type Author = Database["public"]["Tables"]["author"]["Row"];

const Nav = ({ primaryAuthor }: { primaryAuthor: Author }) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="site-title">
        <h1 className="text-2xl font-bold">BlackBanner</h1>
      </div>
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
