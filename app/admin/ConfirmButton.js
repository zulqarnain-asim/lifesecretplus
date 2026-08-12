"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

function ConfirmSubmit({ label }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-sm admin-danger" type="submit" disabled={pending}>
      {pending ? "Deleting…" : label}
    </button>
  );
}

export default function ConfirmButton({
  action,
  fields = {},
  label = "Delete",
  confirmLabel = "Delete",
  title = "Delete this item?",
  message = "This cannot be undone.",
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm admin-delete"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>

      {open && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          role="presentation"
        >
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setOpen(false)}
                autoFocus
              >
                Cancel
              </button>
              <form action={action}>
                {Object.entries(fields).map(([name, value]) => (
                  <input key={name} type="hidden" name={name} value={value} />
                ))}
                <ConfirmSubmit label={confirmLabel} />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
