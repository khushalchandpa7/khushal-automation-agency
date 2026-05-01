# Khushal Automation Agency

Full-stack marketing site for a custom workflow automation agency. Primary CTA: book a Discovery Call.

## Stack

- **Frontend** (`frontend/`): React 19 + Vite 8, Tailwind CSS v3, GSAP (ScrollTrigger / TextPlugin / ScrollToPlugin), Lucide React, Zustand, axios
- **Backend** (`backend/`): Node.js + Express 5, Zod 4, Prisma 6
- **Database**: PostgreSQL

## Local development

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ running locally (or a connection string to a hosted DB)

### Setup

```bash
# Backend (terminal 1)
cd backend
npm install
cp .env.example .env           # edit DATABASE_URL to point at your local DB
npx prisma migrate dev         # creates Lead + PortfolioProject tables
npm run prisma:seed            # seeds 4 example portfolio projects
npm run dev                    # http://localhost:4000

# Frontend (terminal 2)
cd frontend
npm install
cp .env.example .env           # VITE_API_URL=http://localhost:4000
npm run dev                    # http://localhost:5173
```

### Health check
```bash
curl http://localhost:4000/health
# → { "ok": true }
```

### Inspect the database
```bash
cd backend
npx prisma studio              # GUI at http://localhost:5555
```

## Project structure

```
.
├── frontend/                  # Vite + React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Nav, Footer
│   │   │   ├── sections/      # Hero, PainSolution, Services, Portfolio, Process, LeadForm
│   │   │   └── ui/            # Button, BentoCard, SectionWrap
│   │   ├── hooks/             # useEntrance (GSAP fade-up)
│   │   ├── lib/               # api.js (axios), gsap.js (plugin registration)
│   │   └── store/             # leadStore.js (Zustand)
│   └── tailwind.config.js     # locked design tokens
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Lead + PortfolioProject
│   │   ├── migrations/
│   │   └── seed.js
│   └── src/
│       ├── index.js           # Express boot, CORS, route mounts
│       ├── lib/prisma.js      # Prisma client singleton
│       ├── middleware/        # validate.js (Zod)
│       ├── routes/            # leads.js (POST /api/leads), portfolio.js
│       └── schemas/           # lead.schema.js (Zod)
└── README.md
```

## Design system

- Background: `#F9F9F6` (warm off-white)
- Ink: `#111111` (stark black)
- Accent mint: `#00D9A3` (primary CTAs)
- Accent tangerine: `#FF6B35` (hovers, secondary highlights)
- Font: Inter (400 / 500 / 600 / 700)
- Layout primitive: Bento Box grid (sm / md / lg / wide / tall × default / ink / mint / tangerine tones)
- Animations: GSAP-driven (typing-and-zapping hero, ScrollTrigger pin on Pain/Solution, elastic spring on card hover, section entrance fade-ups). Honors `prefers-reduced-motion`.

## API

| Method | Path             | Body                                      | Response                                         |
|--------|------------------|-------------------------------------------|--------------------------------------------------|
| GET    | `/health`        | —                                         | `{ "ok": true }`                                 |
| GET    | `/api/portfolio` | —                                         | `PortfolioProject[]` sorted by title             |
| POST   | `/api/leads`     | `{ name, email, company?, painPoints }`   | `201` with new lead, or `400` with field errors  |

The lead form has a hidden `website` honeypot field — bots that fill it get a believable `201` with no DB write.

## Deployment

### Frontend → Vercel or Netlify

The frontend is a static Vite build (`npm run build` produces `frontend/dist/`).

**Vercel** (recommended):
1. Import the repo in Vercel.
2. Set the **Root Directory** to `frontend`.
3. Build command: `npm run build` · Output directory: `dist`.
4. Add env var `VITE_API_URL=https://<your-backend-url>`.

**Netlify**: similar — base directory `frontend`, build `npm run build`, publish `dist`.

### Backend → Railway or Render

Both platforms run the Node app and provision a managed PostgreSQL.

1. Create a new web service from the repo, set **Root Directory** to `backend`.
2. Build command: `npm install && npx prisma generate`
3. Start command: `npm start`
4. Provision a Postgres instance and copy its connection string into the env var `DATABASE_URL`.
5. Set `PORT` (Railway/Render usually inject this), and `CORS_ORIGIN=https://<your-frontend-url>`.
6. After the first deploy, run `npx prisma migrate deploy` from the platform's shell (Railway: `railway run npx prisma migrate deploy`; Render: use the shell tab).
7. Optional: run `node prisma/seed.js` once to load the example portfolio projects.

### Environment variables

**`frontend/.env`**
```
VITE_API_URL=http://localhost:4000        # in prod, your backend URL
```

**`backend/.env`**
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public
PORT=4000
CORS_ORIGIN=http://localhost:5173         # in prod, your frontend URL
```
