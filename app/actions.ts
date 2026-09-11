"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  candidateFromForm,
  createCandidate,
  createRubric,
  createRuleEvaluation,
  deleteCandidate,
  rubricFromForm,
  updateCandidate,
  updateRubric,
} from "@/lib/data/recruitment";

export async function createCandidateAction(formData: FormData) {
  const id = await createCandidate(candidateFromForm(formData));
  revalidatePath("/");
  revalidatePath("/candidates");
  redirect(`/candidates/${id}`);
}

export async function updateCandidateAction(id: string, formData: FormData) {
  await updateCandidate(id, candidateFromForm(formData));
  revalidatePath("/");
  revalidatePath("/candidates");
  revalidatePath(`/candidates/${id}`);
  redirect(`/candidates/${id}`);
}

export async function deleteCandidateAction(id: string) {
  await deleteCandidate(id);
  revalidatePath("/");
  revalidatePath("/candidates");
  redirect("/candidates");
}

export async function createRubricAction(formData: FormData) {
  await createRubric(rubricFromForm(formData));
  revalidatePath("/rubrics");
  revalidatePath("/evaluations/new");
  redirect("/rubrics");
}

export async function updateRubricAction(id: string, formData: FormData) {
  await updateRubric(id, rubricFromForm(formData));
  revalidatePath("/rubrics");
  revalidatePath(`/rubrics/${id}/edit`);
  revalidatePath("/evaluations/new");
  redirect("/rubrics");
}

export async function createEvaluationAction(formData: FormData) {
  const candidateId = String(formData.get("candidate_id") ?? "");
  await createRuleEvaluation(formData);
  revalidatePath("/");
  revalidatePath("/candidates");
  revalidatePath(`/candidates/${candidateId}`);
  revalidatePath("/evaluations/new");
  redirect(`/candidates/${candidateId}`);
}
