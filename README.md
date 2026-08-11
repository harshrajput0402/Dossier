# Dossier — job application tracker

## What's built so far

- Design tokens (`tailwind.config.ts`, `globals.css`) — the case-file /
  ink-stamp palette, light + dark, wired through Tailwind + `next-themes`.
- Prisma schema (`prisma/schema.prisma`) — User/Account/Session (for
  Auth.js) plus Application and Note, with per-user data isolation.
- Landing page (`src/app/page.tsx` + `src/components/landing/*`) — fully
  built out from the mockup: hero, problem cards, how-it-works, AI
  spotlight, footer CTA.
- Theme toggle (`src/components/theme/ThemeToggle.tsx`) — bottom-right,
  clears the mobile bottom nav automatically.

## Not built yet (next steps)

- Auth pages + Auth.js config (`src/lib/auth.ts`, `/login`, `/signup`)
- Dashboard layout (sidebar + mobile bottom nav) and the kanban board with
  `@dnd-kit` drag-and-drop
- `/api/applications` routes (CRUD)
- `/api/ai/match` route — the Groq call for JD-vs-resume scoring
- The "Add Application" modal with the AI match panel

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in DATABASE_URL, AUTH_SECRET, GROQ_API_KEY
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000 — you should see the landing page.
