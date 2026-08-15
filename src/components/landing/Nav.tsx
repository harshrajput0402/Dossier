// Destination: src/components/landing/Nav.tsx
// This replaces the earlier version — two pills total: logo, and one
// merged pill (How it works / AI matching / Log in / Get started), all
// sharing the sliding hover highlight. Get started is outline, not filled.
"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const pillShadow = "shadow-[0_8px_22px_var(--shadow)]";

export function Nav() {
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [highlight, setHighlight] = useState({ left: 0, width: 0, opacity: 0 });

  function moveHighlight(i: number) {
    const el = itemRefs.current[i];
    if (!el) return;
    setHighlight({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  }

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-bg">
      <nav className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-8 py-5">
        {/* logo pill */}
        <div className={`rounded-full border border-border bg-surface px-5 py-3 ${pillShadow}`}>
          <div className="flex items-center gap-2 font-mono text-base font-bold before:h-2.5 before:w-2.5 before:rounded-full before:bg-accent before:content-['']">
            DOSSIER
          </div>
        </div>

        {/* single merged pill — links, log in, and get started all together */}
        <div
          className={`relative flex items-center gap-0.5 rounded-full border border-border bg-surface p-2 ${pillShadow}`}
          onMouseLeave={() => setHighlight((h) => ({ ...h, opacity: 0 }))}
        >
          <span
            className="absolute top-2 h-[calc(100%-16px)] rounded-full bg-surface2 transition-[left,width] duration-300 ease-out"
            style={{
              left: highlight.left,
              width: highlight.width,
              opacity: highlight.opacity,
            }}
          />

          <a
            href="#how"
            ref={(el) => {
              itemRefs.current[0] = el;
            }}
            onMouseEnter={() => moveHighlight(0)}
            className="relative z-10 hidden rounded-full px-4 py-2 text-[13.5px] text-text-soft transition-colors hover:text-text sm:block"
          >
            How it works
          </a>
          <a
            href="#ai"
            ref={(el) => {
              itemRefs.current[1] = el;
            }}
            onMouseEnter={() => moveHighlight(1)}
            className="relative z-10 hidden rounded-full px-4 py-2 text-[13.5px] text-text-soft transition-colors hover:text-text sm:block"
          >
            AI matching
          </a>
          <Link
            href="/login"
            ref={(el) => {
              itemRefs.current[2] = el;
            }}
            onMouseEnter={() => moveHighlight(2)}
            className="relative z-10 rounded-full px-4 py-2 font-mono text-[12.5px] text-text-soft transition-colors hover:text-text"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            ref={(el) => {
              itemRefs.current[3] = el;
            }}
            onMouseEnter={() => moveHighlight(3)}
            className="relative z-10 rounded-full border border-text px-4 py-2 font-mono text-[12.5px] text-text transition-transform hover:-translate-y-0.5"
          >
            Get started free
          </Link>
        </div>
      </nav>
    </div>
  );
}