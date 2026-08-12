import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminConfigured, verifySessionToken } from "./lib/auth";

export async function middleware(request) {
  if (!isAdminConfigured()) {
    return new NextResponse("Admin area is not configured.", { status: 503 });
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifySessionToken(token)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
