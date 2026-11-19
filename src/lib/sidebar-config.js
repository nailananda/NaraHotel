import "server-only";
import { canAccess } from "@/lib/rbac";

const SIDEBAR_GROUPS = [
  {
    label: "ADMIN",
    items: [
      { label: "Dashboard", href: "/admin", icon: "dashboard" },
      { label: "Pengguna", href: "/admin/pengguna", icon: "users" },
      {
        label: "Laporan Okupansi",
        href: "/admin/laporan-okupansi",
        icon: "chart",
      },
      {
        label: "Laporan Transaksi",
        href: "/admin/laporan-transaksi",
        icon: "receipt",
      },
    ],
  },
  {
    label: "RESEPSIONIS",
    items: [
      {
        label: "Operasional Resepsionis",
        href: "/resepsionis",
        icon: "desk",
      },
    ],
  },
  {
    label: "HOUSEKEEPING",
    items: [
      {
        label: "Operasional Housekeeping",
        href: "/housekeeping",
        icon: "sparkles",
      },
    ],
  },
];

export function getSidebarGroups(role) {
  return SIDEBAR_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => canAccess(item.href, role)),
  })).filter((group) => group.items.length > 0);
}
