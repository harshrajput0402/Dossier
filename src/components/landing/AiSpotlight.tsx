// Destination: src/components/landing/AiSpotlight.tsx
// This replaces the earlier version — adds the scan effect, eased
// count-up, stamped keyword chips, and cascading suggested tweaks
// (matches the approved preview). Uses the `scan` and `shine` keyframes
// added to globals.css.
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MISSING = ["TypeScript", "GraphQL", "CI/CD"];
const TWEAKS = [
  "Mention TypeScript explicitly in your project bullets.",
  "Quantify your Socket.IO real-time work.",
  "Call out any CI/CD pipeline experience.",
];

export function AiSpotlight() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [score, setScore] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [scan, setScan] = useState(false);
  const [shine, setShine] = useState(false);
  const [visibleKw, setVisibleKw] = useState<boolean[]>(
    MISSING.map(() => false)
  );
  const [visibleTweaks, setVisibleTweaks] = useState<boolean[]>(
    TWEAKS.map(() => false)
  );

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          setScan(true);
          setTimeout(() => {
            setBarWidth(78);

            const target = 78;
            const duration = 900;
            const startTime = performance.now();
            function tick(now: number) {
              const t = Math.min(1, (now - startTime) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setScore(Math.round(eased * target));
              if (t < 1) requestAnimationFrame(tick);
              else setShine(true);
            }
            requestAnimationFrame(tick);

            MISSING.forEach((_, i) =>
              setTimeout(
                () =>
                  setVisibleKw((prev) => {
                    const next = [...prev];
                    next[i] = true;
                    return next;
                  }),
                500 + i * 130
              )
            );
            TWEAKS.forEach((_, i) =>
              setTimeout(
                () =>
                  setVisibleTweaks((prev) => {
                    const next = [...prev];
                    next[i] = true;
                    return next;
                  }),
                1100 + i * 220
              )
            );
          }, 200);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-[1100px] px-8 py-20">
      <div
        id="ai"
        ref={panelRef}
        className={cn(
          "scroll-mt-20 grid items-center gap-12 rounded-md bg-text p-10 text-bg transition-all duration-700 md:grid-cols-2 md:p-14",
          triggered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
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

        <div className="relative overflow-hidden rounded-md border border-white/10 bg-white/5 p-5 font-mono">
          {scan && (
            <div className="pointer-events-none absolute inset-x-0 top-[-20%] h-[40%] animate-[scan_1.4s_ease-in-out_1] bg-gradient-to-b from-transparent via-stamp-applied/20 to-transparent" />
          )}

          <div className="mb-1 text-[11px] tracking-wide text-surface2/70">
            MATCH SCORE — STRIPE, SWE PLATFORM
          </div>
          <div className="text-4xl font-bold text-stamp-offer">{score}%</div>
          <div className="relative my-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="relative h-full rounded-full bg-stamp-offer transition-[width] duration-[1100ms] ease-out"
              style={{ width: `${barWidth}%` }}
            >
              {shine && (
                <span className="absolute inset-0 animate-[shine_1s_ease_1] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              )}
            </div>
          </div>

          <div className="mb-1 text-[11px] tracking-wide text-surface2/70">
            MISSING KEYWORDS
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {MISSING.map((k, i) => (
              <span
                key={k}
                className={cn(
                  "rounded border border-white/20 px-2 py-1 text-[11px] text-surface2 transition-all duration-300",
                  visibleKw[i]
                    ? `scale-100 opacity-100 ${
                        i % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]"
                      }`
                    : "scale-125 rotate-[-6deg] opacity-0"
                )}
              >
                {k}
              </span>
            ))}
          </div>

          <div className="mb-1 text-[11px] tracking-wide text-surface2/70">
            SUGGESTED TWEAKS
          </div>
          <ul>
            {TWEAKS.map((t, i) => (
              <li
                key={t}
                className={cn(
                  "relative mb-1.5 pl-3.5 text-[12.5px] text-surface2 transition-all duration-400 before:absolute before:left-0 before:text-stamp-applied before:content-['—']",
                  visibleTweaks[i]
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-2 opacity-0"
                )}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}