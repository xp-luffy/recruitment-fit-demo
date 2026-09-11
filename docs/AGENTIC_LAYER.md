# Agentic Layer

## Risk Levels

### Low (auto)
- AI pre-fills scores + justification for review — no state change committed without user confirm.
- Auto-tag evaluation eval_type from raw text.

### Medium (light approval)
- Save AI-suggested scores to an Evaluation — user clicks "Accept" to persist.
- Update candidate status to 'shortlisted' from a scored evaluation — user confirms.

### High (always approval)
- Publish/share a candidate's evaluation summary externally.
- Export candidate data to CSV (PII egress).

### Critical (human-only)
- Delete a candidate and all evaluations.
- Bulk delete rubrics.

## Named Tools (v1)
- `scoreEvaluationAI` — low risk, returns suggested scores only.
- `saveScores` — medium risk, persists accepted scores.
- `deleteCandidate` — critical risk, human-only.

## Audit Log Fields
- id, actor (user_id or 'system'), action, target_type, target_id, detail (jsonb), created_at.
- v1: log saveScores and deleteCandidate.

## v1 vs Later
- v1: AI suggest + manual accept + delete (human-only).
- Later: auto-shortlist draft, scheduled re-score, external share with approval.
