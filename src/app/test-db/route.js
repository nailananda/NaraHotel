
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET() {
  const auth = await requireRole("/test-db");
  if (auth.error) return auth.error;

  try {
    await prisma.$connect();

    const roomTypeCount = await prisma.roomType.count();

    return NextResponse.json({
      success: true,
      message: "Koneksi PostgreSQL berhasil!",
      jumlahTipeKamar: roomTypeCount,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Koneksi database gagal.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
