import EnhancedHome from "./components/EnhancedHome";
import CursorFollower from "./components/CursorFollower";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export default async function Page() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .limit(1)
    .maybeSingle<Pick<Profile, "full_name">>();

  return (
    <>
      <CursorFollower />
      <div className="flex items-center justify-center h-screen relative">
        <EnhancedHome fullName={profile?.full_name} />
      </div>
    </>
  );
}
