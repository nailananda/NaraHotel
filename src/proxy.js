import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { canAccess } from "@/lib/rbac";

const PUBLIC_ROUTES = new Set([
  "/admin/login",
  "/login",
  "/register",
  "/403",
]);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const isProtectedRoute = [
    "/admin",
    "/resepsionis",
    "/housekeeping",
  ].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("nara_session")?.value;
  const session = token ? await verifySession(token) : null;

  if (!session?.role) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (!canAccess(pathname, session.role)) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/resepsionis/:path*",
    "/housekeeping/:path*",
    "/login",
    "/register",
    "/403",
  ],
};
