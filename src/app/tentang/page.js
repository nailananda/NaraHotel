
import Image from "next/image";
import Link from "next/link";
import SiteNavigation from "@/components/SiteNavigation";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Tentang Kami | NARA HOTEL",
  description:
    "Kenali NARA HOTEL dan pengalaman menginap yang kami hadirkan.",
};

export default function TentangPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7E9D8] text-[#4B3020]">
      {/* NAVIGASI */}
      <div className="relative z-40">
        <SiteNavigation />
      </div>

      {/* HERO TENTANG KAMI */}
      <section className="relative isolate flex min-h-[480px] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=90"
          alt="Suasana NARA HOTEL"
          fill
          priority
          unoptimized
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[#382317]/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 text-center text-[#FFF4E7] md:px-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#E9C49B]">
            Welcome to NARA HOTEL
          </p>

          <h1 className="font-serif text-5xl md:text-7xl">
            Tentang Kami
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#F5E5D3] md:text-base">
            Mengenal lebih dekat NARA HOTEL, tempat di mana
            kenyamanan, kehangatan, dan pengalaman menginap
            istimewa menjadi satu.
          </p>
        </div>
      </section>

      {/* CERITA KAMI */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-10 lg:grid-cols-2">
        <div className="relative h-[350px] overflow-hidden rounded-tl-[90px] rounded-br-2xl shadow-xl md:h-[480px]">
          <Image
            src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85"
            alt="Interior kamar hotel"
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#A16E43]">
            Our Story
          </p>

          <h2 className="font-serif text-4xl leading-tight md:text-5xl">
            Lebih dari Sekadar Tempat Menginap
          </h2>

          <p className="mt-6 text-sm leading-8 text-[#806B58] md:text-base">
            NARA HOTEL hadir sebagai tempat untuk menikmati
            pengalaman menginap yang nyaman dan menyenangkan.
            Kami percaya bahwa setiap perjalanan memiliki
            cerita tersendiri yang layak menjadi kenangan.
          </p>

          <p className="mt-4 text-sm leading-8 text-[#806B58] md:text-base">
            Dengan suasana yang hangat, desain yang elegan,
            serta berbagai fasilitas pilihan, kami berupaya
            memberikan pengalaman terbaik bagi setiap tamu.
          </p>
        </div>
      </section>

      {/* NILAI KAMI */}
      <section className="bg-[#EBD9C4] px-5 py-20 md:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A16E43]">
            Our Commitment
          </p>

          <h2 className="mt-4 font-serif text-4xl">
            Mengutamakan Kenyamanan Anda
          </h2>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {[
              {
                title: "Kenyamanan",
                description:
                  "Menghadirkan suasana menginap yang nyaman dan menenangkan.",
              },
              {
                title: "Keramahan",
                description:
                  "Memberikan pelayanan yang hangat dan bersahabat kepada setiap tamu.",
              },
              {
                title: "Kualitas",
                description:
                  "Memperhatikan kualitas pengalaman menginap melalui fasilitas dan pelayanan.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E1C9AE] bg-[#FFF9F1] p-8 shadow-sm"
              >
                <h3 className="font-serif text-2xl">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#806B58]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEMBALI */}
      <section className="px-5 py-16 text-center">
        <h2 className="font-serif text-3xl md:text-4xl">
          Temukan Kenyamanan Bersama NARA HOTEL
        </h2>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#D9B58E] px-8 py-4 font-serif text-sm font-semibold text-[#50331F] shadow-md transition hover:bg-[#CBA47B]"
        >
          Kembali ke Beranda
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
