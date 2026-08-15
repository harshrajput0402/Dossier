# Dossier

**A job application tracker that keeps every application, status change, and follow-up in one place — and scores your resume against each job before you hit send.**

Built with Next.js, PostgreSQL, and AI-powered resume matching.

---

## Features

### Core tracking
- **Kanban board** — drag and drop applications through Applied → Interview → Offer → Rejected, with changes persisted instantly
- **Application detail view** — full job description, notes/timeline, editable company/role/job link, status changes, delete
- **Stale-application reminders** — flags anything sitting in "Applied" with no update in 10+ days, sorts it to the top of its column, and surfaces a summary banner
- **Live search** — filter the board by company or role as you type
- **Export** — download all applications as CSV or Excel (.xlsx) from the sidebar

### AI matching
- Paste a job description and get an instant **match score (0–100%)** against your resume
- See exactly which **keywords are missing** vs. already covered
- Get **specific suggested tweaks** to close the gap
- **Multi-resume support** — upload multiple resumes (PDF or DOCX, text auto-extracted), label each one (e.g. "Frontend," "Backend"), and pick which to match against per application. Remembers your last choice.

### Auth & accounts
- Email/password signup and login (hashed with bcrypt)
- Protected routes — dashboard, analytics, and settings all require login
- Fully multi-user, with all data scoped per account
- Edit profile (name + password change) from an account menu in the sidebar

### Analytics
- Total applications, response rate, average match score, average response time
- Weekly application-volume chart
- Status breakdown chart

### Design
- Fully responsive — desktop sidebar, tablet icon rail, mobile bottom nav
- Light/dark theme toggle available on every page
- A distinctive "case file" visual identity (ink-stamp status badges, manila-folder accents) used consistently across the whole app

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (via Neon) |
| ORM | Prisma |
| Auth | Auth.js (NextAuth v5), Credentials provider |
| AI | Groq API (Llama 3.3) |
| Drag & drop | dnd-kit |
| Charts | Recharts |
| Resume parsing | unpdf (PDF), mammoth (DOCX) |
| Spreadsheet export | xlsx (SheetJS) |
| Icons | lucide-react |
| Deployment | Vercel |

---

## Getting started

### 1. Clone and install
```bash
git clone https://github.com/harshrajput0402/Dossier
cd dossier
npm install
```

### 2. Set up environment variables
Copy the example file and fill in your own values:
```bash
cp .env.local.example .env
```

You'll need:
- `DATABASE_URL` — a PostgreSQL connection string (a free [Neon](https://neon.tech) database works well)
- `AUTH_SECRET` — generate with `npx auth secret`
- `GROQ_API_KEY` — free at [console.groq.com](https://console.groq.com)

> **Note:** Prisma's CLI reads from `.env`, while Next.js reads from both `.env` and `.env.local`. Keeping everything in a single `.env` file avoids conflicts.

### 3. Set up the database
```bash
npx prisma migrate dev --name init
```

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the landing page.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── (auth)/                  # Login, signup
│   ├── (dashboard)/             # Dashboard, analytics, settings (protected)
│   └── api/                     # Route handlers — auth, applications, resumes, ai, export
├── components/
│   ├── landing/                 # Hero, nav, how-it-works, AI spotlight, etc.
│   ├── dashboard/                # Sidebar, kanban board, modals
│   ├── settings/                 # Resume manager
│   ├── analytics/                 # Charts
│   └── theme/                    # Theme provider + toggle
├── lib/                          # Prisma client, auth config, AI logic, resume parsing, stale-check helper
└── types/                        # Shared TypeScript types

prisma/
└── schema.prisma                 # User, Application, Note, Resume models
```

---

## Deployment

Deployed on [Vercel](https://dossier-seven-teal.vercel.app). Key setup notes:

- Add `"postinstall": "prisma generate"` and change `"build"` to `"prisma migrate deploy && next build"` in `package.json`, so migrations run automatically on every deploy
- Set `DATABASE_URL`, `AUTH_SECRET`, and `GROQ_API_KEY` as environment variables in the Vercel project settings
- `next.config.js` excludes `mammoth` from webpack bundling (`serverComponentsExternalPackages`) — a fix for a known Next.js/CJS-library incompatibility

---

## Known limitations

- The AI daily rate limit (20 requests/user/day) is stored in-memory and resets on server restart or redeploy — fine for a single-user demo, not robust for production scale
- No automatic status-change history log — the detail view shows current status + manually added notes, not a full audit trail of every change
- Job posting auto-fill from a pasted URL isn't implemented — job details are entered manually or extracted from pasted description text via the AI matcher

---

## License

Personal portfolio project — not licensed for reuse without permission.