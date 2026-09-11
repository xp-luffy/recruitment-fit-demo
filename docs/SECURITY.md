# Security

## Secret Handling
- AI API keys in Supabase env / Vercel env only — never in client code or chat.
- All AI calls server-side (`lib/ai/`); client never sees the key.

## Permission Model
- v1 demo: permissive RLS — anonymous can read/write demo data (no login wall).
- Lock-down sprint: `auth.uid() = user_id` on all tables; demo rows assigned to a seed user.
- Agent (AI scoring) inherits the calling user's permissions; no elevated service role in client paths.

## Approved-Tools Rule
- Only named, narrow server functions (e.g. `scoreEvaluationAI`) may call the AI API.
- No raw `run_any` / `send_any` / arbitrary prompt execution.
- Each tool returns structured errors: `{ retryable: bool, reason: string }`.

## Audit Principle
- Every state-changing action (save scores, delete candidate, accept AI suggestion) writes an audit_logs row.
- Audit table is append-only; RLS denies deletes even in v1.

## What Could NOT Be Verified in v1
- Rate-limiting on AI endpoints (no auth yet) — add at lock-down.
- PII exposure in pasted transcripts — advise demo data only until auth is on.
