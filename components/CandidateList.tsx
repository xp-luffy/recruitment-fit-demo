import Link from "next/link";
import type { Candidate } from "@/lib/types/recruitment";

export function CandidateList({ candidates }: { candidates: Candidate[] }) {
  if (candidates.length === 0) {
    return (
      <section className="empty-state">
        <h2>No candidates yet.</h2>
        <p>Create one to start scoring fit against a rubric.</p>
        <Link className="button button-primary" href="/candidates/new">
          New candidate
        </Link>
      </section>
    );
  }

  return (
    <div className="ranked-list">
      {candidates.map((candidate, index) => (
        <Link className="candidate-row" href={`/candidates/${candidate.id}`} key={candidate.id}>
          <span className="rank">#{index + 1}</span>
          <span className="candidate-main">
            <strong>{candidate.name}</strong>
            <span>
              {candidate.role_applied}
              {candidate.source ? ` - ${candidate.source}` : ""}
            </span>
          </span>
          <span className="score-pill">
            {candidate.overall_score === null ? "Unscored" : `${Math.round(candidate.overall_score)}`}
          </span>
        </Link>
      ))}
    </div>
  );
}
