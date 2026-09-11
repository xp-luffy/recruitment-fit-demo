import { createEvaluationAction } from "@/app/actions";
import { listCandidatesRanked, listRubricsWithCriteria } from "@/lib/data/recruitment";

export default async function NewEvaluationPage({
  searchParams,
}: {
  searchParams: Promise<{ candidate?: string }>;
}) {
  const [{ candidate }, candidates, rubrics] = await Promise.all([
    searchParams,
    listCandidatesRanked(),
    listRubricsWithCriteria(),
  ]);

  return (
    <div className="workbench">
      <section className="section-heading">
        <div>
          <h1>New evaluation</h1>
          <p>Paste a CV or transcript and run the weighted rule scorer.</p>
        </div>
      </section>

      {candidates.length === 0 || rubrics.length === 0 ? (
        <section className="empty-state">
          <h2>Candidate and rubric required.</h2>
          <p>Create at least one candidate and one rubric before scoring.</p>
        </section>
      ) : (
        <form action={createEvaluationAction} className="form-panel evaluation-form">
          <div className="form-grid">
            <label>
              <span>Candidate</span>
              <select name="candidate_id" required defaultValue={candidate ?? candidates[0]?.id}>
                {candidates.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.role_applied}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Rubric</span>
              <select name="rubric_id" required defaultValue={rubrics[0]?.id}>
                {rubrics.map((rubric) => (
                  <option key={rubric.id} value={rubric.id}>
                    {rubric.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Type</span>
              <select name="eval_type" defaultValue="interview">
                <option value="interview">Interview transcript</option>
                <option value="cv">CV text</option>
              </select>
            </label>
          </div>
          <label>
            <span>CV or transcript text</span>
            <textarea
              name="raw_text"
              required
              minLength={20}
              placeholder="Paste the candidate's interview notes, transcript, or CV text here."
            />
          </label>
          <div className="ai-note">
            AI assist is parked until an approved server-side AI key is present; rule-based scoring
            runs the full loop now.
          </div>
          <div className="form-actions">
            <button className="button button-primary" type="submit">
              Run scoring
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
