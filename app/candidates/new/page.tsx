import { createCandidateAction } from "@/app/actions";
import { CandidateForm } from "@/components/Forms";

export default function NewCandidatePage() {
  return (
    <div className="workbench narrow">
      <section className="section-heading">
        <div>
          <h1>New candidate</h1>
          <p>Add a person to the hiring loop.</p>
        </div>
      </section>
      <CandidateForm action={createCandidateAction} />
    </div>
  );
}
