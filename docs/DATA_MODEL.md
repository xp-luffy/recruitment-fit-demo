# Data Model

## candidates
- id: uuid (pk)
- name: text
- role_applied: text
- source: text (nullable)
- status: text default 'active'
- overall_score: numeric (nullable, computed)
- user_id: uuid (nullable)
- created_at: timestamptz

## rubrics
- id: uuid (pk)
- name: text
- role: text (nullable)
- user_id: uuid (nullable)
- created_at: timestamptz

## criteria
- id: uuid (pk)
- rubric_id: uuid (fk → rubrics.id)
- name: text (e.g. Culture Fit, Capability Fit, Potential Fit)
- description: text (nullable)
- weight: numeric (default 1.0)
- keywords: text[] (nullable, for rule-based matching)
- created_at: timestamptz

## evaluations
- id: uuid (pk)
- candidate_id: uuid (fk → candidates.id)
- rubric_id: uuid (fk → rubrics.id)
- eval_type: text ('cv' | 'interview')
- raw_text: text
- total_score: numeric (nullable, computed)
- scoring_mode: text ('rule' | 'ai')
- user_id: uuid (nullable)
- created_at: timestamptz

## scores
- id: uuid (pk)
- evaluation_id: uuid (fk → evaluations.id)
- criterion_id: uuid (fk → criteria.id)
- value: numeric (0–5)
- justification: text (nullable)
- source: text ('rule' | 'ai' | 'manual')
- confidence: numeric (nullable, AI only)
- review_status: text default 'unreviewed'
- created_at: timestamptz

## RLS
All tables: RLS enabled, permissive v1 policies (select/insert/update/delete open) for demo. Lock-down sprint replaces with `auth.uid() = user_id`.

## Relationships
- rubric 1→N criteria
- candidate 1→N evaluations
- evaluation 1→N scores (one per criterion in its rubric)
