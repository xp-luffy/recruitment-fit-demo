import { updateCandidateAction } from "@/app/actions";
import { CandidateForm } from "@/components/Forms";
import { getCandidate } from "@/lib/data/recruitment";

export default async function EditCandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = await getCandidate(id);

  return (
    <div className="workbench narrow">
      <section className="section-heading">
        <div>
          <h1>Edit candidate</h1>
          <p>{candidate.name}</p>
        </div>
      </section>
      <CandidateForm action={updateCandidateAction.bind(null, id)} candidate={candidate} />
    </div>
  );
}
