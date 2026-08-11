// Destination: src/app/(dashboard)/layout.tsx

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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
      <ThemeToggle />
      <BottomNav />
    </div>
  );
}