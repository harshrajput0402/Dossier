// Destination: src/components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <aside className="hidden w-[68px] shrink-0 flex-col border-r border-border bg-surface p-4 sm:flex md:p-4 lg:w-[220px] lg:p-6">
      <div className="mb-10 flex items-center gap-2 px-1 font-mono text-base font-bold lg:px-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
        <span className="hidden lg:inline">DOSSIER</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[14.5px] text-text-soft lg:justify-start",
                "justify-center lg:justify-start",
                active && "bg-surface2 font-semibold text-text"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2.5 rounded-md border border-border p-2 text-left text-[13px] lg:p-2.5"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-manila font-mono text-xs font-bold text-text">
            {initials}
          </span>
          <span className="hidden min-w-0 lg:block">
            <span className="block truncate font-semibold">{name}</span>
            <span className="flex items-center gap-1 truncate text-text-soft">
              <LogOut className="h-3 w-3 shrink-0" />
              Log out
            </span>
          </span>
        </button>
      </div>
    </aside>
  );
}