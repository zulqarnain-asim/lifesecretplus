"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { savePost } from "../actions";

const tags = ["Mindset", "Palmistry", "Coaching", "Wellbeing", "Faith", "Habits"];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostForm({ post }) {
  const [state, formAction, pending] = useActionState(savePost, null);
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [preview, setPreview] = useState(null);

  const publishedAt = post?.published_at
    ? new Date(post.published_at).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="admin-form">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div className="admin-form-grid">
        <div className="admin-form-main">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="Embrace your self-worth"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="slug">URL slug</label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="embrace-your-self-worth"
            />
            <small>The post will live at /blog/{slug || "your-slug"}</small>
          </div>

          <div className="field">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt || ""}
              placeholder="One or two sentences shown on the blog listing."
            />
          </div>

          <div className="field">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={18}
              defaultValue={post?.content || ""}
              placeholder={"Write in Markdown.\n\n## A heading\n\nA paragraph with **bold** text.\n\n- a list item"}
              required
            />
            <small>
              Markdown is supported: <code>## Heading</code>, <code>**bold**</code>,{" "}
              <code>- list</code>, <code>[link](https://…)</code>
            </small>
          </div>
        </div>

        <aside className="admin-form-side">
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={post?.status || "published"}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="publishedAt">Publish date</label>
            <input id="publishedAt" name="publishedAt" type="date" defaultValue={publishedAt} />
          </div>

          <div className="field">
            <label htmlFor="tag">Tag</label>
            <input id="tag" name="tag" list="post-tags" defaultValue={post?.tag || "Mindset"} />
            <datalist id="post-tags">
              {tags.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>

          <div className="field">
            <label htmlFor="author">Author</label>
            <input id="author" name="author" defaultValue={post?.author || "Shaheen Haq"} />
          </div>

          <div className="field">
            <label htmlFor="imageFile">Cover image</label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            <small>Upload a JPG, PNG or WebP up to 4MB.</small>

            {(preview || post?.image) && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="admin-thumb" src={preview || post.image} alt="Cover preview" />
            )}
          </div>

          <div className="field">
            <label htmlFor="imageAlt">Image description</label>
            <input
              id="imageAlt"
              name="imageAlt"
              defaultValue={post?.image_alt || ""}
              placeholder="Woman writing in a journal beside a sunlit window"
            />
            <small>Describe what the picture shows — this is what Google Images reads.</small>
          </div>

          <div className="field">
            <label htmlFor="image">…or an image path</label>
            <input
              id="image"
              name="image"
              defaultValue={post?.image || ""}
              placeholder="/images/blog/embrace-self-worth.jpg"
            />
            <small>Used only when no file is uploaded.</small>
          </div>

          <div className="admin-form-actions">
            <button className="btn" type="submit" disabled={pending}>
              {pending ? "Saving…" : post?.id ? "Update post" : "Publish post"}
            </button>
            <Link href="/admin/posts" className="btn btn-outline btn-sm">
              Cancel
            </Link>
          </div>

          {state?.error && <p className="form-status err">{state.error}</p>}
        </aside>
      </div>
    </form>
  );
}
