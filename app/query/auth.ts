import { createClient } from "@/lib/utils/supabase/server";

// Get the user from auth
export async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  console.log("User ID Origin: ", user.id);
  return user.id;
}

// Get all info from user
export async function getUserInfo() {
  const supabase = await createClient();
  const userId = await getUserId();
  if (!userId) {
    return null;
  }
  console.log("User ID In User Info: ", userId);
  const { data, error } = await supabase
    .from("author")
    .select("*")
    .eq("user", userId);

  if (error) {
    console.error("Error: ", error);
    return null;
  }

  console.log("Data: ", data);
  return data;
}
