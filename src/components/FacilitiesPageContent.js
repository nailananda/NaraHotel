
"use client";

import Image from "next/image";

const facilities = [
  {
    name: "Swimming Pool",
    description:
      "Nikmati waktu bersantai dan menyegarkan diri di kolam renang dengan suasana yang nyaman.",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Restaurant",
    description:
      "Rasakan pengalaman bersantap dengan pilihan hidangan yang lezat.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Fitness Center",
    description:
      "Tetap jaga kebugaran tubuh dengan fasilitas olahraga yang tersedia.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Meeting Room",
    description:
      "Ruang pertemuan yang nyaman untuk kebutuhan bisnis maupun acara.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Free Wi-Fi",
    description:
      "Nikmati akses internet untuk menunjang kebutuhan pekerjaan dan hiburan.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Parking Area",
    description:
      "Area parkir yang disediakan untuk memberikan kenyamanan selama menginap.",
    image:
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function FacilitiesPageContent() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-10">
      {/* JUDUL */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#A16E43]">
          NARA HOTEL EXPERIENCE
        </p>

        <h1 className="font-serif text-4xl font-semibold text-[#4B3020] md:text-5xl">
          Fasilitas Hotel
        </h1>

        <p className="mt-5 text-sm leading-7 text-[#806B58] md:text-base">
          Berbagai fasilitas tersedia untuk melengkapi pengalaman menginap
          Anda agar terasa lebih nyaman, menyenangkan, dan berkesan.
        </p>
      </div>

      {/* DAFTAR FASILITAS */}
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => (
          <article
            key={facility.name}
            className="overflow-hidden rounded-2xl border border-[#E7D4BF] bg-[#FFF9F1] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* GAMBAR */}
            <div className="relative h-56 w-full overflow-hidden bg-[#EBD5BC]">
              <Image
                src={facility.image}
                alt={facility.name}
                fill
                unoptimized
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* INFORMASI */}
            <div className="p-6">
              <h2 className="font-serif text-xl font-semibold text-[#57371F]">
                {facility.name}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#806B58]">
                {facility.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
