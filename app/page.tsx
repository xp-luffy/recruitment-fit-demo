import Link from "next/link";
import { CandidateList } from "@/components/CandidateList";
import { listCandidatesRanked, listRubricsWithCriteria } from "@/lib/data/recruitment";

export default async function Home() {
  const [candidates, rubrics] = await Promise.all([
    listCandidatesRanked(),
    listRubricsWithCriteria(),
  ]);
  const evaluated = candidates.filter((candidate) => candidate.overall_score !== null).length;

  return (
    <div className="workbench">
      <section className="page-head">
        <div>
          <p className="eyebrow">Recruitment Fit Scorer</p>
          <h1>Rank candidates by scored evidence.</h1>
        </div>
        <div className="head-actions">
          <Link className="button button-secondary" href="/rubrics">
            Rubrics
          </Link>
          <Link className="button button-primary" href="/evaluations/new">
            New evaluation
          </Link>
        </div>
      </section>

      <section className="metrics-strip" aria-label="Pipeline summary">
        <div>
          <span>{candidates.length}</span>
          <p>Candidates</p>
        </div>
        <div>
          <span>{evaluated}</span>
          <p>Scored</p>
        </div>
        <div>
          <span>{rubrics.length}</span>
          <p>Rubrics</p>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <h2>Ranked list</h2>
          <p>Overall score is the average of saved evaluations.</p>
        </div>
        <Link className="button button-secondary" href="/candidates/new">
          New candidate
        </Link>
      </section>
      <CandidateList candidates={candidates} />
    </div>
  );
}
