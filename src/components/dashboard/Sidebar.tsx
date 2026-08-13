// Destination: src/components/dashboard/Sidebar.tsx
// This replaces the earlier version — adds an Export button with a CSV/
// Excel download menu, placed above the account chip.
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  ChevronUp,
  UserPen,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditProfileModal } from "./EditProfileModal";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  name: initialName,
  email,
}: {
  name: string;
  email: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const menuRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div className="mt-auto flex flex-col gap-2">
        {/* Export */}
        <div className="relative" ref={exportRef}>
          {exportOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 z-20 w-56 rounded-md border border-border bg-surface p-2 shadow-card-hover">
              <a
                href="/api/export?format=csv"
                onClick={() => setExportOpen(false)}
                className="flex items-center gap-2 rounded px-2 py-2 text-[13px] text-text-soft hover:bg-surface2 hover:text-text"
              >
                <FileText className="h-3.5 w-3.5" />
                Download as CSV
              </a>
              <a
                href="/api/export?format=xlsx"
                onClick={() => setExportOpen(false)}
                className="flex items-center gap-2 rounded px-2 py-2 text-[13px] text-text-soft hover:bg-surface2 hover:text-text"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Download as Excel (.xlsx)
              </a>
            </div>
          )}
          <button
            onClick={() => setExportOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-md border border-border p-2 text-[13px] text-text-soft lg:p-2.5 justify-center lg:justify-start"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span className="hidden lg:inline">Export</span>
          </button>
        </div>

        {/* Account chip */}
        <div className="relative" ref={menuRef}>
          {menuOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 z-20 w-60 rounded-md border border-border bg-surface p-3 shadow-card-hover">
              <div className="mb-2.5 flex items-center gap-2.5 border-b border-border pb-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-manila font-mono text-xs font-bold text-text">
                  {initials}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{name}</div>
                  <div className="truncate font-mono text-[11px] text-text-soft">
                    {email}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditOpen(true);
                  setMenuOpen(false);
                }}
                className="mb-1 flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-[13px] text-text-soft hover:bg-surface2 hover:text-text"
              >
                <UserPen className="h-3.5 w-3.5" />
                Edit profile
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-[13px] text-stamp-rejected hover:bg-stamp-rejected/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-md border border-border p-2 text-left text-[13px] lg:p-2.5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-manila font-mono text-xs font-bold text-text">
              {initials}
            </span>
            <span className="hidden min-w-0 flex-1 lg:block">
              <span className="block truncate font-semibold">{name}</span>
              <span className="block truncate text-text-soft">{email}</span>
            </span>
            <ChevronUp
              className={cn(
                "hidden h-3.5 w-3.5 shrink-0 text-text-soft transition-transform lg:block",
                menuOpen && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          name={name}
          email={email}
          onClose={() => setEditOpen(false)}
          onUpdated={(newName) => setName(newName)}
        />
      )}
    </aside>
  );
}