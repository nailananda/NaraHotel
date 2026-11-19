
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const loginType = body.loginType;

    if (!email || !password || !loginType) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, password, dan jenis login wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!["tamu", "pengelola"].includes(loginType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Jenis login tidak valid.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    // Pembatasan jenis akun berdasarkan halaman login
    const allowedRoles =
      loginType === "tamu"
        ? ["TAMU"]
        : ["ADMIN", "RESEPSIONIS", "HOUSEKEEPING"];

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message:
            loginType === "tamu"
              ? "Akun ini bukan akun reservasi tamu."
              : "Akun ini tidak memiliki akses pengelola hotel.",
        },
        { status: 403 }
      );
    }

    const token = await createSession(user);

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil!",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("nara_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat login.",
      },
      { status: 500 }
    );
  }
}
