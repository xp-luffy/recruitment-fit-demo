import { createClient } from "@/lib/supabase/server";
import type {
  Candidate,
  CandidateDetail,
  Criterion,
  CriterionInput,
  EvaluationWithScores,
  RubricWithCriteria,
} from "@/lib/types/recruitment";

function requireString(value: FormDataEntryValue | null, label: string) {
  const text = String(value ?? "").trim();
  if (!text) {
    throw new Error(`${label} is required.`);
  }
  return text;
}

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function splitKeywords(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function candidateFromForm(formData: FormData) {
  return {
    name: requireString(formData.get("name"), "Candidate name"),
    role_applied: requireString(formData.get("role_applied"), "Role applied"),
    source: optionalString(formData.get("source")),
    status: requireString(formData.get("status"), "Status"),
  };
}

export function rubricFromForm(formData: FormData) {
  const criteria: CriterionInput[] = [0, 1, 2].map((index) => ({
    id: optionalString(formData.get(`criteria_${index}_id`)) ?? undefined,
    name: requireString(formData.get(`criteria_${index}_name`), "Criterion name"),
    description: optionalString(formData.get(`criteria_${index}_description`)) ?? "",
    weight: Number(formData.get(`criteria_${index}_weight`) ?? 1),
    keywords: splitKeywords(formData.get(`criteria_${index}_keywords`)),
  }));

  if (criteria.some((criterion) => !Number.isFinite(criterion.weight) || criterion.weight <= 0)) {
    throw new Error("Criteria weights must be greater than 0.");
  }

  return {
    name: requireString(formData.get("name"), "Rubric name"),
    role: optionalString(formData.get("role")),
    criteria,
  };
}

export async function listCandidatesRanked() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("overall_score", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Candidate[];
}

export async function getCandidate(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("candidates").select("*").eq("id", id).single();

  if (error) throw error;
  return data as Candidate;
}

export async function getCandidateDetail(id: string): Promise<CandidateDetail> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("candidates")
    .select(
      `
        *,
        evaluations (
          *,
          rubric:rubrics (*),
          scores (
            *,
            criterion:criteria (*)
          )
        )
      `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const detail = data as CandidateDetail;
  detail.evaluations = (detail.evaluations ?? []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  detail.evaluations.forEach((evaluation) => {
    evaluation.scores = (evaluation.scores ?? []).sort(
      (a, b) => Number(b.criterion?.weight ?? 0) - Number(a.criterion?.weight ?? 0),
    );
  });

  return detail;
}

export async function listRubricsWithCriteria() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rubrics")
    .select("*, criteria (*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as RubricWithCriteria[]).map((rubric) => ({
    ...rubric,
    criteria: (rubric.criteria ?? []).sort((a, b) => Number(b.weight) - Number(a.weight)),
  }));
}

