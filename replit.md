# Student Mentor AI

An AI-driven predictive analytics platform for educational quality assurance. Processes 6,607 real student performance records with ML-powered score prediction, role-based dashboards, and an AI study mentor chatbot.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/student-mentor-ai run dev` — run the frontend (port 24000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + Recharts
- API: Express 5 + csv-parse
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract source of truth
- `artifacts/api-server/src/routes/` — Express route handlers (auth, analytics, predict, chat)
- `artifacts/api-server/src/lib/dataLoader.ts` — CSV loader with in-memory cache
- `artifacts/api-server/src/lib/mlModel.ts` — Weighted linear ML prediction model
- `artifacts/api-server/data/StudentPerformanceFactors.csv` — 6,607 student records
- `artifacts/student-mentor-ai/src/pages/` — React pages (login, student, teacher, admin)
- `artifacts/student-mentor-ai/src/hooks/use-auth.tsx` — Role-based auth with localStorage

## Architecture decisions

- All data is served from a CSV file loaded at server start and cached in memory — no database needed since the dataset is static.
- ML prediction uses a calibrated weighted linear model in pure TypeScript (no Python/scikit-learn dependency).
- Authentication is simple role-based (student/teacher/admin) using base64 tokens — no JWT library needed for this use case.
- `useLocation` is used only at the component level (not inside custom hooks) to avoid wouter context issues.

## Product

Three role-based portals:
1. **Student Workspace** — AI score prediction with sliders and gauge chart, personalised study recommendations, AI mentor chatbot
2. **Teacher & Admin Command Center** — cohort analytics, interactive score distribution histogram, at-risk student tracker, factor analysis charts
3. **IT Specialist Diagnostics** — dataset pipeline logs, raw data viewer with pagination/search, data integrity report

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `useLocation` (wouter) must NOT be called inside custom hooks — only directly in components. Calling it inside `useAuth` caused "Invalid hook call" errors.
- CSV path resolution tries multiple candidates at startup to handle dev vs production path differences.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
