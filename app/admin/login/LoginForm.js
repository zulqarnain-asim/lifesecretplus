"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form className="form-card" action={formAction}>
      <div className="field">
        <label htmlFor="password">Admin password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>

      {state?.error && (
        <p className="form-status err" role="status" aria-live="polite">
          {state.error}
        </p>
      )}
    </form>
  );
}
