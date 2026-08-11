import { Reveal } from "./Reveal";

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
  return (
    <Reveal className="mx-auto max-w-[1100px] px-8 py-20" >
      <div id="how" className="scroll-mt-20">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          The process
        </div>
        <h2 className="mb-12 max-w-[26ch] text-3xl font-bold">
          From &ldquo;just applied&rdquo; to &ldquo;got the offer,&rdquo; in
          one file.
        </h2>
        <div className="border-t-[1.5px] border-text">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="grid grid-cols-[50px_1fr] gap-6 border-b-[1.5px] border-text py-7 sm:grid-cols-[90px_1fr]"
            >
              <div className="pt-0.5 font-mono text-[13px] text-accent">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="mb-1.5 text-[19px] font-semibold">
                  {s.title}
                </h3>
                <p className="max-w-[60ch] text-[15px] text-text-soft">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
