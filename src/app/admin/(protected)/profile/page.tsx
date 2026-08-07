import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";
import ProfileAdminClient from "./ProfileAdminClient";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .maybeSingle<Profile>();

  return <ProfileAdminClient initialProfile={data} />;
}
