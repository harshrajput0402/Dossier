// Destination: src/components/landing/HowItWorks.tsx
// This replaces the earlier version — adds a scroll-linked connector line
// and per-step reveal animation (matches the approved preview).
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Log the application",
    body: "Paste the job link or description in. We pull out the company, role, and requirements automatically.",
  },
  {
    title: "Get your match score",
    body: "Your resume is compared against the JD instantly — see your score and exactly which keywords are missing.",
  },
  {
    title: "Move it through the pipeline",
    body: "Drag it from Applied to Interview to Offer. Every change is timestamped in the application's file.",
  },
  {
    title: "Get nudged when it stalls",
    body: "No response after 10 days? Dossier surfaces it on your dashboard so nothing falls through.",
  },
];

export function HowItWorks() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    STEPS.map(() => false)
  );

  // connector line height tracks actual scroll position
  useEffect(() => {
    function onScroll() {
      const wrap = wrapRef.current;
      const line = lineRef.current;
      if (!wrap || !line) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.35;
      let progress = (start - rect.top) / (rect.height + (start - end));
      progress = Math.max(0, Math.min(1, progress));
      line.style.height = `${progress * rect.height}px`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // each step reveals individually as it enters view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="mx-auto max-w-[1100px] px-8 py-20">
      <div id="how" className="scroll-mt-20">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          The process
        </div>
        <h2 className="mb-12 max-w-[26ch] text-3xl font-bold">
          From &ldquo;just applied&rdquo; to &ldquo;got the offer,&rdquo; in
          one file.
        </h2>

        <div ref={wrapRef} className="relative pl-2">
          <div
            ref={lineRef}
            className="absolute left-[26px] top-1.5 w-0.5 bg-accent"
            style={{ height: 0 }}
          />
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className={cn(
                "grid grid-cols-[52px_1fr] gap-5 py-5 transition-all duration-500",
                visibleSteps[i]
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-3 opacity-0"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 bg-surface font-mono text-xs font-bold transition-all duration-300",
                  visibleSteps[i]
                    ? "scale-105 border-accent text-accent"
                    : "border-border text-text-soft"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="rounded-md border border-transparent px-3.5 py-2.5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-border hover:bg-surface hover:shadow-pop">
                <h3 className="mb-1 text-lg font-semibold">{s.title}</h3>
                <p className="max-w-[55ch] text-[14.5px] text-text-soft">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}