import Link from "next/link";

export function Nav() {
  return (
    <nav className="mx-auto flex max-w-[1100px] items-center justify-between px-8 py-7">
      <div className="flex items-center gap-2 font-mono text-lg font-bold before:h-2.5 before:w-2.5 before:rounded-full before:bg-accent before:content-['']">
        DOSSIER
      </div>
      <div className="flex items-center gap-8 text-[15px]">
        <a href="#how" className="hidden text-text-soft sm:inline">
          How it works
        </a>
        <a href="#ai" className="hidden text-text-soft sm:inline">
          AI matching
        </a>
        <Link
          href="/login"
          className="rounded border-[1.5px] border-text px-5 py-2.5 font-mono text-[13px]"
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
