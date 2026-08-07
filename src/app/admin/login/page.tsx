"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, Sparkles } from "lucide-react";
import { AdminButton, AdminCard, AdminInput, AdminLabel } from "../ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data.user?.app_metadata?.role !== "admin") {
      setError("This account does not have admin access.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="admin-cursor-reset flex min-h-screen items-center justify-center px-4">
      <AdminCard className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#76ABAE] to-[#1c3538] shadow-lg shadow-[#76ABAE]/20">
            <Sparkles size={22} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold gradient-text">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-400">Sign in to manage the site.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <AdminLabel htmlFor="email">Email</AdminLabel>
          <div className="relative mb-4">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <AdminInput
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10"
            />
          </div>

          <AdminLabel htmlFor="password">Password</AdminLabel>
          <div className="relative mb-6">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <AdminInput
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <AdminButton type="submit" disabled={loading} className="w-full justify-center">
            {loading ? "Signing in…" : "Sign In"}
          </AdminButton>
        </form>
      </AdminCard>
    </div>
  );
}
