import Link from "next/link";
import { Reveal } from "./Reveal";

export function FooterCta() {
  return (
    <Reveal className="mx-auto max-w-[1100px] px-8">
      <div className="py-24 text-center">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          Open case
        </div>
        <h2 className="mx-auto mb-7 max-w-[26ch] text-3xl font-bold">
          Your next offer starts with better tracking.
        </h2>
        <Link
          href="/signup"
          className="rounded border-[1.5px] border-text bg-text px-6 py-3 font-mono text-[13px] text-bg"
        >
          Get started free
        </Link>
      </div>
      <footer className="flex justify-between border-t border-border py-7 font-mono text-xs text-text-soft">
        <div>DOSSIER — job application tracker</div>
        <div>Built with Next.js</div>
      </footer>
    </Reveal>
  );
}
