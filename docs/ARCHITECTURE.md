# Architecture

## Stack
- Next.js (App Router, TypeScript) + Supabase (Postgres) + Vercel.
- AI scoring via OpenAI-compatible API from a server module only.

## Build Sequencing
**Now (v1):** Candidate CRUD, Rubric CRUD, Evaluation + scoring engine, ranked candidate list, AI-assisted scoring toggle.
**Next:** Multiple rubrics per role, CSV import/export, evaluation comparison view.
**Later:** Auth + per-user isolation, team sharing, interview template library, automated shortlist drafting.

## Key User Action Flow
1. Hiring manager opens Candidates, creates or selects a candidate.
2. Adds an Evaluation — chooses rubric, pastes CV or transcript text.
3. Scoring engine runs: rule-based first (keyword/section matching), AI-assisted if toggled.
4. Per-criterion scores + weighted total persist to DB with source/confidence/review_status.
5. Candidate list re-ranks by overall fit score.

## Nav Shell
Persistent left sidebar on desktop (Candidates, Rubrics, Evaluations) collapsing to hamburger on mobile. Current section highlighted.

## Layer Plan
1. **Data layer** — Postgres tables, RLS permissive for demo, typed data-access module (`lib/data/`).
2. **App logic** — scoring engine (`lib/scoring/`), evaluation flows in server actions.
3. **Intelligence** — AI scoring module (`lib/ai/`) with strict output schema, confidence routing to review.

## Core Without AI
Rule-based scoring (keyword presence, section detection, weighted average) runs the full loop end-to-end. AI-assisted scoring is an additive toggle.

## Repo Structure
```
app/             # routes/pages (feature-oriented)
  candidates/
  rubrics/
  evaluations/
components/      # shared UI
lib/
  data/         # all DB reads/writes (Supabase client, typed queries)
  scoring/      # rule-based + weighted engine
  ai/           # AI scoring module, schema validation
  types/        # shared TS types
tests/           # beside features
supabase/migrations/
```

## Module Map
| Module | Responsibility | Owns | Build Order |
|---|---|---|---|
| data | All DB access | candidates, rubrics, evaluations, scores | 1 |
| scoring | Weighted fit-score computation | score calculation logic | 2 |
| candidates | Candidate CRUD + list/rank UI | candidate pages | 3 |
| rubrics | Rubric + criterion CRUD | rubric pages | 4 |
| evaluations | Evaluation entry + run-score flow | evaluation pages, scoring trigger | 5 |
| ai | AI-assisted scoring | AI scoring calls + validation | 6 |
