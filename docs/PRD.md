# Recruitment Fit Scorer — PRD

## Problem
HR teams and hiring managers qualify candidates via Excel sheets and gut feel. There is no fast, consistent way to score CVs and interview transcripts against the criteria that actually matter for fit.

## Target User
HR team members and hiring managers running a hiring loop — the same person who today maintains a spreadsheet of candidates and scores.

## Core Objects
- **Candidate** — person under consideration (name, role applied for, source, status).
- **Evaluation** — one scoring pass for a candidate against a rubric (type: cv or interview, raw text, transcript, or file ref).
- **Criterion** — a scored dimension (Culture Fit, Capability Fit, Potential Fit) with a weight and a 0–5 scale.
- **Score** — a per-criterion numeric value within an Evaluation, with optional AI-generated justification.
- **Rubric** — a reusable set of weighted criteria for a role.

## MVP (v1) Checklist
- [ ] Create/edit/delete Candidates
- [ ] Create/edit Rubrics with weighted criteria (Culture / Capability / Potential at minimum)
- [ ] Paste a CV or interview transcript text into an Evaluation
- [ ] Rule-based scoring engine computes weighted fit score per Evaluation
- [ ] Candidate detail page shows all Evaluations + overall fit score + per-criterion breakdown
- [ ] Candidate list ranked by overall fit score
- [ ] AI-assisted scoring (optional toggle) pre-fills per-criterion scores with confidence + review_status
- [ ] Demo data seeded so app renders for anonymous visitors — no login wall

## Non-Goals (v1)
- Payroll, offers, onboarding
- Performance management / reviews
- LinkedIn scraping or external sourcing
- Multi-tenant org accounts
- Email/scheduling integration

## Success Criteria
A hiring manager pastes an interview transcript for a candidate, runs the scorer, sees a weighted fit score (0–100) broken down by Culture / Capability / Potential, and the candidate moves up or down the ranked list — all without signing in.
