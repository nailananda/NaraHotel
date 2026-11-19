
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import NotificationButton from "@/components/NotificationButton";

const roomImages = {
  "Standard Room":
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85",
  "Deluxe Room":
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85",
  "Suite Room":
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85",
};

const hotelFacilities = [
  "Kamar Nyaman",
  "Restoran",
  "Kolam Renang",
  "WiFi Gratis",
  "Spa & Wellness",
];

const heroSlides = [
  {
    src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=90",
    alt: "Kamar NARA HOTEL",
  },
  {
    src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2200&q=90",
    alt: "Kamar Deluxe NARA HOTEL",
  },
  {
    src: "https://images.unsplash.com/photo-1770306924605-4ba7075abe7a?auto=format&fit=crop&w=2200&q=85",
    alt: "Kolam renang NARA HOTEL",
  },
  {
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85",
    alt: "Suasana interior NARA HOTEL",
  },
];

function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
}

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Home() {
  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomError, setRoomError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [today, setToday] = useState("");

  const [activeSlide, setActiveSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const touchStartX = useRef(null);

  // ANIMASI SCROLL REVEAL
  // Mengamati elemen yang sudah ada dan elemen yang muncul belakangan.
  useEffect(() => {
    let intersectionObserver = null;

    // Membuat observer untuk animasi saat elemen terlihat.
    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              intersectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: "0px 0px -30px 0px",
        }
      );
    }

    // Mengamati elemen yang memiliki atribut data-reveal.
    function observeElements(root) {
      if (
        root instanceof Element &&
        root.matches("[data-reveal]")
      ) {
        if (intersectionObserver) {
          intersectionObserver.observe(root);
        } else {
          root.classList.add("is-visible");
        }
      }

      if (root.querySelectorAll) {
        root.querySelectorAll("[data-reveal]").forEach((element) => {
          if (intersectionObserver) {
            intersectionObserver.observe(element);
          } else {
            element.classList.add("is-visible");
          }
        });
      }
    }

    // Mengamati elemen yang sudah tersedia saat halaman dimuat.
    observeElements(document);

    // Mendeteksi elemen baru, termasuk kartu kamar dari database.
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            observeElements(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      intersectionObserver?.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // CAROUSEL OTOMATIS
  useEffect(() => {
    if (heroPaused) return;

    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroPaused]);

  function goToSlide(index) {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
  }

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;

    const diff = touchStartX.current - event.changedTouches[0].clientX;
    touchStartX.current = null;

    if (Math.abs(diff) < 50) return;

    goToSlide(diff > 0 ? activeSlide + 1 : activeSlide - 1);
  }

  // MENGAMBIL TANGGAL SAAT HALAMAN DIMUAT
  useEffect(() => {
    let active = true;

    async function loadToday() {
      await Promise.resolve();

      if (active) {
        setToday(getToday());
      }
    }

    loadToday();

    return () => {
      active = false;
    };
  }, []);

  // MENGAMBIL DATA TIPE KAMAR DARI DATABASE
  useEffect(() => {
    let active = true;

    async function fetchRooms() {
      try {
        const response = await fetch("/api/room-types", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error(
            result.message || "Gagal mengambil data kamar dari server."
          );
        }

        if (active) {
          setRooms(result.data);
        }
      } catch (error) {
        if (active) {
          setRoomError(error.message || "Gagal mengambil data kamar.");
        }
      } finally {
        if (active) {
          setLoadingRooms(false);
        }
      }
    }

    fetchRooms();

    return () => {
      active = false;
    };
  }, []);

  // MEMERIKSA SESI LOGIN
  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 5000);

    async function fetchUser() {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });

        const result = await response.json();

        if (active) {
          if (response.ok && result.success && result.data) {
            setUser(result.data);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        if (active) {
          console.error("Gagal memeriksa sesi login:", error);
          setUser(null);
        }
      } finally {
        clearTimeout(timeout);

        if (active) {
          setLoadingUser(false);
        }
      }
    }

    fetchUser();

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  // MENUTUP DETAIL DENGAN TOMBOL ESCAPE
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setSelectedRoom(null);
      }
    }

    if (selectedRoom) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedRoom]);

  // LOGOUT
  async function handleLogout() {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin keluar dari akun?"
    );

    if (!confirmed) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        window.alert(result.message || "Gagal keluar dari akun.");
        return;
      }

      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      window.alert("Terjadi kesalahan saat keluar. Silakan coba lagi.");
    } finally {
      setLoggingOut(false);
    }
  }

  // VALIDASI PENCARIAN KAMAR
  function handleSearch(event) {
    event.preventDefault();

    if (!checkIn || !checkOut) {
      window.alert("Silakan pilih tanggal check-in dan check-out.");
      return;
    }

    if (checkIn < today) {
      window.alert("Tanggal check-in tidak boleh sebelum hari ini.");
      return;
    }

    if (checkOut <= checkIn) {
      window.alert("Tanggal check-out harus setelah tanggal check-in.");
      return;
    }

    document.getElementById("kamar")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  // MEMBUAT URL RESERVASI
  function getReservationUrl(roomTypeId) {
    const params = new URLSearchParams({
      roomTypeId: String(roomTypeId),
      guests,
      checkIn,
      checkOut,
    });

    return `/reservasi?${params.toString()}`;
  }

  // TOMBOL PESAN KAMAR
  function handleBook(roomTypeId) {
    if (!user) {
      router.push("/login");
      return;
    }

    router.push(getReservationUrl(roomTypeId));
  }

  // MEMBUKA DETAIL KAMAR
  function handleRoomDetail(room) {
    setSelectedRoom(room);
  }

  // MENUTUP DETAIL KAMAR
  function closeRoomDetail() {
    setSelectedRoom(null);
  }

  // DATA UNTUK DETAIL KAMAR
  const selectedRoomImage = selectedRoom
    ? selectedRoom.imageUrl ||
      roomImages[selectedRoom.name] ||
      roomImages["Standard Room"]
    : "";

  const selectedRoomFacilities =
    selectedRoom && Array.isArray(selectedRoom.facilities)
      ? selectedRoom.facilities
      : [];

  const selectedRoomAvailable = selectedRoom
    ? (selectedRoom.rooms || []).filter(
        (item) => item.status === "TERSEDIA"
      ).length
    : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7E9D8] text-[#4B3020]">
      {/* HERO */}
      <section
        id="beranda"
        className="relative min-h-152.5 md:min-h-172.5"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* CAROUSEL BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden bg-[#3D281C]">
          {heroSlides.map((slide, index) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              unoptimized
              sizes="100vw"
              aria-hidden={index !== activeSlide}
              className={`object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(48,29,17,0.76), rgba(48,29,17,0.35), rgba(48,29,17,0.12))",
            }}
          />
        </div>

        {/* KONTROL CAROUSEL */}
        <div className="absolute bottom-28 right-5 z-20 flex items-center gap-3 md:bottom-36 md:right-10">
          <button
            type="button"
            onClick={() => goToSlide(activeSlide - 1)}
            aria-label="Gambar sebelumnya"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-[#3D281C]/40 text-white backdrop-blur-sm hover:bg-[#3D281C]/70"
          >
            ‹
          </button>

          <div className="flex items-center gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Tampilkan gambar ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === activeSlide
                    ? "w-6 bg-[#F5D7B3]"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToSlide(activeSlide + 1)}
            aria-label="Gambar berikutnya"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-[#3D281C]/40 text-white backdrop-blur-sm hover:bg-[#3D281C]/70"
          >
            ›
          </button>
        </div>

        {/* NAVBAR */}
        <header className="absolute inset-x-0 top-0 z-30 border-b border-white/20 bg-[#3D281C]/15 text-white backdrop-blur-[3px]">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10">
            <a href="#beranda" className="flex shrink-0 items-center gap-3">
              <Image
                src="/images/nara-logo-transparent.png"
                alt="Logo NARA HOTEL"
                width={60}
                height={60}
                priority
                unoptimized
                className="h-14 w-14 object-contain"
              />

              <div>
                <h1 className="font-serif text-lg tracking-widest md:text-xl">
                  NARA HOTEL
                </h1>
                <p className="text-[9px] tracking-wide text-[#F5DEC4]">
                  Stay Better, Feel at Home
                </p>
              </div>
            </a>

            <div className="hidden items-center gap-7 text-sm md:flex">
              <a href="#beranda" className="hover:text-[#E9C69D]">
                Beranda
              </a>
              <a href="#tentang" className="hover:text-[#E9C69D]">
                Tentang Kami
              </a>
              <a href="#kamar" className="hover:text-[#E9C69D]">
                Kamar
              </a>
              <a href="#fasilitas" className="hover:text-[#E9C69D]">
                Fasilitas
              </a>
              <a href="#kontak" className="hover:text-[#E9C69D]">
                Kontak
              </a>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {loadingUser ? (
                <span className="text-xs text-white">Memuat...</span>
              ) : user ? (
                <>
                  <span className="hidden text-sm text-white sm:inline">
                    Halo, {user.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => router.push("/reservasi")}
                    className="rounded-full border border-[#E9C69D] bg-[#6B452D]/80 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4B3020]"
                  >
                    Reservasi
                  </button>

                  <NotificationButton />

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="rounded-full border border-white/50 px-4 py-2.5 text-xs text-white hover:bg-white/15 disabled:opacity-50"
                  >
                    {loggingOut ? "Keluar..." : "Keluar"}
                  </button>
                </>
              
) : (
  <>
    {/* TOMBOL LOGIN TAMU */}
    <button
      type="button"
      onClick={() => router.push("/login")}
      className="whitespace-nowrap rounded-full border border-[#E9C69D] bg-[#57371F]/80 px-3 py-2.5 text-[11px] font-semibold text-white shadow-lg transition hover:bg-[#3D281C] md:px-5 md:text-sm"
    >
      Masuk Tamu
    </button>

    {/* TOMBOL LOGIN ADMIN */}
    <button
      type="button"
      onClick={() => router.push("/admin/login")}
      className="whitespace-nowrap rounded-full border border-[#F5D7B3] bg-[#F5D7B3] px-3 py-2.5 text-[11px] font-semibold text-[#50331F] shadow-lg transition hover:bg-[#FFE7CC] md:px-5 md:text-sm"
    >
      Masuk Admin
    </button>
  </>
)}

            </div>
          </nav>
        </header>

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-152.5 max-w-7xl items-center px-6 pb-24 pt-28 md:min-h-172.5 md:px-10">
          <div className="max-w-2xl text-[#FFF8EE]" data-reveal>
            <div className="mb-5 flex items-center gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#F0D0A9]">
                Welcome to NARA HOTEL
              </p>
              <span className="h-px w-16 bg-[#E8C69C]" />
            </div>

            <h2 className="font-serif text-4xl font-medium leading-[1.13] md:text-6xl">
              Temukan Kenyamanan untuk Setiap Perjalanan
            </h2>

            <p className="mt-5 max-w-lg font-serif text-sm leading-7 text-[#F7EBDD] md:text-base">
              Nikmati pengalaman menginap yang berkesan dengan pelayanan
              terbaik dan fasilitas lengkap di NARA HOTEL.
            </p>

            <a
              href="#kamar"
              className="mt-7 inline-flex items-center rounded-full bg-[#F5D7B3] px-7 py-3.5 font-serif text-sm font-semibold text-[#50331F] shadow-lg hover:-translate-y-1 hover:bg-[#FFE7CC]"
            >
              Jelajahi Hotel
            </a>
          </div>
        </div>

        {/* PEMISAH HERO */}
        <div className="pointer-events-none absolute -bottom-0.5 left-0 z-10 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="h-21.25 w-full md:h-27.5"
          >
            <path
              d="M0,65 C180,10 310,18 480,55 C680,100 810,100 1000,55 C1190,10 1320,25 1440,55 L1440,120 L0,120 Z"
              fill="#F7E9D8"
            />
          </svg>
        </div>
      </section>

      {/* PILIHAN KAMAR */}
      <section
        id="kamar"
        className="relative z-0 bg-[#F7E9D8] px-5 pb-16 pt-24 md:px-10 md:pb-20 md:pt-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#755034]">
                  Tipe Kamar
                </p>
                <span className="h-px w-16 bg-[#B78A60]" />
              </div>

              <h2 className="font-serif text-3xl text-[#4B3020] md:text-4xl">
                Pilihan Kamar untuk Anda
              </h2>

              <p className="mt-2 max-w-lg font-serif text-sm text-[#72583F]">
                Nikmati kenyamanan maksimal dengan pilihan kamar premium yang
                elegan dan modern.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/reservasi")}
              className="inline-flex w-fit items-center rounded-full border border-[#805735] px-6 py-3 font-serif text-xs font-semibold text-[#57371F] hover:bg-[#EBD5BC]"
            >
              Lihat Semua Kamar
            </button>
          </div>

          {loadingRooms && (
            <div className="py-16 text-center text-[#76563B]">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D8B995] border-t-[#6B452D]" />
              Memuat pilihan kamar...
            </div>
          )}

          {!loadingRooms && roomError && (
            <div className="rounded-xl border border-[#D8B995] bg-[#FFF9F0] p-6 text-center">
              <p className="font-semibold">
                Data kamar belum dapat ditampilkan.
              </p>
              <p className="mt-2 text-sm text-[#76604D]">{roomError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-[#6B452D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4B2E1C]"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!loadingRooms && !roomError && rooms.length === 0 && (
            <div className="rounded-xl bg-[#FFF9F0] p-10 text-center text-[#76604D]">
              Belum ada tipe kamar yang tersedia.
            </div>
          )}

          {!loadingRooms && !roomError && rooms.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => {
                const availableRooms = (room.rooms || []).filter(
                  (item) => item.status === "TERSEDIA"
                );

                const roomFacilities = Array.isArray(room.facilities)
                  ? room.facilities
                  : [];

                const roomImage =
                  room.imageUrl ||
                  roomImages[room.name] ||
                  roomImages["Standard Room"];

                return (
                  <article
                    key={room.id}
                    data-reveal
                    className="group overflow-hidden rounded-xl border border-[#E7CFB5] bg-[#FFF4E7] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* FOTO KAMAR */}
                    <button
                      type="button"
                      onClick={() => handleRoomDetail(room)}
                      aria-label={`Lihat detail ${room.name}`}
                      className="relative block h-51.25 w-full overflow-hidden text-left md:h-55"
                    >
                      <Image
                        src={roomImage}
                        alt={room.name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                      <span className="absolute bottom-3 right-3 rounded-full bg-[#3D281C]/80 px-4 py-2 text-[11px] font-semibold text-white">
                        Lihat Detail
                      </span>
                    </button>

                    <div className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleRoomDetail(room)}
                          className="text-left font-serif text-lg font-semibold text-[#4B3020] hover:text-[#A16E43]"
                        >
                          {room.name}
                        </button>

                        <span className="rounded-full bg-[#F0D2AE] px-3 py-1 text-[10px] font-semibold text-[#654329]">
                          {formatRupiah(room.price)} / malam
                        </span>
                      </div>

                      <p className="mt-2 min-h-10 text-xs leading-5 text-[#765B43]">
                        {room.description ||
                          "Kenyamanan dan suasana hangat untuk menemani perjalanan Anda."}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {roomFacilities.length > 0 ? (
                          roomFacilities.map((facility, index) => (
                            <span
                              key={`${room.id}-facility-${index}`}
                              className="rounded-full border border-[#DCC2A5] bg-[#F7E9D8] px-3 py-1 text-[10px] text-[#684A31]"
                            >
                              {facility}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#947B63]">
                            Informasi fasilitas belum tersedia.
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E8D5C0] pt-3">
                        <span className="text-[11px] text-[#80664D]">
                          {room.capacity} Tamu
                        </span>

                        <span
                          className={`text-[11px] font-semibold ${
                            availableRooms.length > 0
                              ? "text-[#557247]"
                              : "text-[#A34F37]"
                          }`}
                        >
                          {availableRooms.length > 0
                            ? `${availableRooms.length} kamar tersedia`
                            : "Kamar penuh"}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E8D5C0] pt-3">
                        <button
                          type="button"
                          onClick={() => handleRoomDetail(room)}
                          className="text-xs font-semibold text-[#68452B] hover:text-[#A16E43]"
                        >
                          Lihat Detail
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBook(room.id)}
                          disabled={availableRooms.length === 0}
                          className="rounded-full bg-[#70492D] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#4B3020] disabled:cursor-not-allowed disabled:bg-[#A99A8B]"
                        >
                          {availableRooms.length === 0
                            ? "Tidak tersedia"
                            : user
                              ? "Pesan Sekarang"
                              : "Masuk untuk Memesan"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* DETAIL KAMAR FULL SCREEN */}
      {selectedRoom && (
        <div
          className="fixed inset-0 z-100 bg-[#2B1B12]/90 backdrop-blur-md"
          onClick={closeRoomDetail}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-detail-title"
            className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#FFF4E7]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* FOTO UTAMA */}
            <section className="relative h-[42vh] min-h-65 w-full shrink-0 md:h-[48vh]">
              <Image
                src={selectedRoomImage}
                alt={selectedRoom.name}
                fill
                unoptimized
                priority
                sizes="100vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#2B1B12]/80 via-black/10 to-black/20" />

              <button
                type="button"
                onClick={closeRoomDetail}
                aria-label="Tutup detail kamar"
                className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-[#3D281C]/70 text-3xl text-white shadow-lg transition hover:bg-[#3D281C]"
              >
                ×
              </button>

              <div className="absolute bottom-8 left-6 right-6 md:bottom-12 md:left-14">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#F5D7B3] md:text-sm">
                  Detail Kamar NARA HOTEL
                </p>

                <h2
                  id="room-detail-title"
                  className="font-serif text-4xl font-semibold text-white md:text-6xl"
                >
                  {selectedRoom.name}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 md:text-base">
                  Temukan kenyamanan dan pengalaman menginap yang menyenangkan
                  bersama NARA HOTEL.
                </p>
              </div>
            </section>

            {/* KONTEN DETAIL */}
            <section className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-7xl px-6 py-8 md:px-14 md:py-10">
                <div className="flex flex-col justify-between gap-5 border-b border-[#E8D5C0] pb-7 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-[#80664D]">
                      Harga mulai dari
                    </p>

                    <p className="mt-1 font-serif text-3xl font-bold text-[#70492D] md:text-4xl">
                      {formatRupiah(selectedRoom.price)}
                      <span className="ml-2 text-sm font-normal text-[#80664D]">
                        / malam
                      </span>
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-5 py-3 text-sm font-semibold ${
                      selectedRoomAvailable > 0
                        ? "bg-[#E1EBD8] text-[#557247]"
                        : "bg-[#F4D9D2] text-[#A34F37]"
                    }`}
                  >
                    {selectedRoomAvailable > 0
                      ? `${selectedRoomAvailable} kamar tersedia`
                      : "Kamar penuh"}
                  </span>
                </div>

                <div className="grid gap-10 py-8 md:grid-cols-[1.5fr_1fr] md:gap-16">
                  <div>
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#A07853]">
                        Informasi Kamar
                      </p>

                      <h3 className="font-serif text-2xl font-bold text-[#4B3020] md:text-3xl">
                        Tentang Kamar
                      </h3>

                      <p className="mt-4 max-w-3xl text-sm leading-8 text-[#765B43] md:text-base">
                        {selectedRoom.description ||
                          "Nikmati kenyamanan dan suasana hangat selama menginap di NARA HOTEL. Kamar ini dirancang untuk memberikan pengalaman istirahat yang nyaman bagi setiap tamu."}
                      </p>
                    </div>

                    <div className="mt-10">
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#A07853]">
                        Kenyamanan Anda
                      </p>

                      <h3 className="font-serif text-2xl font-bold text-[#4B3020]">
                        Fasilitas Kamar
                      </h3>

                      {selectedRoomFacilities.length > 0 ? (
                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {selectedRoomFacilities.map((facility, index) => (
                            <div
                              key={`detail-${selectedRoom.id}-${index}`}
                              className="flex items-center gap-3 rounded-xl border border-[#E8D5C0] bg-white/60 px-5 py-4"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1DEC9] text-[#70492D]">
                                ✓
                              </span>

                              <span className="text-sm font-medium text-[#684A31]">
                                {facility}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-[#80664D]">
                          Informasi fasilitas belum tersedia.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="rounded-2xl border border-[#E8D5C0] bg-[#F7E9D8] p-6 md:p-8">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A07853]">
                        Ringkasan Kamar
                      </p>

                      <h3 className="mt-2 font-serif text-2xl font-bold text-[#4B3020]">
                        Informasi Detail
                      </h3>

                      <div className="mt-7 space-y-5">
                        <div className="flex items-center justify-between gap-4 border-b border-[#DDC5AA] pb-4">
                          <span className="text-sm text-[#80664D]">
                            Tipe Kamar
                          </span>
                          <span className="text-right text-sm font-semibold text-[#4B3020]">
                            {selectedRoom.name}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-b border-[#DDC5AA] pb-4">
                          <span className="text-sm text-[#80664D]">
                            Kapasitas
                          </span>
                          <span className="text-sm font-semibold text-[#4B3020]">
                            {selectedRoom.capacity || "-"} Tamu
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-b border-[#DDC5C0] pb-4">
                          <span className="text-sm text-[#80664D]">
                            Harga per malam
                          </span>
                          <span className="text-right text-sm font-semibold text-[#4B3020]">
                            {formatRupiah(selectedRoom.price)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-[#80664D]">
                            Ketersediaan
                          </span>
                          <span className="text-sm font-semibold text-[#557247]">
                            {selectedRoomAvailable} Kamar
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-[#70492D] p-6 text-white">
                      <h3 className="font-serif text-xl">
                        Pengalaman Menginap
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-[#F0DDC7]">
                        Nikmati suasana yang nyaman dan pelayanan terbaik
                        selama menginap di NARA HOTEL.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TOMBOL AKSI */}
            <div className="shrink-0 border-t border-[#E8D5C0] bg-[#FFF4E7] px-6 py-4 md:px-14">
              <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeRoomDetail}
                  className="rounded-full border border-[#805735] px-8 py-3.5 text-sm font-semibold text-[#57371F] transition hover:bg-[#EBD5BC]"
                >
                  Kembali
                </button>

                <button
                  type="button"
                  onClick={() => handleBook(selectedRoom.id)}
                  disabled={selectedRoomAvailable === 0}
                  className="rounded-full bg-[#70492D] px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4B3020] disabled:cursor-not-allowed disabled:bg-[#A99A8B]"
                >
                  {selectedRoomAvailable === 0
                    ? "Kamar Tidak Tersedia"
                    : user
                      ? "Pesan Kamar Sekarang"
                      : "Masuk untuk Memesan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FASILITAS HOTEL */}
      <section
        id="fasilitas"
        className="relative isolate overflow-hidden py-16 md:py-24"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=90')",
          }}
        />

        <div className="absolute inset-0 z-1 bg-[#F5E9DA]/70" />
        <div className="absolute inset-0 z-1 bg-linear-to-r from-[#EAD5BE]/65 via-[#F5E9DA]/55 to-[#EAD5BE]/65" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* KOLOM KIRI: FOTO FASILITAS */}
            <div
              className="grid grid-cols-2 items-center gap-4 md:gap-6"
              data-reveal
            >
              <div className="relative mt-8 overflow-hidden rounded-tl-[80px] rounded-br-2xl shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=85"
                  alt="Kolam renang hotel"
                  width={1000}
                  height={1200}
                  unoptimized
                  className="h-65 w-full object-cover transition duration-700 hover:scale-105 md:h-100"
                />

                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pb-5 pt-14">
                  <p className="font-serif text-lg text-white md:text-xl">
                    Kolam Renang
                  </p>
                </div>
              </div>

              <div className="relative mb-8 overflow-hidden rounded-tr-[80px] rounded-bl-2xl shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85"
                  alt="Restoran hotel"
                  width={1000}
                  height={1200}
                  unoptimized
                  className="h-65 w-full object-cover transition duration-700 hover:scale-105 md:h-100"
                />

                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pb-5 pt-14">
                  <p className="font-serif text-lg text-white md:text-xl">
                    Restoran
                  </p>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN: INFORMASI FASILITAS */}
            <div
              className="rounded-2xl border border-white/80 bg-[#FFF8EF]/90 p-6 text-[#50331F] shadow-xl backdrop-blur-sm md:p-9"
              data-reveal
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#9B704C]">
                Kenyamanan Tanpa Batas
              </p>

              <h2 className="font-serif text-3xl leading-tight text-[#50331F] md:text-5xl">
                Fasilitas Unggulan NARA HOTEL
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-8 text-[#765B45] md:text-base">
                Kami menghadirkan berbagai fasilitas pilihan untuk
                memberikan pengalaman menginap yang nyaman, menyenangkan,
                dan berkesan. Nikmati setiap momen istimewa bersama
                NARA HOTEL.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4">
                {hotelFacilities.map((facility, index) => (
                  <div
                    key={facility}
                    className="flex items-center gap-3 border-b border-[#DCC7AF] pb-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C9A783] text-sm font-medium text-[#9B704C]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-sm font-medium text-[#50331F] md:text-base">
                      {facility}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/fasilitas"
                className="mt-9 inline-flex items-center rounded-full bg-[#D9B58E] px-8 py-4 font-serif text-sm font-semibold text-[#50331F] shadow-md transition hover:-translate-y-1 hover:bg-[#CBA47B]"
              >
                Selengkapnya
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TENTANG HOTEL */}
      <section
        id="tentang"
        className="relative isolate min-h-130 overflow-hidden px-5 py-20 md:min-h-150 md:px-10 md:py-28"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2200&q=90')",
          }}
        />

        <div className="absolute inset-0 z-1 bg-[#382317]/75" />

        <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-[#382317]/90 via-[#382317]/65 to-[#382317]/75" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          {/* FOTO INTERIOR */}
          <div className="relative" data-reveal>
            <div className="relative overflow-hidden rounded-tl-[130px] rounded-br-[90px] border-[5px] border-[#F5E4D0]/80 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
                alt="Suasana interior NARA HOTEL"
                width={1200}
                height={800}
                unoptimized
                className="h-82.5 w-full object-cover md:h-105"
              />
            </div>

            <div className="absolute -bottom-5 right-5 rounded-lg bg-[#70492D] px-6 py-4 text-[#FFF4E7] shadow-xl">
              <p className="font-serif text-xl">NARA HOTEL</p>
              <p className="mt-1 text-[9px] tracking-[0.2em]">
                STAY BETTER, FEEL AT HOME
              </p>
            </div>
          </div>

          {/* TEKS TENTANG HOTEL */}
          <div className="relative z-10 md:pl-5" data-reveal>
            <div className="mb-4 flex items-center gap-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E9C49B]">
                Pengalaman Menginap
              </p>
              <span className="h-px w-16 bg-[#D6A879]" />
            </div>

            <h2 className="font-serif text-3xl leading-tight text-[#FFF4E7] md:text-5xl">
              Lebih dari Sekadar Menginap
            </h2>

            <p className="mt-5 max-w-lg font-serif text-sm leading-8 text-[#F0DFCE] md:text-base">
              Rasakan suasana elegan, pelayanan ramah, dan ketenangan yang
              akan membuat perjalanan Anda menjadi lebih istimewa bersama
              NARA HOTEL.
            </p>

            <button
              type="button"
              onClick={() => router.push("/tentang-kami")}
              className="mt-8 inline-flex items-center rounded-full border border-[#E8C49E] bg-[#F3D5B2] px-7 py-3.5 font-serif text-sm font-semibold text-[#50331F] shadow-lg transition hover:-translate-y-1 hover:bg-[#FFE6C9]"
            >
              Tentang Kami
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="kontak"
        className="border-t! border-[#B99A78]! bg-[#DCC3A5]! px-6 pb-6 pt-14 text-[#493323]! md:px-10"
      >
        <div
          className="mx-auto grid max-w-7xl gap-10 border-b border-[#8F6848]/40 pb-10 sm:grid-cols-2 lg:grid-cols-4"
          data-reveal
        >
          {/* IDENTITAS HOTEL */}
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-[0.12em]">
              NARA HOTEL
            </h2>

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#70492D]">
              Stay Better, Feel at Home
            </p>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#503A2A]">
              Menghadirkan kenyamanan, kehangatan, dan pengalaman menginap
              yang berkesan untuk setiap perjalanan Anda.
            </p>
          </div>

          {/* NAVIGASI */}
          <div>
            <h3 className="font-serif text-lg font-semibold">
              Navigasi
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-[#503A2A]">
              <a href="#beranda" className="transition hover:translate-x-1 hover:text-[#FFF4E7]">
                Beranda
              </a>
              <a href="#tentang" className="transition hover:translate-x-1 hover:text-[#FFF4E7]">
                Tentang Kami
              </a>
              <a href="#kamar" className="transition hover:translate-x-1 hover:text-[#FFF4E7]">
                Pilihan Kamar
              </a>
              <a href="#fasilitas" className="transition hover:translate-x-1 hover:text-[#FFF4E7]">
                Fasilitas Hotel
              </a>
              <a href="#kontak" className="transition hover:translate-x-1 hover:text-[#FFF4E7]">
                Kontak
              </a>
            </div>
          </div>

          {/* KONTAK */}
          <div>
            <h3 className="font-serif text-lg font-semibold">
              Hubungi Kami
            </h3>

            <div className="mt-5 space-y-5 text-sm text-[#503A2A]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A77B55] text-[#FFF4E7]">
                  ☎
                </span>
                <div>
                  <p className="font-semibold">Telepon</p>
                  <p className="text-xs">+62 812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A77B55] text-[#FFF4E7]">
                  ✉
                </span>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-xs">hello@narahotel.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A77B55] text-[#FFF4E7]">
                  ⌖
                </span>
                <div>
                  <p className="font-semibold">Alamat</p>
                  <p className="text-xs">Indonesia</p>
                </div>
              </div>
            </div>
          </div>

          {/* SOSIAL MEDIA */}
          <div>
            <h3 className="font-serif text-lg font-semibold">
              Ikuti Kami
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#503A2A]">
              Temukan informasi dan suasana terbaru dari NARA HOTEL melalui
              media sosial kami.
            </p>

            <div className="mt-5 flex gap-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8F6848] bg-[#EAD6BF] text-sm font-bold text-[#57371F] transition hover:-translate-y-1 hover:bg-[#70492D] hover:text-white"
              >
                IG
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8F6848] bg-[#EAD6BF] text-lg font-bold text-[#57371F] transition hover:-translate-y-1 hover:bg-[#70492D] hover:text-white"
              >
                f
              </a>

              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8F6848] bg-[#EAD6BF] text-lg font-bold text-[#57371F] transition hover:-translate-y-1 hover:bg-[#70492D] hover:text-white"
              >
                ♪
              </a>
            </div>

            <button
              type="button"
              onClick={() => router.push("/reservasi")}
              className="mt-7 inline-flex items-center rounded-full bg-[#57371F] px-6 py-3 text-xs font-semibold text-[#FFF4E7] shadow-md transition hover:-translate-y-1 hover:bg-[#3D281C]"
            >
              Reservasi Sekarang →
            </button>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 pt-6 text-center text-xs text-[#503A2A] md:flex-row">
          <p>© 2026 NARA HOTEL. All rights reserved.</p>
          <p>Stay Better, Feel at Home.</p>
        </div>
      </footer>
    </main>
  );
}
