import React from "react";
import { createClient } from "@/lib/utils/supabase/server";
import Link from "next/link";
import { Database } from "@/database.types";

const Stories = async () => {
  const supabase = await createClient();
  const { data: stories, error } = await supabase.from("story").select("*");

  if (error) {
    console.error(error);
  }

  return (
    <div>
      {stories?.map((story: Database["public"]["Tables"]["story"]["Row"]) => (
        <div key={story.id}>
          <h2>{story.title}</h2>
          <p>{story.author}</p>
          <Link href={`/story/${story.id}`}>View Story</Link>
        </div>
      ))}
    </div>
  );
};

export default Stories;
