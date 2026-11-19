
import Link from "next/link";

export default function SiteNavigation({
  isFacilityPage = false,
  activeSection = "",
}) {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#E5D1BA] bg-[#FFF9F1]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link
          href="/"
          className="font-serif text-2xl font-bold tracking-[0.15em] text-[#57371F]"
        >
          NARA HOTEL
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-[#68452B]">
          <Link
            href="/"
            className="transition hover:text-[#A16E43]"
          >
            Beranda
          </Link>

          <Link
            href="/fasilitas"
            className={`transition hover:text-[#A16E43] ${
              activeSection === "fasilitas"
                ? "font-bold text-[#A16E43]"
                : ""
            }`}
          >
            Fasilitas
          </Link>
        </div>
      </nav>
    </header>
  );
}
