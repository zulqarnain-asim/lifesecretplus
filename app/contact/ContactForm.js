"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);
    setSending(true);

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setStatus({ ok: true, message: data.message });
      form.reset();
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required maxLength={100} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required maxLength={200} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="subject">Subject</label>
        <input id="subject" name="subject" type="text" maxLength={150} />
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required maxLength={5000} />
      </div>

      {/* Honeypot field hidden from users to catch spam bots */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
      >
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="btn" type="submit" disabled={sending}>
        {sending ? "Sending…" : "Send message"}
      </button>

      <p className="form-note">
        We only use your email to reply. No newsletters, no sharing.
      </p>

      {status && (
        <p
          className={`form-status ${status.ok ? "ok" : "err"}`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
