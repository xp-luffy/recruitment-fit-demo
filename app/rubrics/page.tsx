import Link from "next/link";
import { listRubricsWithCriteria } from "@/lib/data/recruitment";

export default async function RubricsPage() {
  const rubrics = await listRubricsWithCriteria();

  return (
    <div className="workbench">
      <section className="section-heading">
        <div>
          <h1>Rubrics</h1>
          <p>Weighted criteria used by the scoring engine.</p>
        </div>
        <Link className="button button-primary" href="/rubrics/new">
          New rubric
        </Link>
      </section>

      {rubrics.length === 0 ? (
        <section className="empty-state">
          <h2>No rubrics yet.</h2>
          <p>Create Culture, Capability, and Potential criteria before scoring.</p>
        </section>
      ) : (
        <div className="rubric-grid">
          {rubrics.map((rubric) => (
            <article className="rubric-card" key={rubric.id}>
              <header>
                <div>
                  <h2>{rubric.name}</h2>
                  <p>{rubric.role ?? "Any role"}</p>
                </div>
                <Link className="button button-secondary" href={`/rubrics/${rubric.id}/edit`}>
                  Edit
                </Link>
              </header>
              <div className="criteria-list">
                {rubric.criteria.map((criterion) => (
                  <div key={criterion.id}>
                    <strong>{criterion.name}</strong>
                    <span>Weight {Number(criterion.weight).toFixed(1)}</span>
                    <p>{criterion.keywords?.join(", ") || "No keywords"}</p>
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
