
import Image from "next/image";
import Link from "next/link";
import SiteNavigation from "@/components/SiteNavigation";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Tentang Kami | NARA HOTEL",
  description:
    "Kenali NARA HOTEL dan pengalaman menginap yang kami hadirkan untuk setiap tamu.",
};

// CONTOH ULASAN TAMU
const guestReviews = [
  {
    name: "Rina Amelia",
    initial: "R",
    room: "Standard Room",
    date: "2 minggu lalu",
    rating: 5,
    message:
      "Kamarnya nyaman dan bersih. Suasananya juga tenang sehingga cocok untuk beristirahat setelah perjalanan.",
  },
  {
    name: "Dimas Pratama",
    initial: "D",
    room: "Deluxe Room",
    date: "1 bulan lalu",
    rating: 5,
    message:
      "Pelayanannya ramah dan fasilitasnya cukup lengkap. Pengalaman menginap yang menyenangkan bersama keluarga.",
  },
  {
    name: "Salsa Maharani",
    initial: "S",
    room: "Suite Room",
    date: "3 minggu lalu",
    rating: 4,
    message:
      "Interior hotelnya bagus dan suasananya terasa hangat. Tempat yang nyaman untuk menikmati waktu istirahat.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7E9D8] text-[#4B3020]">
      {/* NAVBAR */}
      <div className="relative z-40">
        <SiteNavigation />
      </div>

      {/* HERO TENTANG KAMI */}
      <section className="relative isolate flex min-h-[570px] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=90"
            alt="Interior kamar NARA HOTEL"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[#382317]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#382317]/90 via-[#382317]/55 to-[#382317]/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-10">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#E9C49B]">
              Mengenal Lebih Dekat
            </p>

            <h1 className="font-serif text-4xl leading-tight text-[#FFF4E7] md:text-6xl">
              Selamat Datang di NARA HOTEL
            </h1>

            <p className="mt-6 max-w-xl font-serif text-sm leading-8 text-[#F0DFCE] md:text-base">
              Lebih dari sekadar tempat beristirahat, NARA HOTEL hadir untuk
              memberikan kenyamanan, kehangatan, dan pengalaman menginap
              yang berkesan dalam setiap perjalanan Anda.
            </p>

            <Link
              href="/reservasi"
              className="mt-8 inline-flex items-center rounded-full bg-[#F3D5B2] px-8 py-4 font-serif text-sm font-semibold text-[#50331F] shadow-lg transition hover:-translate-y-1 hover:bg-[#FFE6C9]"
            >
              Pesan Kamar Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* CERITA KAMI */}
      <section className="bg-[#F7E9D8] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* FOTO HOTEL */}
          <div className="relative">
            <div className="relative h-[340px] overflow-hidden rounded-tl-[100px] rounded-br-[70px] shadow-xl md:h-[460px]">
              <Image
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
                alt="Interior elegan NARA HOTEL"
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-5 right-4 rounded-xl bg-[#70492D] px-6 py-4 text-[#FFF4E7] shadow-xl md:right-8">
              <p className="font-serif text-xl">NARA HOTEL</p>
              <p className="mt-1 text-[9px] tracking-[0.2em]">
                STAY BETTER, FEEL AT HOME
              </p>
            </div>
          </div>

          {/* DESKRIPSI HOTEL */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#A16E43]">
              Cerita Kami
            </p>

            <h2 className="font-serif text-3xl leading-tight text-[#4B3020] md:text-5xl">
              Menghadirkan Kenyamanan di Setiap Perjalanan
            </h2>

            <p className="mt-6 text-sm leading-8 text-[#765B43] md:text-base">
              NARA HOTEL merupakan tempat menginap yang dirancang untuk
              memberikan suasana nyaman dan menyenangkan bagi setiap tamu.
              Kami percaya bahwa pengalaman menginap yang baik tidak hanya
              berasal dari tempat yang indah, tetapi juga dari suasana
              yang hangat dan pelayanan yang penuh perhatian.
            </p>

            <p className="mt-4 text-sm leading-8 text-[#765B43] md:text-base">
              Melalui lingkungan yang nyaman dan fasilitas yang mendukung,
              kami ingin menjadikan setiap kunjungan sebagai bagian dari
              perjalanan yang menyenangkan dan berkesan.
            </p>

            <Link
              href="/fasilitas"
              className="mt-7 inline-flex items-center rounded-full border border-[#805735] px-7 py-3.5 font-serif text-sm font-semibold text-[#57371F] transition hover:bg-[#EBD5BC]"
            >
              Jelajahi Fasilitas
              <span className="ml-3">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ULASAN DARI TAMU */}
      <section className="bg-[#EBD8C2] px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          {/* JUDUL ULASAN */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#A16E43]">
              Pengalaman Para Tamu
            </p>

            <h2 className="font-serif text-3xl leading-tight text-[#4B3020] md:text-5xl">
              Cerita dari Tamu Kami
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#806B58] md:text-base">
              Simak pengalaman dan kesan para tamu setelah menikmati
              pengalaman menginap bersama NARA HOTEL.
            </p>
          </div>

          {/* DAFTAR KARTU ULASAN */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guestReviews.map((review, index) => (
              <article
                key={index}
                className="rounded-2xl border border-[#E1CBB3] bg-[#FFF9F1] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* PROFIL PENGULAS */}
                <div className="flex items-center gap-3">
                  {/* AVATAR */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#70492D] font-serif text-lg font-semibold text-white">
                    {review.initial}
                  </div>

                  {/* NAMA DAN TANGGAL */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-[#4B3020]">
                      {review.name}
                    </h3>

                    <p className="mt-1 text-xs text-[#947B63]">
                      {review.date}
                    </p>
                  </div>

                  {/* IKON PROFIL */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E8D5C0] text-[#A16E43]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-4 w-4"
                    >
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>

                {/* RATING BINTANG */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex gap-0.5 text-lg text-[#D19A4F]">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span key={starIndex}>
                        {starIndex < review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-medium text-[#806B58]">
                    {review.rating}.0 / 5
                  </span>
                </div>

                {/* KOMENTAR */}
                <p className="mt-4 min-h-[100px] text-sm leading-7 text-[#765B43]">
                  “{review.message}”
                </p>

                {/* TIPE KAMAR */}
                <div className="mt-5 border-t border-[#E8D5C0] pt-4">
                  <p className="text-xs text-[#947B63]">
                    Pengalaman menginap
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#70492D]">
                    {review.room}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-xs leading-6 text-[#806B58]">
            Ulasan yang ditampilkan saat ini merupakan contoh tampilan,
            bukan ulasan asli dari tamu.
          </p>
        </div>
      </section>

      {/* AJAKAN RESERVASI */}
      <section className="relative isolate overflow-hidden px-5 py-20 md:px-10 md:py-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=90"
            alt="Suasana hotel"
            fill
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[#382317]/80" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#E9C49B]">
            Stay Better, Feel at Home
          </p>

          <h2 className="font-serif text-3xl leading-tight text-[#FFF4E7] md:text-5xl">
            Jadikan Perjalanan Anda Lebih Berkesan
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#F0DFCE] md:text-base">
            Temukan kenyamanan dan suasana hangat bersama NARA HOTEL.
            Kami siap menemani waktu istirahat Anda.
          </p>

          <Link
            href="/reservasi"
            className="mt-8 inline-flex items-center rounded-full bg-[#F3D5B2] px-9 py-4 font-serif text-sm font-semibold text-[#50331F] shadow-lg transition hover:-translate-y-1 hover:bg-[#FFE6C9]"
          >
            Mulai Reservasi
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </main>
  );
}