export async function getRubricWithCriteria(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rubrics")
    .select("*, criteria (*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  const rubric = data as RubricWithCriteria;
  return {
    ...rubric,
    criteria: (rubric.criteria ?? []).sort((a, b) => Number(b.weight) - Number(a.weight)),
  };
}

export async function createCandidate(payload: ReturnType<typeof candidateFromForm>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("candidates").insert(payload).select("id").single();

  if (error) throw error;
  await writeAudit("system", "create_candidate", "candidate", data.id, payload);
  return data.id as string;
}

export async function updateCandidate(id: string, payload: ReturnType<typeof candidateFromForm>) {
  const supabase = await createClient();
  const { error } = await supabase.from("candidates").update(payload).eq("id", id);

  if (error) throw error;
  await writeAudit("system", "update_candidate", "candidate", id, payload);
}

export async function deleteCandidate(id: string) {
  const supabase = await createClient();
  await writeAudit("system", "delete_candidate", "candidate", id, { id });
  const { error } = await supabase.from("candidates").delete().eq("id", id);

  if (error) throw error;
}

export async function createRubric(payload: ReturnType<typeof rubricFromForm>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rubrics")
    .insert({ name: payload.name, role: payload.role })
    .select("id")
    .single();

  if (error) throw error;

  await saveCriteria(data.id, payload.criteria);
  await writeAudit("system", "create_rubric", "rubric", data.id, payload);
  return data.id as string;
}

export async function updateRubric(id: string, payload: ReturnType<typeof rubricFromForm>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("rubrics")
    .update({ name: payload.name, role: payload.role })
    .eq("id", id);

  if (error) throw error;

  await saveCriteria(id, payload.criteria);
  await writeAudit("system", "update_rubric", "rubric", id, payload);
}

async function saveCriteria(rubricId: string, criteria: CriterionInput[]) {
  const supabase = await createClient();
  const existingIds = criteria.map((criterion) => criterion.id).filter(Boolean) as string[];

  if (existingIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("criteria")
      .delete()
      .eq("rubric_id", rubricId)
      .not("id", "in", `(${existingIds.join(",")})`);

    if (deleteError) throw deleteError;
  }

  const rows = criteria.map((criterion) => ({
    ...(criterion.id ? { id: criterion.id } : {}),
    rubric_id: rubricId,
    name: criterion.name,
    description: criterion.description || null,
    weight: criterion.weight,
    keywords: criterion.keywords,
  }));

  const { error } = await supabase.from("criteria").upsert(rows);
  if (error) throw error;
}

export async function createRuleEvaluation(formData: FormData) {
  const supabase = await createClient();
  const candidateId = requireString(formData.get("candidate_id"), "Candidate");
  const rubricId = requireString(formData.get("rubric_id"), "Rubric");
  const evalType = requireString(formData.get("eval_type"), "Evaluation type");
  const rawText = requireString(formData.get("raw_text"), "Paste CV or transcript text to score");

  const { scoreEvaluation } = await import("@/lib/scoring/rule-engine");
  const rubric = await getRubricWithCriteria(rubricId);
  const result = scoreEvaluation(rawText, rubric.criteria);

  const { data: evaluation, error: evaluationError } = await supabase
    .from("evaluations")
    .insert({
      candidate_id: candidateId,
      rubric_id: rubricId,
      eval_type: evalType,
      raw_text: rawText,
      total_score: result.totalScore,
      scoring_mode: "rule",
    })
    .select("id")
    .single();

  if (evaluationError) throw evaluationError;

  const { error: scoreError } = await supabase.from("scores").insert(
    result.scores.map((score) => ({
      evaluation_id: evaluation.id,
      criterion_id: score.criterionId,
      value: score.value,
      justification: score.justification,
      source: "rule",
      review_status: "accepted",
    })),
  );

  if (scoreError) throw scoreError;

  await refreshCandidateOverall(candidateId);
  await writeAudit("system", "save_scores", "evaluation", evaluation.id, {
    candidate_id: candidateId,
    rubric_id: rubricId,
    total_score: result.totalScore,
  });

  return evaluation.id as string;
}

async function refreshCandidateOverall(candidateId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("total_score")
    .eq("candidate_id", candidateId)
    .not("total_score", "is", null);

  if (error) throw error;

  const scores = (data ?? [])
    .map((row) => Number(row.total_score))
    .filter((score) => Number.isFinite(score));
  const overall =
    scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : null;

  const { error: updateError } = await supabase
    .from("candidates")
    .update({ overall_score: overall })
    .eq("id", candidateId);

  if (updateError) throw updateError;
}

async function writeAudit(
  actor: string,
  action: string,
  targetType: string,
  targetId: string | null,
  detail: Record<string, unknown>,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("audit_logs").insert({
    actor,
    action,
    target_type: targetType,
    target_id: targetId,
    detail,
  });

  if (error) {
    console.error("Failed to write audit log", error);
  }
}

export async function listEvaluations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("*, rubric:rubrics (*), scores (*, criterion:criteria (*))")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as EvaluationWithScores[];
}

export async function getCriteriaForRubric(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("criteria").select("*").eq("rubric_id", id);

  if (error) throw error;
  return (data ?? []) as Criterion[];
}
