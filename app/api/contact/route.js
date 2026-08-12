import { NextResponse } from "next/server";
import { isDatabaseConfigured, saveContactMessage } from "../../../lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const rateLimit = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const hits = (rateLimit.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  rateLimit.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const userAgent = request.headers.get("user-agent") || "";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  // Honeypot: only bots fill this field.
  if (String(body.website || "").trim()) {
    return NextResponse.json({ message: "Thanks for your message!" });
  }

  if (!name || name.length > 100) {
    return NextResponse.json(
      { error: "Please enter your name." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { error: "Please write a message between 10 and 5000 characters." },
      { status: 400 }
    );
  }
  if (subject.length > 150) {
    return NextResponse.json({ error: "Subject is too long." }, { status: 400 });
  }

  const submission = { name, email, subject, message, ip, userAgent };

  let stored = false;
  if (isDatabaseConfigured) {
    try {
      stored = Boolean(await saveContactMessage(submission));
    } catch (err) {
      console.error("Failed to store contact message:", err);
    }
  }

  // Optional email notification on top of storage.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  let emailed = false;

  if (apiKey && to) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev",
          to: [to],
          reply_to: email,
          subject: subject
            ? `[Life Secret Plus] ${subject}`
            : `[Life Secret Plus] New message from ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      emailed = true;
    } catch (err) {
      console.error("Failed to send contact email:", err);
    }
  }

  if (!stored && !emailed) {
    if (isDatabaseConfigured || (apiKey && to)) {
      return NextResponse.json(
        { error: "We couldn't save your message. Please email us directly." },
        { status: 502 }
      );
    }
    console.log("Contact submission (no storage configured):", submission);
  }

  return NextResponse.json({
    message: "Thanks! Your message has been sent — we'll reply soon.",
  });
}
