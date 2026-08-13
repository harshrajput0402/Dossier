// Destination: src/components/landing/Nav.tsx
// This replaces the earlier version — only change is the animated
// underline-on-hover on "How it works" / "AI matching", plus a matching
// lift-on-hover for the Log in button (Get started already had it).

import Link from "next/link";

const navLinkClass =
  "relative hidden text-text-soft sm:inline after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:text-text hover:after:w-full";

export function Nav() {
  return (
    <nav className="mx-auto flex max-w-[1100px] items-center justify-between px-8 py-7">
      <div className="flex items-center gap-2 font-mono text-lg font-bold before:h-2.5 before:w-2.5 before:rounded-full before:bg-accent before:content-['']">
        DOSSIER
      </div>
      <div className="flex items-center gap-8 text-[15px]">
        <a href="#how" className={navLinkClass}>
          How it works
        </a>
        <a href="#ai" className={navLinkClass}>
          AI matching
        </a>
        <Link
          href="/login"
          className="rounded border-[1.5px] border-text px-5 py-2.5 font-mono text-[13px] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded border-[1.5px] border-text bg-text px-5 py-2.5 font-mono text-[13px] text-bg transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop"
        >
          Get started free
        </Link>
      </div>
    </nav>
  );
}