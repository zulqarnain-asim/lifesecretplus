import { notFound } from "next/navigation";
import { getDbPostById } from "../../../../lib/db";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit post",
  robots: { index: false, follow: false },
};

export default async function EditPost({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const post = await getDbPostById(id);
  if (!post) notFound();

  return (
    <>
      <div className="admin-head">
        <div>
          <span className="eyebrow">Content</span>
          <h1>Edit post</h1>
        </div>
        <a className="btn btn-outline btn-sm" href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
          View on site ↗
        </a>
      </div>
      <PostForm post={post} />
    </>
  );
}
