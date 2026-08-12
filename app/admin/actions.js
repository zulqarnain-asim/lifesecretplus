"use server";

import fs from "fs";
import path from "path";
import { cookies, headers } from "next/headers";
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
  deleteImage,
  getDbPostById,
  getDbPosts,
  getImportedSlugs,
  markImported,
  saveImage,
  setContactMessageStatus,
  updateDbPost,
} from "../../lib/db";
import { getFilePosts } from "../../lib/posts";

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

/** Id of an image stored in the database, or null for static paths and external URLs. */
function uploadedImageId(image) {
  const match = /^\/media\/(\d+)$/.exec(String(image || ""));
  return match ? match[1] : null;
}

async function discardUpload(image) {
  const id = uploadedImageId(image);
  if (id) await deleteImage(id).catch(() => {});
}

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
  const previous = id ? await getDbPostById(id) : null;
  let replaced = null;

  try {
    const uploaded = await storeUpload(formData.get("imageFile"));
    if (uploaded) image = uploaded;
  } catch (err) {
    return { error: err.message };
  }

  if (previous && previous.image !== image) replaced = previous.image;

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
    await discardUpload(image !== previous?.image ? image : null);
    if (err?.code === "23505") return { error: "That URL slug is already used by another post." };
    return { error: "Could not save the post. Please try again." };
  }

  await discardUpload(replaced);

  revalidateBlog(slug);
  revalidatePath("/admin/posts");
  redirect("/admin/posts?saved=1");
}

export async function removePost(formData) {
  await requireSession();
  const deleted = await deleteDbPost(formData.get("id"));
  await discardUpload(deleted?.image);
  revalidateBlog(deleted?.slug);
  revalidatePath("/admin/posts");
}

/** Copies the markdown articles bundled with the site into the database. */
export async function importBundledPosts() {
  await requireSession();

  const existing = new Set(await getImportedSlugs());
  const inDb = new Set((await getDbPosts({ status: "all" })).map((p) => p.slug));
  const bundled = getFilePosts().filter((p) => !existing.has(p.slug));
  if (bundled.length === 0) redirect("/admin/posts");

  for (const post of bundled) {
    if (inDb.has(post.slug)) {
      await markImported(post.slug);
      continue;
    }

    const image = post.image ? await importImage(post.image) : null;
    await createDbPost({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      image,
      author: post.author,
      tag: post.tag,
      content: post.content,
      status: "published",
      publishedAt: post.date,
    });
    await markImported(post.slug);
    revalidateBlog(post.slug);
  }

  revalidatePath("/admin/posts");
  redirect(`/admin/posts?imported=${bundled.length}`);
}

async function importImage(src) {
  if (!src.startsWith("/")) return src;

  const mime = src.endsWith(".png")
    ? "image/png"
    : src.endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";

  let buffer = null;
  const local = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  if (fs.existsSync(local)) {
    buffer = fs.readFileSync(local);
  } else {
    // public/ is not bundled into serverless functions, so read it back over HTTP.
    const head = await headers();
    const host = head.get("host");
    const proto = head.get("x-forwarded-proto") || "https";
    const res = await fetch(`${proto}://${host}${src}`).catch(() => null);
    if (!res?.ok) return src;
    buffer = Buffer.from(await res.arrayBuffer());
  }

  const saved = await saveImage({ filename: path.basename(src), mime, buffer });
  return saved ? `/media/${saved.id}` : src;
}
