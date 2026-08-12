import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getPost } from "../../../lib/posts";
import { site } from "../../site";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
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
  const url = `${site.url}/blog/${slug}`;
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
    author: { "@type": "Person", name: post.author || site.author },
    image: post.image ? [`${site.url}${post.image}`] : undefined,
    mainEntityOfPage: `${site.url}/blog/${slug}`,
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Article</span>
          <h1>{post.title}</h1>
          <p className="crumb">
            <Link href="/">Home</Link> / <Link href="/blog">Blog</Link>
          </p>
        </div>
      </section>

      <article className="article">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="article-inner">
          {post.image && (
            <div className="article-hero">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={675}
                priority
                sizes="(max-width: 820px) 92vw, 780px"
              />
            </div>
          )}

          <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

          <div className="byline">
            <Image
              src="/images/blog/author-shaheen-haq.jpg"
              alt={post.author || site.author}
              width={46}
              height={46}
            />
            <div>
              <strong>{post.author || site.author}</strong>
              <span>Published {fmtDate(post.date)}</span>
            </div>
          </div>

          <p className="back-link">
            <Link href="/blog">← Back to all posts</Link>
          </p>
        </div>
      </article>
    </>
  );
}
