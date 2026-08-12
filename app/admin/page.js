import { countContactMessages, getContactMessages, isDatabaseConfigured } from "../../lib/db";
import { logout, markMessage, removeMessage } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

function fmt(date) {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminMessages() {
  const [messages, counts] = await Promise.all([
    getContactMessages({ limit: 100 }),
    countContactMessages(),
  ]);

  return (
    <section className="section">
      <div className="wrap">
        <div className="admin-head">
          <div>
            <span className="eyebrow">Admin</span>
            <h1 style={{ fontSize: "2rem" }}>Contact messages</h1>
          </div>
          <form action={logout}>
            <button className="btn btn-outline btn-sm" type="submit">
              Sign out
            </button>
          </form>
        </div>

        {!isDatabaseConfigured ? (
          <p className="form-status err">
            No database is connected. Set DATABASE_URL so submissions can be stored.
          </p>
        ) : (
          <>
            <div className="stats admin-stats">
              <div className="stat">
                <strong>{counts.total}</strong>
                <span>Total messages</span>
              </div>
              <div className="stat">
                <strong>{counts.unread}</strong>
                <span>Unread</span>
              </div>
            </div>

            {messages.length === 0 ? (
              <p className="admin-empty">No messages yet.</p>
            ) : (
              <ul className="admin-list">
                {messages.map((m) => (
                  <li key={m.id} className={`admin-item${m.status === "new" ? " unread" : ""}`}>
                    <div className="admin-item-head">
                      <div>
                        <strong>{m.name}</strong>
                        <a href={`mailto:${m.email}`}>{m.email}</a>
                      </div>
                      <time dateTime={new Date(m.created_at).toISOString()}>
                        {fmt(m.created_at)}
                      </time>
                    </div>

                    {m.subject && <p className="admin-subject">{m.subject}</p>}
                    <p className="admin-message">{m.message}</p>

                    <div className="admin-actions">
                      <form action={markMessage}>
                        <input type="hidden" name="id" value={m.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={m.status === "new" ? "read" : "new"}
                        />
                        <button className="btn btn-outline btn-sm" type="submit">
                          Mark as {m.status === "new" ? "read" : "unread"}
                        </button>
                      </form>
                      <form action={removeMessage}>
                        <input type="hidden" name="id" value={m.id} />
                        <button className="btn btn-outline btn-sm admin-delete" type="submit">
                          Delete
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
