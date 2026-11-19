import { Suspense } from "react";
import { getCurrentUser } from "@/lib/rbac";
import { getSidebarGroups } from "@/lib/sidebar-config";
import StaffSidebar from "@/components/StaffSidebar";

async function AdminContent({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    return children;
  }

  const groups = getSidebarGroups(user.role);

  if (groups.length === 0) {
    return children;
  }

  return (
    <StaffSidebar
      groups={groups}
      userName={user.name}
      userRole={user.role}
    >
      {children}
    </StaffSidebar>
  );
}

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}
