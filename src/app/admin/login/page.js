
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email atau password salah.");
        return;
      }

      if (data.user?.role === "ADMIN") {
        window.location.href = "/admin";
      } else if (data.user?.role === "RESEPSIONIS") {
        window.location.href = "/resepsionis";
      } else if (data.user?.role === "HOUSEKEEPING") {
        window.location.href = "/housekeeping";
      } else {
        setError("Akun ini tidak memiliki akses staf.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F0E8] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-[0.2em] text-[#49372C]">
            NARA HOTEL
          </h1>
          <p className="mt-2 text-sm text-[#9A806D]">
            Staff & Administrator
          </p>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#A77B5A]" />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#49372C]">
            Login Admin
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Masuk menggunakan akun administrator atau staf hotel.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#49372C]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
              className="w-full rounded-lg border border-[#DED2C5] px-4 py-3 text-sm outline-none transition focus:border-[#A77B5A] focus:ring-2 focus:ring-[#A77B5A]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#49372C]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full rounded-lg border border-[#DED2C5] px-4 py-3 text-sm outline-none transition focus:border-[#A77B5A] focus:ring-2 focus:ring-[#A77B5A]/20"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#76543F] py-3 font-semibold text-white transition hover:bg-[#5C4030] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* INFORMASI AKUN DEMO */}
        <div className="mt-5 rounded-xl border border-[#E5D1BA] bg-[#FBF5ED] p-4">
          <h3 className="text-sm font-bold text-[#49372C]">
            Informasi Akun Demo
          </h3>

          <p className="mt-2 text-xs text-[#80664D]">
            Gunakan akun berikut untuk mencoba sistem NARA HOTEL.
          </p>

          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs text-[#9A806D]">Email</p>
              <p className="text-sm font-semibold text-[#49372C]">
                haloalfa172@gmail.com
              </p>
            </div>

            <div>
              <p className="text-xs text-[#9A806D]">Password</p>
              <p className="text-sm font-semibold text-[#49372C]">
                11111111
              </p>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-[#9A806D]">
            Akun demo untuk keperluan pengujian dan penilaian.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-sm text-[#8B6B55] transition hover:text-[#49372C]"
          >
            Login sebagai tamu
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          © 2026 NARA HOTEL. All rights reserved.
        </p>
      </div>
    </main>
  );
}
