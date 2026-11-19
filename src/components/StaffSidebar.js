"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function MenuIcon({ name, className = "h-5 w-5" }) {
  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-5 5" />
      </>
    ),
    receipt: (
      <>
        <path d="M4 3h16v18l-3-2-3 2-3-2-3 2-4-2z" />
        <path d="M8 8h8M8 12h8M8 16h4" />
      </>
    ),
    desk: (
      <>
        <path d="M3 10h18v8H3zM7 18v3m10-3v3M7 10V6h10v4" />
        <path d="M12 6V3" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14zM5 3l.7 1.3L7 5l-1.3.7L5 7l-.7-1.3L3 5l1.3-.7L5 3z" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v12h14V9M9 21v-7h6v7" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function getInitials(name) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

export default function StaffSidebar({
  children,
  groups,
  userName,
  userRole,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  if (pathname === "/admin/login") {
    return children;
  }

  async function handleLogout() {
    setLogoutError("");

    try {
      const response = await fetch("/api/logout", { method: "POST" });

      if (!response.ok) {
        throw new Error("Gagal keluar. Silakan coba lagi.");
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      setLogoutError(error.message || "Gagal keluar. Silakan coba lagi.");
    }
  }

  function renderMenu(isMobile) {
    return (
      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <section key={group.label}>
            {(!collapsed || isMobile) && (
              <h2 className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-[#C7AE98]">
                {group.label}
              </h2>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      aria-label={collapsed && !isMobile ? item.label : undefined}
                      title={collapsed && !isMobile ? item.label : undefined}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                        active
                          ? "bg-[#8A6248] font-semibold text-white shadow-sm"
                          : "text-[#F3E9DF] hover:bg-[#684934] hover:text-white"
                      } ${collapsed && !isMobile ? "justify-center" : ""}`}
                    >
                      <MenuIcon name={item.icon} className="h-5 w-5 shrink-0" />
                      {(!collapsed || isMobile) && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
    );
  }

  function renderFooter(isMobile) {
    const compact = collapsed && !isMobile;

    return (
      <footer className="shrink-0 border-t border-[#72533D] px-3 py-4">
        <Link
          href="/"
          title={compact ? "Ke Website" : undefined}
          onClick={() => setDrawerOpen(false)}
          className={`mb-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#F3E9DF] hover:bg-[#684934] hover:text-white ${
            compact ? "justify-center" : ""
          }`}
        >
          <MenuIcon name="home" className="h-5 w-5 shrink-0" />
          {!compact && <span>Ke Website</span>}
        </Link>

        <div
          className={`flex items-center gap-3 rounded-lg bg-[#4A3427] p-2.5 ${
            compact ? "justify-center" : ""
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B0805A] text-sm font-bold text-white">
            {getInitials(userName)}
          </span>
          {!compact && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {userName}
              </p>
              <p className="mt-0.5 text-[10px] tracking-[0.12em] text-[#D4BDA9]">
                {userRole}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title={compact ? "Keluar" : undefined}
          className={`mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#F3E9DF] hover:bg-[#684934] hover:text-white ${
            compact ? "justify-center" : ""
          }`}
        >
          <MenuIcon name="logout" className="h-5 w-5 shrink-0" />
          {!compact && <span>Keluar</span>}
        </button>
        {logoutError && (
          <p role="alert" className="mt-2 text-xs text-red-200">
            {logoutError}
          </p>
        )}
      </footer>
    );
  }

  return (
    <div className="md:flex md:min-h-screen">
      <div className="flex h-14 items-center justify-between bg-[#523A2B] px-4 text-white md:hidden">
        <span className="text-sm font-bold tracking-[0.18em]">NARA HOTEL</span>
        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
          className="rounded-md p-2 hover:bg-[#684934]"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col bg-[#523A2B] text-white transition-[width] duration-200 md:flex ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <div
          className={`flex h-16 shrink-0 items-center border-b border-[#72533D] px-4 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <span className="text-sm font-bold tracking-[0.18em]">
              NARA HOTEL
            </span>
          )}
          <button
            type="button"
            aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((value) => !value)}
            className="rounded-md p-2 text-[#F3E9DF] hover:bg-[#684934]"
          >
            <svg
              aria-hidden="true"
              className={`h-5 w-5 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>
        {renderMenu(false)}
        {renderFooter(false)}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/50"
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-[#523A2B] text-white shadow-xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#72533D] px-4">
              <span className="text-sm font-bold tracking-[0.18em]">
                NARA HOTEL
              </span>
              <button
                type="button"
                aria-label="Tutup menu"
                onClick={() => setDrawerOpen(false)}
                className="rounded-md p-2 hover:bg-[#684934]"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            {renderMenu(true)}
            {renderFooter(true)}
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
