import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { CONTACT_EMAIL } from "@/lib/site";

/** Nodemailer needs the Node runtime — it will not run on the Edge runtime. */
export const runtime = "nodejs";
/** Never cached: this endpoint has side effects only. */
export const dynamic = "force-dynamic";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Mirrors the client-side limits so a crafted request can't bypass them. */
const LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  message: 5000,
} as const;

const INQUIRY_TYPES = [
  "Ecommerce",
  "Development",
  "AI Integration",
  "Freelance",
  "Collaboration",
  "Other",
] as const;

/** Pragmatic address shape check — the real proof is the reply landing. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  inquiryType?: unknown;
  token?: unknown;
  /** Honeypot — must arrive empty. */
  company?: unknown;
}

/**
 * In-memory sliding window. Enough to blunt a naive flood from one IP on a
 * single instance; it resets on cold start and is not shared across Vercel
 * regions, which is an accepted trade-off for a personal contact form. The
 * Turnstile check below is the real gate.
 */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);

  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return false;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Drops control characters (keeping tab and newline) so nothing resembling a
 * mail header can be smuggled through a field. Written as a scan rather than
 * a regex so the source file stays free of literal control bytes.
 */
function sanitize(value: string): string {
  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code === 9 || code === 10) {
      out += char;
      continue;
    }
    if (code < 32 || code === 127) continue;
    out += char;
  }
  return out;
}

/** Single-line fields must not contain newlines at all. */
function sanitizeLine(value: string): string {
  return sanitize(value).split("\n").join(" ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages from this address. Please try again a little later." },
      { status: 429 }
    );
  }

  const body: ContactPayload | null = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // ---------------------------------------------------------------- honeypot
  // A real visitor never fills this field; a bot that auto-completes every
  // input will. Answer 200 so the bot believes it succeeded.
  if (asString(body.company).length > 0) {
    return NextResponse.json({ ok: true });
  }

  // -------------------------------------------------------------- validation
  const name = sanitizeLine(asString(body.name));
  const email = sanitizeLine(asString(body.email));
  const subject = sanitizeLine(asString(body.subject));
  const message = sanitize(asString(body.message));
  const inquiryRaw = asString(body.inquiryType);
  const inquiryType = (INQUIRY_TYPES as readonly string[]).includes(inquiryRaw)
    ? inquiryRaw
    : "";

  const errors: Record<string, string> = {};

  if (!name) errors.name = "Please tell me your name.";
  else if (name.length > LIMITS.name)
    errors.name = `Please keep this under ${LIMITS.name} characters.`;

  if (!email) errors.email = "Please add an email address so I can reply.";
  else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email))
    errors.email = "That email address doesn't look right.";

  if (!subject) errors.subject = "Please add a subject.";
  else if (subject.length > LIMITS.subject)
    errors.subject = `Please keep this under ${LIMITS.subject} characters.`;

  if (!message) errors.message = "Please write a message.";
  else if (message.length > LIMITS.message)
    errors.message = `Please keep this under ${LIMITS.message} characters.`;

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors: errors },
      { status: 400 }
    );
  }

  // --------------------------------------------------------------- turnstile
  // Reuses the Cloudflare Turnstile setup the blog comments already run on —
  // no second CAPTCHA vendor. Skipped when the keys aren't configured, so
  // local development works without them.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    const token = asString(body.token);
    if (!token) {
      return NextResponse.json(
        { error: "Please complete the verification challenge." },
        { status: 400 }
      );
    }

    const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: turnstileSecret, response: token, remoteip: ip }),
    }).catch(() => null);

    const verifyJson = await verifyRes?.json().catch(() => null);
    if (!verifyJson?.success) {
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 403 }
      );
    }
  }

  // ------------------------------------------------------------------- email
  const user = process.env.CONTACT_EMAIL_USER;
  const pass = process.env.CONTACT_EMAIL_APP_PASSWORD;

  if (!user || !pass) {
    // Log for the operator; tell the visitor something honest and useful.
    console.error("[contact] CONTACT_EMAIL_USER / CONTACT_EMAIL_APP_PASSWORD are not set");
    return NextResponse.json(
      {
        error: `The message service is temporarily unavailable. Please email me directly at ${CONTACT_EMAIL}.`,
      },
      { status: 503 }
    );
  }

  const to = process.env.CONTACT_EMAIL_TO?.trim() || CONTACT_EMAIL;
  const sentAt = new Date().toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  });

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Subject", subject],
    ...(inquiryType ? ([["Inquiry type", inquiryType]] as [string, string][]) : []),
    ["Received", `${sentAt} (Asia/Dhaka)`],
  ];

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;color:#0d1b1f;line-height:1.6">
      <h2 style="margin:0 0 16px;font-size:18px">New message from your portfolio</h2>
      <table style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#5b6b6e;vertical-align:top">${label}</td><td style="padding:4px 0"><strong>${escapeHtml(
                value
              )}</strong></td></tr>`
          )
          .join("")}
      </table>
      <p style="margin:20px 0 6px;color:#5b6b6e;font-size:14px">Message</p>
      <div style="padding:14px 16px;border:1px solid #dfe7e6;border-radius:10px;background:#f7fbfa;font-size:14px;white-space:pre-wrap">${escapeHtml(
        message
      )}</div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      // Gmail SMTP rewrites `from` to the authenticated account anyway, so the
      // visitor's address goes in `replyTo` — hitting Reply answers them.
      from: `"Portfolio Contact" <${user}>`,
      to,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `[Portfolio] ${subject}`,
      text,
      html,
    });
  } catch (error) {
    // Never leak SMTP internals to the browser.
    console.error("[contact] send failed:", error);
    return NextResponse.json(
      {
        error: `Something went wrong sending your message. Please try again, or email me directly at ${CONTACT_EMAIL}.`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
