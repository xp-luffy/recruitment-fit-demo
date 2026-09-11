import Link from "next/link";
import { CandidateList } from "@/components/CandidateList";
import { listCandidatesRanked } from "@/lib/data/recruitment";

export default async function CandidatesPage() {
  const candidates = await listCandidatesRanked();

  return (
    <div className="workbench">
      <section className="section-heading">
        <div>
          <h1>Candidates</h1>
          <p>Ranked by current weighted fit score.</p>
        </div>
        <Link className="button button-primary" href="/candidates/new">
          New candidate
        </Link>
      </section>
      <CandidateList candidates={candidates} />
    </div>
  );
}
