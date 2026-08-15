import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/site";
import type { Profile } from "@/lib/supabase/types";
import AboutView from "./AboutView";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Asif Bhuiyan Shawon — Ecommerce Executive in Dhaka working on digital growth, with a background in full-stack development and AI. Skills, background and experience.",
  path: "/hello/aboutme",
  ogType: "profile",
});

export default async function Page() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .maybeSingle<Profile>();

  return <AboutView profile={profile} />;
}
