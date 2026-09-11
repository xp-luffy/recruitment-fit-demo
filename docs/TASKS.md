# Tasks

## Sprint 1 — Data + Core Engine
Goal: DB schema, data-access layer, rule-based scoring works end-to-end.
- [ ] Create Supabase migration (tables, RLS permissive, seed data)
- [ ] `lib/data/` typed queries for candidates, rubrics, criteria, evaluations, scores
- [ ] `lib/scoring/` rule-based engine (keyword match → 0–5, weighted average → total_score)
- [ ] Seed: 3 candidates, 1 rubric (Culture/Capability/Potential), 2 evaluations with scores
- **DoD:** A query for candidates returns ranked list by overall_score; scoring function computes a total from raw_text + rubric.

## Sprint 2 — Candidate + Rubric CRUD UI
Goal: Create, view, edit, delete candidates and rubrics — no login.
- [ ] Candidates list page (ranked, 5 states: loading/empty/error/partial/ready)
- [ ] Candidate create/edit form, delete (confirm)
- [ ] Rubrics list + create/edit (criteria with weights + keywords)
- [ ] Sidebar nav shell (desktop sidebar / mobile hamburger)
- **DoD:** User creates a candidate and a rubric with 3 weighted criteria via the UI; data persists and shows on reload.

## Sprint 3 — Evaluation + Scoring Flow (v1 FUNCTIONAL)
Goal: Paste CV/transcript, run scorer, see fit score, candidate re-ranks.
- [ ] Evaluation create page: pick candidate + rubric, paste raw_text, eval_type
- [ ] "Run Scoring" → rule-based scores saved, total_score computed, candidate.overall_score updated
- [ ] Candidate detail page: evaluations list + per-criterion breakdown + total
- [ ] Candidate list re-ranks on new evaluation
- [ ] Handle empty raw_text error, loading state, partial (missing rubric) state
- **DoD:** Success scenario — paste transcript, run scorer, see weighted fit score 0–100, candidate moves in ranked list. **v1 functional milestone.**

## Sprint 4 — AI-Assisted Scoring
Goal: Optional AI pre-fill with confidence + review routing.
- [ ] `lib/ai/` module: strict JSON schema, nullable fields, validation + retry
- [ ] AI toggle on Evaluation page → suggested scores with source='ai', confidence, review_status='unreviewed'
- [ ] Low-confidence ( <0.6) scores flagged for review in UI
- [ ] "Accept" button persists suggested scores (medium-risk approval)
- [ ] Audit log for accept action
- **DoD:** AI toggle returns valid scores or routes to review; accepting persists and re-ranks list.

## Sprint 5 — Lock It Down
Goal: Auth + per-user isolation.
- [ ] Supabase auth (email) — login/signup pages
- [ ] Replace permissive RLS with `auth.uid() = user_id` policies
- [ ] Assign seed rows to a demo user
- [ ] Gate write actions behind login; reads still open for demo where appropriate
- **DoD:** Logged-out user sees read-only demo; logged-in user sees only their own candidates/rubrics.

## Gantt
```
S1 ██
S2   ██
S3     ██  ← v1 functional
S4       ██
S5         ██
```
