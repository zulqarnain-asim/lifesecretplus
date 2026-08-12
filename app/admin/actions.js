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
import { deleteContactMessage, setContactMessageStatus } from "../../lib/db";

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
