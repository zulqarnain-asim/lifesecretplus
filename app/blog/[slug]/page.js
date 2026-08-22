import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPosts, getFilePostSlugs, getPost } from "../../../lib/posts";
import { site } from "../../site";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const revalidate = 60;

export function generateStaticParams() {
  return getFilePostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
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
      modifiedTime: post.modified || post.date,
      authors: post.author ? [post.author] : undefined,
      images: post.image
        ? [{ url: post.image, alt: post.imageAlt || post.title }]
        : undefined,
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
  if (!post) notFound();

  const alt = post.imageAlt || post.title;
  const related = (await getAllPosts()).filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.modified || post.date,
        wordCount: post.contentHtml.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length,
        articleSection: post.tag,
        inLanguage: "en-GB",
        author: { "@type": "Person", name: post.author || site.author },
        image: post.image
          ? [{ "@type": "ImageObject", url: `${site.url}${post.image}`, caption: alt }]
          : undefined,
        mainEntityOfPage: `${site.url}/blog/${slug}`,
        publisher: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.title },
        ],
      },
    ],
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
                alt={alt}
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

      {related.length > 0 && (
        <section className="section section-soft">
          <div className="wrap">
            <div className="section-head">
              <h2>Keep reading</h2>
              <p>More encouragement from the Life Secret Plus blog.</p>
            </div>
            <div className="posts">
              {related.map((p) => (
                <article className="post-card" key={p.slug}>
                  <Link href={`/blog/${p.slug}`}>
                    <div className="post-media">
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={p.imageAlt || p.title}
                          width={640}
                          height={400}
                          sizes="(max-width: 960px) 92vw, 360px"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="post-body">
                    <div className="post-meta">
                      <span className="tag">{p.tag || "Mindset"}</span>
                      <time dateTime={p.date}>{fmtDate(p.date)}</time>
                    </div>
                    <h3>
                      <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p>{p.excerpt}</p>
                    <Link href={`/blog/${p.slug}`} className="read-more">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
