"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const formatRupiah = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));

const roomImages = {
  "Standard Room":
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=90",
  "Deluxe Room":
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=90",
  "Suite Room":
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=90",
};

function RoomDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const guests = searchParams.get("guests") || "1";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  useEffect(() => {
    let active = true;

    async function loadRoom() {
      try {
        const response = await fetch("/api/room-types", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal mengambil data kamar.");
        }

        const selected = result.data.find(
          (item) => String(item.id) === String(params.id)
        );

        if (!selected) {
          throw new Error("Tipe kamar tidak ditemukan.");
        }

        if (active) setRoom(selected);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRoom();

    return () => {
      active = false;
    };
  }, [params.id]);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/me", {
          credentials: "same-origin",
          cache: "no-store",
        });

        const result = await response.json();

        if (active && response.ok && result.success && result.data) {
          setUser(result.data);
        }
      } catch (err) {
        console.error("Gagal memeriksa sesi:", err);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  function handleBook() {
    if (!room) return;

    if (!user) {
      const nextUrl = `/reservasi?roomTypeId=${encodeURIComponent(
        room.id
      )}&guests=${encodeURIComponent(guests)}&checkIn=${encodeURIComponent(
        checkIn
      )}&checkOut=${encodeURIComponent(checkOut)}`;

      router.push(`/login?callbackUrl=${encodeURIComponent(nextUrl)}`);
      return;
    }

    const query = new URLSearchParams({
      roomTypeId: String(room.id),
      guests,
      checkIn,
      checkOut,
    });

    router.push(`/reservasi?${query.toString()}`);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7E9D8]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-[#D8B995] border-t-[#70492D]" />
          <p className="text-sm text-[#76563B]">Memuat detail kamar...</p>
        </div>
      </main>
    );
  }

  if (error || !room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7E9D8] px-5">
        <div className="max-w-md rounded-2xl bg-[#FFF9F0] p-8 text-center shadow-lg">
          <h1 className="font-serif text-2xl text-[#4B3020]">
            Kamar Tidak Ditemukan
          </h1>
          <p className="mt-3 text-sm text-[#80664D]">
            {error || "Data kamar tidak tersedia."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-[#70492D] px-6 py-3 text-sm font-semibold text-white"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const image =
    room.imageUrl || roomImages[room.name] || roomImages["Standard Room"];

  const facilities = Array.isArray(room.facilities)
    ? room.facilities
    : [];

  // API hanya mengembalikan unit kamar yang berstatus TERSEDIA.
  const availableCount = Array.isArray(room.rooms)
    ? room.rooms.length
    : 0;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8F2E9] text-[#493326]">
      {/* NAVIGASI ATAS */}
      <header className="border-b border-[#E9D9C8] bg-[#FFF9F1]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
          <Link href="/" className="group">
            <p className="font-serif text-2xl font-semibold tracking-[0.12em] text-[#68452B]">
              NARA HOTEL
            </p>
            <p className="mt-1 text-[9px] tracking-[0.25em] text-[#96775A]">
              STAY BETTER, FEEL AT HOME
            </p>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-[#B99776] px-5 py-2.5 text-xs font-semibold text-[#68452B] transition hover:bg-[#F0E1D0]"
          >
            ← Kembali
          </Link>
        </div>
      </header>

      {/* JUDUL HALAMAN */}
      <section className="mx-auto max-w-7xl px-5 pb-7 pt-10 md:px-10 md:pt-14">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-12 bg-[#B78A60]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C6949]">
            Pengalaman Menginap NARA HOTEL
          </p>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-serif text-4xl font-medium text-[#493326] md:text-5xl">
              {room.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#80664D]">
              Temukan kenyamanan dan suasana menginap yang menyenangkan
              melalui pilihan kamar NARA HOTEL.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#80664D]">
            <Link href="/" className="hover:text-[#A16E43]">
              Beranda
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#68452B]">
              Detail Kamar
            </span>
          </div>
        </div>
      </section>

      {/* FOTO UTAMA */}
      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="relative h-75 overflow-hidden rounded-2xl bg-[#E8D5C0] shadow-lg sm:h-105 md:h-135">
          <Image
            src={image}
            alt={`Foto ${room.name}`}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/5" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-4 text-white sm:bottom-9 sm:left-10 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F5D7B3]">
                NARA HOTEL ACCOMMODATION
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                {room.name}
              </h2>
            </div>

            <div className="w-fit rounded-full border border-white/50 bg-black/25 px-4 py-2 text-xs backdrop-blur-sm">
              Kapasitas {room.capacity} tamu
            </div>
          </div>
        </div>
      </section>

      {/* INFORMASI DAN PEMESANAN */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_360px] md:px-10 md:py-14">
        {/* INFORMASI KIRI */}
        <div>
          <div className="border-b border-[#E6D5C2] pb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#987858]">
              Tentang Akomodasi
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#493326]">
              Kenyamanan dalam Setiap Detail
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-8 text-[#765B43]">
              {room.description ||
                `Nikmati pengalaman menginap di ${room.name} dengan suasana nyaman dan pelayanan NARA HOTEL.`}
            </p>
          </div>

          {/* INFORMASI KAMAR */}
          <div className="border-b border-[#E6D5C2] py-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#987858]">
              Informasi Kamar
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[#FFF9F1] p-5">
                <span className="text-xl">♙</span>
                <p className="mt-3 text-xs text-[#987858]">Kapasitas</p>
                <p className="mt-1 font-semibold text-[#60452F]">
                  {room.capacity} Orang
                </p>
              </div>

              <div className="rounded-xl bg-[#FFF9F1] p-5">
                <span className="text-xl">▣</span>
                <p className="mt-3 text-xs text-[#987858]">Tipe Kamar</p>
                <p className="mt-1 font-semibold text-[#60452F]">
                  {room.name}
                </p>
              </div>

              <div className="rounded-xl bg-[#FFF9F1] p-5">
                <span className="text-xl">✓</span>
                <p className="mt-3 text-xs text-[#987858]">Ketersediaan</p>
                <p className="mt-1 font-semibold text-[#60452F]">
                  {availableCount} Unit
                </p>
              </div>
            </div>
          </div>

          {/* FASILITAS */}
          <div className="border-b border-[#E6D5C2] py-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#987858]">
              Fasilitas Akomodasi
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#493326]">
              Fasilitas Kamar
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#80664D]">
              Fasilitas yang tercantum berikut merupakan informasi
              fasilitas dari tipe kamar ini.
            </p>

            {facilities.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {facilities.map((facility, index) => (
                  <div
                    key={`${room.id}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-[#E8D8C6] bg-[#FFF9F1] p-4"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0E1D0] text-sm text-[#805735]">
                      ✓
                    </span>
                    <span className="text-sm font-medium text-[#60452F]">
                      {facility}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-[#FFF9F1] p-5 text-sm text-[#80664D]">
                Informasi fasilitas belum tersedia.
              </p>
            )}
          </div>

          {/* INFORMASI TAMBAHAN */}
          <div className="py-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#987858]">
              Pengalaman Menginap
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#493326]">
              Stay Better, Feel at Home
            </h2>

            <p className="mt-4 text-sm leading-8 text-[#765B43]">
              NARA HOTEL menghadirkan suasana hangat dan nyaman untuk
              menemani perjalanan Anda. Pilih kamar yang sesuai dengan
              kebutuhan dan nikmati pengalaman menginap bersama kami.
            </p>
          </div>
        </div>

        {/* KARTU PEMESANAN KANAN */}
        <aside>
          <div className="sticky top-6 rounded-2xl border border-[#E7D5C1] bg-[#FFF9F1] p-6 shadow-md">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#987858]">
              Harga Kamar
            </p>

            <div className="mt-3">
              <span className="font-serif text-3xl font-semibold text-[#70492D]">
                {formatRupiah(room.price)}
              </span>
              <span className="ml-1 text-xs text-[#8D7762]">
                / malam
              </span>
            </div>

            <div className="my-6 h-px bg-[#E8D8C6]" />

            <div className="space-y-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-[#8D7762]">Tipe Kamar</span>
                <span className="font-semibold text-[#60452F]">
                  {room.name}
                </span>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-[#8D7762]">Kapasitas</span>
                <span className="font-semibold text-[#60452F]">
                  {room.capacity} orang
                </span>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-[#8D7762]">Kamar tersedia</span>
                <span
                  className={`font-semibold ${
                    availableCount > 0
                      ? "text-[#557247]"
                      : "text-[#A34F37]"
                  }`}
                >
                  {availableCount} unit
                </span>
              </div>
            </div>

            <div className="my-6 h-px bg-[#E8D8C6]" />

            {checkIn && checkOut ? (
              <div className="mb-5 rounded-xl bg-[#F5EBDD] p-4 text-xs leading-6 text-[#684A31]">
                <p>
                  Check-in: <strong>{checkIn}</strong>
                </p>
                <p>
                  Check-out: <strong>{checkOut}</strong>
                </p>
                <p>
                  Jumlah tamu: <strong>{guests} orang</strong>
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleBook}
              disabled={availableCount === 0}
              className="w-full rounded-full bg-[#70492D] px-5 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#4B3020] disabled:cursor-not-allowed disabled:bg-[#B9A797]"
            >
              {availableCount === 0
                ? "Kamar Tidak Tersedia"
                : user
                  ? "Pesan Kamar Sekarang"
                  : "Masuk untuk Memesan"}
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-[#987858]">
              Pesan kamar pilihan Anda melalui sistem reservasi
              NARA HOTEL.
            </p>

            <Link
              href="/"
              className="mt-5 block text-center text-xs font-semibold text-[#805735] hover:underline"
            >
              ← Kembali ke pilihan kamar
            </Link>
          </div>
        </aside>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#493326] px-5 py-9 text-center text-[#F7E9D8]">
        <p className="font-serif text-xl tracking-[0.15em]">
          NARA HOTEL
        </p>
        <p className="mt-2 text-[10px] tracking-[0.2em] text-[#D7B997]">
          STAY BETTER, FEEL AT HOME
        </p>
        <p className="mt-5 text-xs text-[#E6D5C2]">
          © 2026 NARA HOTEL. Sistem Informasi Reservasi Hotel.
        </p>
      </footer>
    </main>
  );
}

export default function RoomDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7E9D8]" />}>
      <RoomDetailContent />
    </Suspense>
  );
}