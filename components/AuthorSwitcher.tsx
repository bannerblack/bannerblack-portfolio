"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { AppContext } from "../lib/Providers/AppProvider";
import { useContext } from "react";
import { setPrimaryAuthor } from "../lib/qactions/actions";

export const AuthorSwitcher = () => {
  const { primaryAuthor, authors } = useContext(AppContext);

  return (
    <div>
      <form
        onChange={async (e) => {
          const authorId = (e.target as HTMLSelectElement).value;
          if (authorId) {
            await setPrimaryAuthor(authorId as string);
          }
        }}
      >
        <Select name="authorId">
          <SelectTrigger>
            <SelectValue placeholder={primaryAuthor?.username} />
          </SelectTrigger>
          <SelectContent>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id.toString()}>
                {author.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
    </div>
  );
};
