import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/supabase/types";
import ServicesAdminClient from "./ServicesAdminClient";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<Service[]>();

  return (
    <Suspense>
      <ServicesAdminClient initialServices={data ?? []} />
    </Suspense>
  );
}
