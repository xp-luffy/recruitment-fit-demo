import { createRubricAction } from "@/app/actions";
import { RubricForm } from "@/components/Forms";

export default function NewRubricPage() {
  return (
    <div className="workbench">
      <section className="section-heading">
        <div>
          <h1>New rubric</h1>
          <p>Define the weighted criteria for a role.</p>
        </div>
      </section>
      <RubricForm action={createRubricAction} />
    </div>
  );
}
