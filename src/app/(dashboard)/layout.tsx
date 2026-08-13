// Destination: src/app/(dashboard)/layout.tsx
// This replaces the earlier version — ThemeToggle removed here since it
// now renders once, globally, from the root layout (avoids a duplicate).

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar
        name={session.user.name ?? "You"}
        email={session.user.email ?? ""}
      />
      <main className="flex-1 px-5 pb-24 pt-8 sm:px-10">{children}</main>
      <BottomNav />
    </div>
  );
}