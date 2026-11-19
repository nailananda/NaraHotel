import { Suspense } from "react";
import { redirect } from "next/navigation";
import { canAccess, getCurrentUser } from "@/lib/rbac";
import { getSidebarGroups } from "@/lib/sidebar-config";
import StaffSidebar from "@/components/StaffSidebar";

async function GuardedContent({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!canAccess("/resepsionis", user.role)) {
    redirect("/403");
  }

  return (
    <StaffSidebar
      groups={getSidebarGroups(user.role)}
      userName={user.name}
      userRole={user.role}
    >
      {children}
    </StaffSidebar>
  );
}

export default function ResepsionisLayout({ children }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <GuardedContent>{children}</GuardedContent>
    </Suspense>
  );
}
