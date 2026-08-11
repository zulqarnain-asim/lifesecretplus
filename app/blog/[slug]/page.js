import Link from "next/link";
import { getAllPosts, getPost } from "../../../lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: `${post.title} — LifeSecret Plus` };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return (
    <article className="post">
      <header className="post-header">
        <h1>{post.title}</h1>
        <p className="post-meta">
          {post.date}
          {post.author ? ` · ${post.author}` : ""}
        </p>
        {post.image && <img src={post.image} alt={post.title} />}
      </header>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
      <p className="back-link">
        <Link href="/blog">&larr; Back to all posts</Link>
      </p>
    </article>
  );
}
