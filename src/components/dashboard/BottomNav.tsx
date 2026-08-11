// Destination: src/components/dashboard/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Board", icon: LayoutDashboard },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-[150] flex h-[60px] items-center justify-around border-t border-border bg-surface sm:hidden">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 font-mono text-[10px] text-text-soft",
              active && "text-accent"
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}