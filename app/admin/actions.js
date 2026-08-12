"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifyPassword,
  verifySessionToken,
} from "../../lib/auth";
import {
  createDbPost,
  deleteContactMessage,
  deleteDbPost,
  saveImage,
  setContactMessageStatus,
  updateDbPost,
} from "../../lib/db";

const attempts = new Map();
const ATTEMPT_WINDOW_MS = 5 * 60_000;
const MAX_ATTEMPTS = 6;

function tooManyAttempts(key) {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((t) => now - t < ATTEMPT_WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > MAX_ATTEMPTS;
}

async function requireSession() {
  const store = await cookies();
  const ok = await verifySessionToken(store.get(ADMIN_COOKIE)?.value);
  if (!ok) redirect("/admin/login");
}

export async function login(_prevState, formData) {
  const password = formData.get("password");

  if (tooManyAttempts("login")) {
    return { error: "Too many attempts. Please wait a few minutes." };
  }
  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function markMessage(formData) {
  await requireSession();
  const status = formData.get("status") === "new" ? "new" : "read";
  await setContactMessageStatus(formData.get("id"), status);
  revalidatePath("/admin");
}

export async function removeMessage(formData) {
  await requireSession();
  await deleteContactMessage(formData.get("id"));
  revalidatePath("/admin");
}

/* ---------- Blog posts ---------- */

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);
}

function revalidateBlog(slug) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

async function storeUpload(file) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) return null;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, WebP, GIF or AVIF image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("That image is larger than 4MB — please use a smaller file.");
  }

  const saved = await saveImage({
    filename: file.name || "upload",
    mime: file.type,
    buffer: Buffer.from(await file.arrayBuffer()),
  });
  return saved ? `/media/${saved.id}` : null;
}

export async function savePost(_prevState, formData) {
  await requireSession();

  const id = formData.get("id");
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const slug = slugify(formData.get("slug") || title);
  const publishedAt = String(formData.get("publishedAt") || "").trim();

  if (title.length < 3) return { error: "Give the post a title of at least 3 characters." };
  if (content.length < 20) return { error: "The post content is too short." };
  if (!slug) return { error: "Could not build a URL slug — please set one manually." };

  let image = String(formData.get("image") || "").trim() || null;
  try {
    const uploaded = await storeUpload(formData.get("imageFile"));
    if (uploaded) image = uploaded;
  } catch (err) {
    return { error: err.message };
  }

  const post = {
    slug,
    title,
    excerpt: String(formData.get("excerpt") || "").trim() || null,
    image,
    author: String(formData.get("author") || "").trim() || null,
    tag: String(formData.get("tag") || "").trim() || null,
    content,
    status: formData.get("status") === "draft" ? "draft" : "published",
    publishedAt: publishedAt || null,
  };

  try {
    if (id) {
      await updateDbPost(id, post);
    } else {
      await createDbPost(post);
    }
  } catch (err) {
    if (err?.code === "23505") return { error: "That URL slug is already used by another post." };
    return { error: "Could not save the post. Please try again." };
  }

  revalidateBlog(slug);
  revalidatePath("/admin/posts");
  redirect("/admin/posts?saved=1");
}

export async function removePost(formData) {
  await requireSession();
  const deleted = await deleteDbPost(formData.get("id"));
  revalidateBlog(deleted?.slug);
  revalidatePath("/admin/posts");
}
