import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface CommentPayload {
  postId?: string;
  authorName?: string;
  content?: string;
  token?: string;
}

export async function POST(request: Request) {
  const body: CommentPayload | null = await request.json().catch(() => null);
  const postId = body?.postId?.trim();
  const authorName = body?.authorName?.trim();
  const content = body?.content?.trim();
  const token = body?.token;

  if (!postId || !authorName || !content || !token) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (authorName.length > 80 || content.length > 2000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token }),
  });
  const verifyJson = await verifyRes.json();

  if (!verifyJson.success) {
    return NextResponse.json({ error: "Verification failed, please try again" }, { status: 403 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_name: authorName, content })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data });
}
