import Link from "next/link";
import { countContactMessages, getContactMessages, isDatabaseConfigured } from "../../lib/db";
import { markMessage, removeMessage } from "./actions";
import ConfirmButton from "./ConfirmButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

const filters = [
  { value: "all", label: "All" },
  { value: "new", label: "Unread" },
  { value: "read", label: "Read" },
];

function fmt(date) {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminMessages({ searchParams }) {
  const params = await searchParams;
  const status = filters.some((f) => f.value === params?.status) ? params.status : "all";
  const q = (params?.q || "").trim();

  const [messages, counts] = await Promise.all([
    getContactMessages({ limit: 200, status, q }),
    countContactMessages(),
  ]);

  return (
    <>
      <div className="admin-head">
        <div>
          <span className="eyebrow">Inbox</span>
          <h1>Contact messages</h1>
        </div>
      </div>

      {!isDatabaseConfigured ? (
        <p className="form-status err">
          No database is connected. Set DATABASE_URL so submissions can be stored.
        </p>
      ) : (
        <>
          <div className="admin-cards">
            <div className="admin-card">
              <strong>{counts.total}</strong>
              <span>Total messages</span>
            </div>
            <div className="admin-card">
              <strong>{counts.unread}</strong>
              <span>Unread</span>
            </div>
            <div className="admin-card">
              <strong>{counts.total - counts.unread}</strong>
              <span>Read</span>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="admin-tabs">
              {filters.map((f) => (
                <Link
                  key={f.value}
                  href={{ pathname: "/admin", query: { ...(q ? { q } : {}), status: f.value } }}
                  className={status === f.value ? "active" : undefined}
                >
                  {f.label}
                </Link>
              ))}
            </div>

            <form className="admin-search" action="/admin">
              {status !== "all" && <input type="hidden" name="status" value={status} />}
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search name, email or message…"
                aria-label="Search messages"
              />
              <button className="btn btn-sm" type="submit">
                Search
              </button>
            </form>
          </div>

          {messages.length === 0 ? (
            <p className="admin-empty">No messages match this view.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>From</th>
                    <th>Subject &amp; message</th>
                    <th>Received</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m.id} className={m.status === "new" ? "unread" : undefined}>
                      <td>
                        <span className={`pill ${m.status === "new" ? "pill-new" : "pill-read"}`}>
                          {m.status === "new" ? "Unread" : "Read"}
                        </span>
                      </td>
                      <td>
                        <strong>{m.name}</strong>
                        <a href={`mailto:${m.email}`}>{m.email}</a>
                      </td>
                      <td className="admin-cell-message">
                        {m.subject && <strong>{m.subject}</strong>}
                        <p>{m.message}</p>
                      </td>
                      <td className="admin-cell-date">
                        <time dateTime={new Date(m.created_at).toISOString()}>
                          {fmt(m.created_at)}
                        </time>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <form action={markMessage}>
                            <input type="hidden" name="id" value={m.id} />
                            <input
                              type="hidden"
                              name="status"
                              value={m.status === "new" ? "read" : "new"}
                            />
                            <button className="btn btn-outline btn-sm" type="submit">
                              Mark {m.status === "new" ? "read" : "unread"}
                            </button>
                          </form>
                          <ConfirmButton
                            action={removeMessage}
                            fields={{ id: m.id }}
                            title="Delete this message?"
                            message={`The message from ${m.name} will be permanently removed.`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
