import Link from "next/link";

const MOCK_CARDS = [
  { co: "Vercel", role: "Frontend Engineer", stamp: "Interview", color: "text-stamp-interview" },
  { co: "Linear", role: "Full Stack Dev", stamp: "Applied", color: "text-stamp-applied" },
  { co: "Stripe", role: "SWE, Platform", stamp: "Offer", color: "text-stamp-offer" },
  { co: "Notion", role: "Product Eng", stamp: "Rejected", color: "text-stamp-rejected" },
];

export function Hero() {
  return (
    <div className="mx-auto max-w-[1100px] px-8 pb-20 pt-14">
      <div className="inline-block translate-y-0.5 rounded-t bg-manila px-3.5 py-1.5 font-mono text-xs tracking-wide">
        CASE FILE — YOUR JOB HUNT
      </div>

      <div className="grid items-center gap-14 rounded-md border-[1.5px] border-text bg-surface p-12 shadow-pop md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="mb-5 text-4xl font-bold leading-[1.12] tracking-tight md:text-[46px]">
            Every application, filed. Every follow-up,{" "}
            <span className="bg-manila/60 px-0.5 font-mono">remembered.</span>
          </h1>
          <p className="mb-8 max-w-[46ch] text-lg text-text-soft">
            Stop losing track of who you applied to. Dossier keeps every
            application, status change, and follow-up in one place — and
            scores your resume against the job before you hit send.
          </p>
          <div className="mb-3.5 flex flex-wrap items-center gap-3.5">
            <Link
              href="/signup"
              className="rounded border-[1.5px] border-text bg-text px-5 py-2.5 font-mono text-[13px] text-bg"
            >
              Open your dossier
            </Link>
            <a
              href="#how"
              className="rounded border-[1.5px] border-text px-5 py-2.5 font-mono text-[13px]"
            >
              See how it works
            </a>
          </div>
          <div className="font-mono text-xs text-text-soft">
            No credit card. Your data stays yours.
          </div>
        </div>

        <div className="flex flex-col gap-2.5 rounded-md border border-border bg-bg p-4">
          {MOCK_CARDS.map((c) => (
            <div
              key={c.co}
              className="flex items-center justify-between gap-2.5 rounded border border-border bg-surface p-3.5"
            >
              <div>
                <div className="text-sm font-semibold">{c.co}</div>
                <div className="font-mono text-xs text-text-soft">{c.role}</div>
              </div>
              <span
                className={`rounded border-2 border-current px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wide ${c.color}`}
              >
                {c.stamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}