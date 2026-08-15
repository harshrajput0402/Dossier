// Destination: src/components/landing/HowItWorks.tsx
// Rebuilt from scratch — simpler and more robust than the previous
// version. Instead of continuously recalculating the connector line's
// height on every scroll event (fragile, hard to debug), a single
// IntersectionObserver triggers the whole reveal once, and CSS
// transitions (with staggered delays) handle the rest. Visually similar
// "drawing in" effect, far less error-prone.
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-[1100px] px-8 py-20">
      <div id="how" ref={sectionRef} className="scroll-mt-20">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          The process
        </div>
        <h2 className="mb-12 max-w-[26ch] text-3xl font-bold">
          From &ldquo;just applied&rdquo; to &ldquo;got the offer,&rdquo; in
          one file.
        </h2>

        <div className="relative pl-2">
          <div
            className="absolute left-[26px] top-1.5 w-0.5 bg-accent transition-[height] duration-[1300ms] ease-out"
            style={{ height: active ? "calc(100% - 24px)" : "0px" }}
          />

          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className={cn(
                "grid grid-cols-[52px_1fr] gap-5 py-5 transition-all duration-500 ease-out",
                active
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-3 opacity-0"
              )}
              style={{ transitionDelay: active ? `${i * 150}ms` : "0ms" }}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 bg-surface font-mono text-xs font-bold transition-colors duration-300",
                  active
                    ? "border-accent text-accent"
                    : "border-border text-text-soft"
                )}
                style={{
                  transitionDelay: active ? `${i * 150 + 200}ms` : "0ms",
                }}
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