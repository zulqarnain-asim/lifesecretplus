import Link from "next/link";
import { getDbPosts, isDatabaseConfigured } from "../../../lib/db";
import { getFilePostSlugs } from "../../../lib/posts";
import { removePost } from "../actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog posts",
  robots: { index: false, follow: false },
};

const filters = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

function fmt(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminPosts({ searchParams }) {
  const params = await searchParams;
  const status = filters.some((f) => f.value === params?.status) ? params.status : "all";
  const q = (params?.q || "").trim().toLowerCase();

  const all = await getDbPosts({ status: "all" });
  const posts = all
    .filter((p) => (status === "all" ? true : p.status === status))
    .filter((p) => (q ? `${p.title} ${p.slug} ${p.tag || ""}`.toLowerCase().includes(q) : true));

  const bundled = getFilePostSlugs();

  return (
    <>
      <div className="admin-head">
        <div>
          <span className="eyebrow">Content</span>
          <h1>Blog posts</h1>
        </div>
        <Link href="/admin/posts/new" className="btn btn-sm">
          + New post
        </Link>
      </div>

      {!isDatabaseConfigured ? (
        <p className="form-status err">
          No database is connected. Set DATABASE_URL to write posts from the dashboard.
        </p>
      ) : (
        <>
          {params?.saved && <p className="form-status ok">Post saved and published to the blog.</p>}

          <div className="admin-cards">
            <div className="admin-card">
              <strong>{all.filter((p) => p.status === "published").length}</strong>
              <span>Published</span>
            </div>
            <div className="admin-card">
              <strong>{all.filter((p) => p.status === "draft").length}</strong>
              <span>Drafts</span>
            </div>
            <div className="admin-card">
              <strong>{bundled.length}</strong>
              <span>Built-in articles</span>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="admin-tabs">
              {filters.map((f) => (
                <Link
                  key={f.value}
                  href={{
                    pathname: "/admin/posts",
                    query: { ...(q ? { q } : {}), status: f.value },
                  }}
                  className={status === f.value ? "active" : undefined}
                >
                  {f.label}
                </Link>
              ))}
            </div>

            <form className="admin-search" action="/admin/posts">
              {status !== "all" && <input type="hidden" name="status" value={status} />}
              <input
                type="search"
                name="q"
                defaultValue={params?.q || ""}
                placeholder="Search posts…"
                aria-label="Search posts"
              />
              <button className="btn btn-sm" type="submit">
                Search
              </button>
            </form>
          </div>

          {posts.length === 0 ? (
            <p className="admin-empty">
              No posts here yet. <Link href="/admin/posts/new">Write your first one →</Link>
            </p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Title</th>
                    <th>Tag</th>
                    <th>Published</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <span
                          className={`pill ${p.status === "draft" ? "pill-draft" : "pill-live"}`}
                        >
                          {p.status === "draft" ? "Draft" : "Live"}
                        </span>
                      </td>
                      <td>
                        <strong>{p.title}</strong>
                        <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">
                          /blog/{p.slug}
                        </a>
                      </td>
                      <td>{p.tag || "—"}</td>
                      <td className="admin-cell-date">{fmt(p.published_at)}</td>
                      <td>
                        <div className="admin-row-actions">
                          <Link href={`/admin/posts/${p.id}`} className="btn btn-outline btn-sm">
                            Edit
                          </Link>
                          <form action={removePost}>
                            <input type="hidden" name="id" value={p.id} />
                            <button className="btn btn-outline btn-sm admin-delete" type="submit">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="admin-note">
            The {bundled.length} original articles ship with the site as markdown files and are
            always live. Anything you write here is stored in the database and appears on the blog
            straight away.
          </p>
        </>
      )}
    </>
  );
}
