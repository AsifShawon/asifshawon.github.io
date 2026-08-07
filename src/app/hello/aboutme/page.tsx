import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";
import AboutMeClient from "./AboutMeClient";

export default async function Page() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .maybeSingle<Profile>();

  return <AboutMeClient profile={profile} />;
}
