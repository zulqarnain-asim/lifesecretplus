import Link from "next/link";
import { getAllPosts, getPost } from "../../../lib/posts";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const url = `https://lifesecretplus.com/blog/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: post.author || "LifeSecret Plus",
    },
    image: post.image ? [`https://lifesecretplus.com${post.image}`] : undefined,
    mainEntityOfPage: `https://lifesecretplus.com/blog/${slug}`,
    publisher: { "@type": "Organization", name: "LifeSecret Plus" },
  };
  return (
    <article className="post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="post-header">
        <h1>{post.title}</h1>
        <p className="post-meta">
          {fmtDate(post.date)}
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
