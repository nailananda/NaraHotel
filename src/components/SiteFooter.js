
export default function SiteFooter({ isFacilityPage = false }) {
  return (
    <footer className="border-t border-[#E5D1BA] bg-[#4B3020] px-5 py-10 text-[#F7E9D8]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-wider">
            NARA HOTEL
          </h2>
          <p className="mt-2 text-sm text-[#E5D1BA]">
            Stay Better, Feel at Home.
          </p>
        </div>

        <div className="text-sm text-[#E5D1BA]">
          <p>Pengalaman menginap yang nyaman dan berkesan.</p>
          <p className="mt-2">
          © 2026 NARA HOTEL. All rights reserved.          </p>
        </div>
      </div>
    </footer>
  );
}
