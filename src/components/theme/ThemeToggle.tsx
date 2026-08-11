"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // avoid hydration mismatch — theme isn't known on the server
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "fixed bottom-[22px] right-[22px] z-[200] flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-1.5 shadow-card",
        "max-[640px]:bottom-[76px]", // clears the mobile bottom nav
        className
      )}
      aria-label="Toggle light and dark theme"
    >
      <span className="relative h-[22px] w-10 rounded-full bg-surface2">
        <span
          className={cn(
            "absolute top-0.5 left-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-accent transition-all",
            isDark && "left-5"
          )}
        >
          <Circle className="h-[10px] w-[10px] fill-surface text-surface" />
        </span>
      </span>
      <span className="pr-1.5 font-mono text-[11px] text-text-soft">Theme</span>
    </button>
  );
}
