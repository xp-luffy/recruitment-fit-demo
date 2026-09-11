import Link from "next/link";
import { DeleteCandidateButton } from "@/components/DeleteCandidateButton";
import { getCandidateDetail } from "@/lib/data/recruitment";

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = await getCandidateDetail(id);

  return (
    <div className="workbench">
      <section className="detail-head">
        <div>
          <p className="eyebrow">{candidate.role_applied}</p>
          <h1>{candidate.name}</h1>
          <p>
            {candidate.source ?? "No source"} - {candidate.status}
          </p>
        </div>
        <div className="detail-score">
          <span>{candidate.overall_score === null ? "-" : Math.round(candidate.overall_score)}</span>
          <p>Overall fit</p>
        </div>
      </section>

      <div className="toolbar">
        <Link className="button button-primary" href={`/evaluations/new?candidate=${candidate.id}`}>
          New evaluation
        </Link>
        <Link className="button button-secondary" href={`/candidates/${candidate.id}/edit`}>
          Edit
        </Link>
        <DeleteCandidateButton id={candidate.id} name={candidate.name} />
      </div>

      <section className="section-heading">
        <div>
          <h2>Evaluations</h2>
          <p>Score evidence by criterion, with saved justifications.</p>
        </div>
      </section>

      {candidate.evaluations.length === 0 ? (
        <section className="empty-state">
          <h2>No evaluations yet.</h2>
          <p>Paste a CV or interview transcript to compute the first score.</p>
        </section>
      ) : (
        <div className="evaluation-stack">
          {candidate.evaluations.map((evaluation) => (
            <article className="evaluation-block" key={evaluation.id}>
              <header>
                <div>
                  <h3>{evaluation.rubric?.name ?? "Missing rubric"}</h3>
                  <p>
                    {evaluation.eval_type.toUpperCase()} -{" "}
                    {new Date(evaluation.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="score-pill large">
                  {evaluation.total_score === null ? "Unscored" : Math.round(evaluation.total_score)}
                </span>
              </header>
              <p className="raw-excerpt">{evaluation.raw_text}</p>
              <div className="score-table">
                {evaluation.scores.map((score) => (
                  <div className="score-row" key={score.id}>
                    <div>
                      <strong>{score.criterion?.name ?? "Criterion removed"}</strong>
                      <span>{score.justification}</span>
                    </div>
                    <span>{Number(score.value).toFixed(1)} / 5</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
