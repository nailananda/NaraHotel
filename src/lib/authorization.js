import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

const ROLE_PERMISSIONS = {
  TAMU: [
    "account:read",
    "reservations:create",
    "reservations:own",
    "notifications:subscribe",
  ],
  RESEPSIONIS: [
    "account:read",
    "reservations:manage",
    "payments:manage",
    "rooms:read",
    "notifications:subscribe",
  ],
  HOUSEKEEPING: [
    "account:read",
    "rooms:read",
    "rooms:clean",
    "notifications:subscribe",
  ],
  ADMIN: ["*"],
};

function unauthorized(message, status) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

export async function requirePermission(permission) {
  const cookieStore = await cookies();
  const token = cookieStore.get("nara_session")?.value;

  if (!token) {
    return {
      error: unauthorized("Silakan login terlebih dahulu.", 401),
    };
  }

  const session = await verifySession(token);
  const userId = Number(session?.userId);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return {
      error: unauthorized("Sesi login tidak valid. Silakan login kembali.", 401),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    return {
      error: unauthorized("Akun tidak ditemukan. Silakan login kembali.", 401),
    };
  }

  const permissions = ROLE_PERMISSIONS[user.role] || [];

  if (!permissions.includes("*") && !permissions.includes(permission)) {
    return {
      error: unauthorized("Akses ditolak.", 403),
    };
  }

  return { user };
}
