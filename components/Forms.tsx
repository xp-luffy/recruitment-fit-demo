import type { Candidate, RubricWithCriteria } from "@/lib/types/recruitment";

type RubricFormCriterion = {
  id?: string;
  name: string;
  description: string | null;
  weight: number;
  keywords: string[] | string | null;
};

const defaultCriteria: RubricFormCriterion[] = [
  {
    name: "Culture Fit",
    description: "Collaboration, ownership, values alignment",
    weight: 1,
    keywords: "team, collaborat, values, ownership, help",
  },
  {
    name: "Capability Fit",
    description: "Relevant craft depth and delivery experience",
    weight: 2,
    keywords: "system, scale, architecture, debug, performance, api, database",
  },
  {
    name: "Potential Fit",
    description: "Learning speed, curiosity, adaptability",
    weight: 1,
    keywords: "learn, growth, curious, adapt, mentor, improve",
  },
];

export function CandidateForm({
  candidate,
  action,
}: {
  candidate?: Candidate;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="form-panel">
      <label>
        <span>Name</span>
        <input name="name" required defaultValue={candidate?.name ?? ""} />
      </label>
      <label>
        <span>Role applied for</span>
        <input name="role_applied" required defaultValue={candidate?.role_applied ?? ""} />
      </label>
      <label>
        <span>Source</span>
        <input name="source" defaultValue={candidate?.source ?? ""} />
      </label>
      <label>
        <span>Status</span>
        <select name="status" defaultValue={candidate?.status ?? "active"}>
          <option value="active">Active</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
      </label>
      <div className="form-actions">
        <button className="button button-primary" type="submit">
          Save candidate
        </button>
      </div>
    </form>
  );
}

export function RubricForm({
  rubric,
  action,
}: {
  rubric?: RubricWithCriteria;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const criteria = rubric?.criteria.length ? rubric.criteria : defaultCriteria;

  return (
    <form action={action} className="form-panel">
      <label>
        <span>Rubric name</span>
        <input name="name" required defaultValue={rubric?.name ?? ""} />
      </label>
      <label>
        <span>Role</span>
        <input name="role" defaultValue={rubric?.role ?? ""} />
      </label>

      <div className="criteria-editor">
        {(criteria.slice(0, 3) as RubricFormCriterion[]).map((criterion, index) => (
          <fieldset key={criterion.id ?? criterion.name}>
            <legend>Criterion {index + 1}</legend>
            {"id" in criterion && criterion.id ? (
              <input name={`criteria_${index}_id`} type="hidden" value={criterion.id} />
            ) : null}
            <label>
              <span>Name</span>
              <input name={`criteria_${index}_name`} required defaultValue={criterion.name} />
            </label>
            <label>
              <span>Description</span>
              <input
                name={`criteria_${index}_description`}
                defaultValue={criterion.description ?? undefined}
              />
            </label>
            <label>
              <span>Weight</span>
              <input
                min="0.1"
                name={`criteria_${index}_weight`}
                required
                step="0.1"
                type="number"
                defaultValue={criterion.weight}
              />
            </label>
            <label>
              <span>Keywords</span>
              <input
                name={`criteria_${index}_keywords`}
                defaultValue={
                  Array.isArray(criterion.keywords)
                    ? criterion.keywords.join(", ")
                    : criterion.keywords ?? undefined
                }
              />
            </label>
          </fieldset>
        ))}
      </div>

      <div className="form-actions">
        <button className="button button-primary" type="submit">
          Save rubric
        </button>
      </div>
    </form>
  );
}
