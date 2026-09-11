"use client";

import { deleteCandidateAction } from "@/app/actions";

export function DeleteCandidateButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteCandidateAction.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${name} and all evaluations? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button className="button button-danger" type="submit">
        Delete
      </button>
    </form>
  );
}
