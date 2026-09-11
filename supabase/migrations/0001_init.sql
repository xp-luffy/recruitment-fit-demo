create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_applied text not null,
  source text,
  status text not null default 'active',
  overall_score numeric,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table candidates enable row level security;
drop policy if exists "candidates_v1_read" on candidates;
create policy "candidates_v1_read" on candidates for select using (true);
drop policy if exists "candidates_v1_write" on candidates;
create policy "candidates_v1_write" on candidates for all using (true) with check (true);

create table if not exists rubrics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table rubrics enable row level security;
drop policy if exists "rubrics_v1_read" on rubrics;
create policy "rubrics_v1_read" on rubrics for select using (true);
drop policy if exists "rubrics_v1_write" on rubrics;
create policy "rubrics_v1_write" on rubrics for all using (true) with check (true);

create table if not exists criteria (
  id uuid primary key default gen_random_uuid(),
  rubric_id uuid not null references rubrics(id) on delete cascade,
  name text not null,
  description text,
  weight numeric not null default 1.0,
  keywords text[],
  created_at timestamptz not null default now()
);
alter table criteria enable row level security;
drop policy if exists "criteria_v1_read" on criteria;
create policy "criteria_v1_read" on criteria for select using (true);
drop policy if exists "criteria_v1_write" on criteria;
create policy "criteria_v1_write" on criteria for all using (true) with check (true);

create table if not exists evaluations (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  rubric_id uuid not null references rubrics(id) on delete restrict,
  eval_type text not null check (eval_type in ('cv','interview')),
  raw_text text not null,
  total_score numeric,
  scoring_mode text not null default 'rule',
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table evaluations enable row level security;
drop policy if exists "evaluations_v1_read" on evaluations;
create policy "evaluations_v1_read" on evaluations for select using (true);
drop policy if exists "evaluations_v1_write" on evaluations;
create policy "evaluations_v1_write" on evaluations for all using (true) with check (true);

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references evaluations(id) on delete cascade,
  criterion_id uuid not null references criteria(id) on delete cascade,
  value numeric not null check (value >= 0 and value <= 5),
  justification text,
  source text not null default 'manual',
  confidence numeric,
  review_status text not null default 'unreviewed',
  created_at timestamptz not null default now()
);
alter table scores enable row level security;
drop policy if exists "scores_v1_read" on scores;
create policy "scores_v1_read" on scores for select using (true);
drop policy if exists "scores_v1_write" on scores;
create policy "scores_v1_write" on scores for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  target_type text not null,
  target_id uuid,
  detail jsonb,
  created_at timestamptz not null default now()
);
alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for insert with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on candidates, rubrics, criteria, evaluations, scores to anon, authenticated;
grant select, insert on audit_logs to anon, authenticated;

insert into rubrics (id, name, role) values
  ('11111111-1111-1111-1111-111111111111', 'Engineering Hire', 'Senior Backend Engineer')
on conflict (id) do nothing;

delete from scores
where evaluation_id in (
  '33333333-3333-3333-3333-333333333331',
  '33333333-3333-3333-3333-333333333332'
);

delete from criteria
where rubric_id = '11111111-1111-1111-1111-111111111111';

insert into criteria (id, rubric_id, name, description, weight, keywords) values
  ('44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', 'Culture Fit', 'Alignment with team values and collaboration style', 1.0, array['team','collaborat','values','ownership','help']),
  ('44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111', 'Capability Fit', 'Technical depth and relevant experience', 2.0, array['system','scale','architecture','debug','performance','api','database']),
  ('44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111', 'Potential Fit', 'Growth mindset and learning trajectory', 1.0, array['learn','growth','curious','adapt','mentor','improve'])
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  weight = excluded.weight,
  keywords = excluded.keywords;

insert into candidates (id, name, role_applied, source, status, overall_score) values
  ('22222222-2222-2222-2222-222222222221', 'Amara Okafor', 'Senior Backend Engineer', 'Referral', 'active', 82),
  ('22222222-2222-2222-2222-222222222222', 'Daniel Chen', 'Senior Backend Engineer', 'LinkedIn', 'active', 68),
  ('22222222-2222-2222-2222-222222222223', 'Priya Nair', 'Senior Backend Engineer', 'Agency', 'active', 55)
on conflict (id) do nothing;

insert into evaluations (id, candidate_id, rubric_id, eval_type, raw_text, total_score, scoring_mode) values
  ('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'interview', 'Amara discussed scaling a payments system to 10M users. Talked about team ownership and mentoring juniors. Strong on system design and debugging production incidents.', 82, 'rule'),
  ('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'cv', 'Daniel has 6 years building REST APIs and working with Postgres. Mentioned interest in learning distributed systems.', 68, 'rule')
on conflict (id) do nothing;

insert into scores (evaluation_id, criterion_id, value, justification, source, confidence, review_status) values
  ('33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', 4, 'Strong ownership and mentoring language detected', 'rule', null, 'unreviewed'),
  ('33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444442', 5, 'Deep system design and production debugging experience', 'rule', null, 'unreviewed'),
  ('33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444443', 4, 'Continuous learning and adaptation evident', 'rule', null, 'unreviewed'),
  ('33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444441', 3, 'Standard team collaboration, limited detail', 'rule', null, 'unreviewed'),
  ('33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444442', 4, 'Solid API and database experience', 'rule', null, 'unreviewed'),
  ('33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444443', 3, 'Interest in learning noted but limited evidence', 'rule', null, 'unreviewed')
on conflict do nothing;
