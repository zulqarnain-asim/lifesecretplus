// Web Crypto only, so this module also runs in the edge middleware runtime.

export const ADMIN_COOKIE = "lsp_admin";
export const SESSION_MAX_AGE = 60 * 60 * 12;

const encoder = new TextEncoder();

export function isAdminConfigured() {
  return typeof process.env.ADMIN_PASSWORD === "string" && process.env.ADMIN_PASSWORD.length >= 8;
}

function toBase64Url(buffer) {
  let binary = "";
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sign(payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.ADMIN_PASSWORD),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

export function verifyPassword(input) {
  if (!isAdminConfigured()) return false;
  return safeEqual(String(input ?? ""), process.env.ADMIN_PASSWORD);
}

export async function createSessionToken() {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  return `${expiresAt}.${await sign(String(expiresAt))}`;
}

export async function verifySessionToken(token) {
  if (!isAdminConfigured() || typeof token !== "string") return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (!Number.isFinite(Number(expiresAt)) || Number(expiresAt) < Date.now()) return false;

  return safeEqual(signature, await sign(expiresAt));
}
