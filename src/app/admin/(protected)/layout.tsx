import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminTopNav from "../AdminTopNav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: middleware already redirects unauthenticated / non-admin
  // requests to /admin/login before this ever renders.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }

  const email = user.email ?? "";

  return (
    <div className="admin-cursor-reset flex min-h-screen flex-col bg-zinc-950">
      <AdminTopNav email={email} />
      <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
