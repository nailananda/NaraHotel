import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";

export const ROLES = Object.freeze({
  TAMU: "TAMU",
  RESEPSIONIS: "RESEPSIONIS",
  HOUSEKEEPING: "HOUSEKEEPING",
  ADMIN: "ADMIN",
});

export const ROLE_ROUTE_ACCESS = Object.freeze({
  "/admin": [ROLES.ADMIN],
  "/resepsionis": [ROLES.RESEPSIONIS],
  "/housekeeping": [ROLES.HOUSEKEEPING],
  "/api/admin": [ROLES.ADMIN],
  "/api/resepsionis": [ROLES.RESEPSIONIS],
  "/api/housekeeping": [ROLES.HOUSEKEEPING],
  "/api/reservations": [ROLES.TAMU],
  "/api/me": [
    ROLES.TAMU,
    ROLES.RESEPSIONIS,
    ROLES.HOUSEKEEPING,
    ROLES.ADMIN,
  ],
  "/api/notifications/subscribe": [
    ROLES.TAMU,
    ROLES.RESEPSIONIS,
    ROLES.HOUSEKEEPING,
    ROLES.ADMIN,
  ],
  "/test-db": [ROLES.ADMIN],
});

function getRouteRoles(pathname) {
  const matchingPrefix = Object.keys(ROLE_ROUTE_ACCESS)
    .filter(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
    .sort((a, b) => b.length - a.length)[0];

  return matchingPrefix ? ROLE_ROUTE_ACCESS[matchingPrefix] : null;
}

export function hasRole(role, allowedRoles) {
  return role === ROLES.ADMIN || allowedRoles.includes(role);
}

export function canAccess(pathname, role) {
  const allowedRoles = getRouteRoles(pathname);
  return allowedRoles ? hasRole(role, allowedRoles) : false;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("nara_session")?.value;

  if (!token) {
    return null;
  }

  const session = await verifySession(token);
  const userId = Number(session?.userId);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return null;
  }

  const { default: prisma } = await import("@/lib/prisma");

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function requireRole(pathname) {
  const allowedRoles = getRouteRoles(pathname);

  if (!allowedRoles) {
    throw new Error(`Route belum terdaftar di ROLE_ROUTE_ACCESS: ${pathname}`);
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, message: "Silakan login terlebih dahulu." },
        { status: 401 }
      ),
    };
  }

  if (!hasRole(user.role, allowedRoles)) {
    return {
      error: NextResponse.json(
        { success: false, message: "Akses ditolak." },
        { status: 403 }
      ),
    };
  }

  return { user };
}
