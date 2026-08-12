import Link from "next/link";
import { getDbPosts, getImportedSlugs, isDatabaseConfigured } from "../../../lib/db";
import { getFilePostSlugs } from "../../../lib/posts";
import { importBundledPosts, removePost } from "../actions";
import ConfirmButton from "../ConfirmButton";

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
  const imported = new Set(await getImportedSlugs().catch(() => []));
  const notImported = bundled.filter((slug) => !imported.has(slug));

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
          {params?.imported && (
            <p className="form-status ok">
              Imported {params.imported} article{params.imported === "1" ? "" : "s"} into the
              database. You can now edit or delete them here.
            </p>
          )}

          {notImported.length > 0 && (
            <div className="admin-banner">
              <div>
                <strong>Import the built-in articles</strong>
                <p>
                  {notImported.length} article{notImported.length === 1 ? " is" : "s are"} still
                  served from markdown files. Import them to edit, update or delete them from here.
                </p>
              </div>
              <form action={importBundledPosts}>
                <button className="btn btn-sm" type="submit">
                  Import {notImported.length} article{notImported.length === 1 ? "" : "s"}
                </button>
              </form>
            </div>
          )}

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
              <strong>{notImported.length}</strong>
              <span>Not imported</span>
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
                          <ConfirmButton
                            action={removePost}
                            fields={{ id: p.id }}
                            title="Delete this post?"
                            message={`“${p.title}” and its uploaded cover image will be permanently removed from the blog.`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="admin-note">
            {notImported.length > 0
              ? `${notImported.length} of ${bundled.length} original articles still come from markdown files. Import them above to manage everything from the database.`
              : "Every article is stored in the database, so anything you add, edit or delete here shows on the blog straight away."}
          </p>
        </>
      )}
    </>
  );
}
