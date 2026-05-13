import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Database } from "./types";

type InternHubSupabaseClient = SupabaseClient<Database>;

export function getProfileFields(user: User) {
  const metadata = user.user_metadata;

  return {
    id: user.id,
    display_name:
      getString(metadata.full_name) ??
      getString(metadata.name) ??
      user.email?.split("@")[0] ??
      "New intern",
    avatar_url:
      getString(metadata.avatar_url) ?? getString(metadata.picture) ?? null,
  } satisfies Database["public"]["Tables"]["profiles"]["Insert"];
}

export async function upsertProfile(
  supabase: InternHubSupabaseClient,
  user: User,
) {
  return supabase.from("profiles").upsert(getProfileFields(user), {
    onConflict: "id",
  });
}

function getString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}
