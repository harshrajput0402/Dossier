// Destination: src/components/landing/Hero.tsx
// This replaces the earlier version — full redesign approved via preview:
// fanned scattered case-file cards, line-by-line headline reveal,
// count-up "live" badge, and a sequential animated status pipeline.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HEADLINE_LINES = ["Every application,", "filed. Every follow-up,"];

const FILE_CARDS = [
  {
    i: 3,
    co: "Notion",
    role: "Product Engineer",
    status: "Rejected",
    statusClass: "text-stamp-rejected",
    days: "Closed",
  },
  {
    i: 2,
    co: "Stripe",
    role: "SWE, Platform",
    status: "Offer",
    statusClass: "text-stamp-offer",
    days: "Offer received",
  },
  {
    i: 1,
    co: "Linear",
    role: "Full Stack Dev",
    status: "Applied",
    statusClass: "text-stamp-applied",
    days: "4 days ago",
  },
  {
    i: 0,
    co: "Vercel",
    role: "Frontend Engineer",
    status: "Interview",
    statusClass: "text-stamp-interview",
    days: "Round 2 · Fri",
  },
];

const CARD_TRANSFORM: Record<number, { rest: string; in: string }> = {
  0: {
    rest: "translate(-40px, 40px) rotate(-9deg)",
    in: "translate(-52px, 64px) rotate(-11deg)",
  },
  1: {
    rest: "translate(-10px, 20px) rotate(-3deg)",
    in: "translate(-16px, 30px) rotate(-4deg)",
  },
  2: {
    rest: "translate(20px, 6px) rotate(2deg)",
    in: "translate(20px, 4px) rotate(3deg)",
  },
  3: {
    rest: "translate(46px, -10px) rotate(7deg)",
    in: "translate(54px, -24px) rotate(8deg)",
  },
};

export function Hero() {
  const [headlineIn, setHeadlineIn] = useState(false);
  const [cardsIn, setCardsIn] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [pipeline, setPipeline] = useState({
    track0: false,
    step1: false,
    track1: false,
    step2: false,
  });

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setHeadlineIn(true), 150));
    timers.push(setTimeout(() => setCardsIn(true), 500));

    timers.push(
      setTimeout(() => {
        const target = 47;
        const startTime = performance.now();
        function tick(now: number) {
          const t = Math.min(1, (now - startTime) / 900);
          const eased = 1 - Math.pow(1 - t, 3);
          setCount(Math.round(eased * target));
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }, 300)
    );

    timers.push(
      setTimeout(() => {
        setPipeline((p) => ({ ...p, track0: true }));
        timers.push(
          setTimeout(() => {
            setPipeline((p) => ({ ...p, step1: true }));
            timers.push(
              setTimeout(() => {
                setPipeline((p) => ({ ...p, track1: true }));
                timers.push(
                  setTimeout(() => {
                    setPipeline((p) => ({ ...p, step2: true }));
                  }, 600)
                );
              }, 200)
            );
          }, 600)
        );
      }, 1300)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-center gap-12 px-8 py-16 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:py-[70px]">
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stamp-applied/35 bg-stamp-applied/10 px-3 py-1.5 font-mono text-[11.5px] tracking-wide text-stamp-applied">
          <span className="h-1.5 w-1.5 animate-[livepulse_1.6s_ease-in-out_infinite] rounded-full bg-stamp-applied" />
          NOW TRACKING <span>{count}</span> OPEN CASES
        </div>

        <h1 className="mb-5 text-4xl font-extrabold leading-[1.06] tracking-tight md:text-[54px]">
          {HEADLINE_LINES.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span
                className={cn(
                  "block transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
                  headlineIn ? "translate-y-0" : "translate-y-[110%]"
                )}
              >
                {line}
              </span>
            </span>
          ))}
          <span className="block overflow-hidden">
            <span
              className={cn(
                "block italic text-accent transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
                headlineIn ? "translate-y-0" : "translate-y-[110%]"
              )}
            >
              remembered.
            </span>
          </span>
        </h1>

        <p className="mb-7 max-w-[46ch] text-lg leading-relaxed text-text-soft">
          Stop losing track of who you applied to. Dossier keeps every
          application, status change, and follow-up in one place — and
          scores your resume against the job before you hit send.
        </p>

        <div className="mb-8 flex flex-wrap items-center gap-3.5">
          <Link
            href="/signup"
            className="rounded border-[1.5px] border-text bg-text px-6 py-3 font-mono text-[13.5px] text-bg transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop active:scale-[0.96]"
          >
            Open your dossier
          </Link>
          <a
            href="#how"
            className="rounded border-[1.5px] border-text px-6 py-3 font-mono text-[13.5px] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop active:scale-[0.96]"
          >
            See how it works
          </a>
        </div>

        <div className="flex items-center font-mono text-[11px]">
          <div className="flex items-center gap-2 text-text-soft">
            <span className="h-2.5 w-2.5 rounded-full bg-stamp-offer" />
            <span className="uppercase tracking-wide">Applied</span>
          </div>
          <div className="relative mx-0 h-0.5 w-9 bg-border">
            <div
              className={cn(
                "absolute inset-0 bg-stamp-offer transition-all duration-500",
                pipeline.track0 ? "w-full" : "w-0"
              )}
            />
          </div>
          <div className="flex items-center gap-2 text-text-soft">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full border-2 transition-all duration-300",
                pipeline.step1
                  ? "scale-100 border-stamp-offer bg-stamp-offer"
                  : "scale-50 border-border bg-bg"
              )}
            />
            <span className="uppercase tracking-wide">Interview</span>
          </div>
          <div className="relative mx-0 h-0.5 w-9 bg-border">
            <div
              className={cn(
                "absolute inset-0 bg-stamp-offer transition-all duration-500",
                pipeline.track1 ? "w-full" : "w-0"
              )}
            />
          </div>
          <div className="flex items-center gap-2 text-text-soft">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full border-2 transition-all duration-300",
                pipeline.step2
                  ? "scale-100 border-accent bg-accent animate-[ringpulse_1.6s_ease-out_infinite]"
                  : "scale-50 border-border bg-bg"
              )}
            />
            <span className="uppercase tracking-wide">Offer</span>
          </div>
        </div>
      </div>

      <div className="relative h-[340px] md:h-[420px]">
        {FILE_CARDS.map((card) => {
          const isHovered = hoveredCard === card.i;
          const transform = !cardsIn
            ? CARD_TRANSFORM[card.i].rest
            : isHovered
              ? "translate(0px, -6px) rotate(0deg) scale(1.03)"
              : CARD_TRANSFORM[card.i].in;

          return (
            <div
              key={card.co}
              onMouseEnter={() => setHoveredCard(card.i)}
              onMouseLeave={() => setHoveredCard(null)}
              className={cn(
                "absolute left-[11%] top-[30px] w-[78%] rounded-lg border border-border bg-surface p-5 shadow-card transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
                cardsIn ? "opacity-100" : "opacity-0",
                isHovered && "shadow-card-hover"
              )}
              style={{
                zIndex: isHovered ? 20 : 4 - card.i,
                transform,
              }}
            >
              <div className="mb-0.5 text-base font-bold">{card.co}</div>
              <div className="mb-3 font-mono text-xs text-text-soft">
                {card.role}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "rounded border-2 border-current px-2.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-wide",
                    card.statusClass
                  )}
                >
                  {card.status}
                </span>
                <span className="font-mono text-[10.5px] text-text-soft">
                  {card.days}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}