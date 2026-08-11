import { Reveal } from "./Reveal";

export function AiSpotlight() {
  return (
    <Reveal className="mx-auto max-w-[1100px] px-8 py-20">
      <div
        id="ai"
        className="scroll-mt-20 grid items-center gap-12 rounded-md bg-text p-10 text-bg md:grid-cols-2 md:p-14"
      >
        <div>
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-stamp-applied">
            AI matching
          </div>
          <h2 className="mb-4 text-3xl font-bold text-bg">
            Know your odds before you apply, not after you&apos;re rejected.
          </h2>
          <p className="max-w-[46ch] text-[15.5px] text-surface2">
            Every application gets scored against your resume in seconds —
            with specific, actionable gaps, not just a vague percentage.
          </p>
        </div>

        <div className="rounded-md border border-white/10 bg-white/5 p-5 font-mono">
          <div className="mb-1 text-[11px] tracking-wide text-surface2/70">
            MATCH SCORE — STRIPE, SWE PLATFORM
          </div>
          <div className="text-4xl font-bold text-stamp-offer">78%</div>
          <div className="my-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[78%] rounded-full bg-stamp-offer" />
          </div>
          <div className="mb-1 text-[11px] tracking-wide text-surface2/70">
            MISSING KEYWORDS
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["TypeScript", "GraphQL", "CI/CD"].map((k) => (
              <span
                key={k}
                className="rounded border border-white/20 px-2 py-1 text-[11px] text-surface2"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
