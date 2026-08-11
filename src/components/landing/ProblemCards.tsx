import { Reveal } from "./Reveal";

const CARDS = [
  {
    num: "FILE 01",
    title: "The follow-up you forgot",
    body: "A recruiter goes quiet for two weeks and you never notice. Dossier flags applications that have gone stale so you know exactly who to nudge.",
  },
  {
    num: "FILE 02",
    title: "The JD you half-read",
    body: "You apply fast and skim the requirements. Our matcher reads the job description properly and tells you what you're missing before you submit.",
  },
  {
    num: "FILE 03",
    title: "The tracker with 40 tabs",
    body: "One spreadsheet, one Notion doc, one sticky note pile. Dossier is the single place every application actually lives.",
  },
];

export function ProblemCards() {
  return (
    <Reveal className="mx-auto max-w-[1100px] px-8 py-20">
      <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
        The problem with the spreadsheet
      </div>
      <h2 className="mb-12 max-w-[26ch] text-3xl font-bold">
        You&apos;re not disorganized. You&apos;re tracking a job hunt with the
        wrong tools.
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {CARDS.map((c) => (
          <div
            key={c.num}
            className="rounded border-[1.5px] border-text bg-surface p-6"
          >
            <div className="mb-8 font-mono text-xs text-text-soft">
              {c.num}
            </div>
            <h3 className="mb-2.5 text-lg font-semibold">{c.title}</h3>
            <p className="text-[14.5px] text-text-soft">{c.body}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
