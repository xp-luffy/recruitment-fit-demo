import { updateRubricAction } from "@/app/actions";
import { RubricForm } from "@/components/Forms";
import { getRubricWithCriteria } from "@/lib/data/recruitment";

export default async function EditRubricPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rubric = await getRubricWithCriteria(id);

  return (
    <div className="workbench">
      <section className="section-heading">
        <div>
          <h1>Edit rubric</h1>
          <p>{rubric.name}</p>
        </div>
      </section>
      <RubricForm action={updateRubricAction.bind(null, id)} rubric={rubric} />
    </div>
  );
}
