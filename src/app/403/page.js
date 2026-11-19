import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/rbac";

const DASHBOARD_BY_ROLE = {
  ADMIN: "/admin",
  RESEPSIONIS: "/resepsionis",
  HOUSEKEEPING: "/housekeeping",
};

async function ForbiddenContent() {
  const user = await getCurrentUser();
  const destination = DASHBOARD_BY_ROLE[user?.role] || "/";
  const buttonLabel =
    destination === "/" ? "Kembali ke beranda" : "Kembali ke dashboard";

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F0E8] px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#A77B5A]">
          NARA HOTEL
        </p>
        <h1 className="mt-4 text-3xl font-bold text-[#49372C]">
          Akses Ditolak
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Kamu tidak memiliki izin untuk membuka halaman ini.
        </p>
        <Link
          href={destination}
          className="mt-8 inline-flex rounded-lg bg-[#76543F] px-6 py-3 font-semibold text-white transition hover:bg-[#5C4030]"
        >
          {buttonLabel}
        </Link>
      </section>
    </main>
  );
}

export default function ForbiddenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F0E8]" />}>
      <ForbiddenContent />
    </Suspense>
  );
}
