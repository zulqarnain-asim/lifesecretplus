import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "../../lib/posts";

export const metadata = {
  title: "Blog",
  description:
    "Insights on self-worth, dignity, habits, faith, failure and kindness — practical encouragement from Life Secret Plus.",
  alternates: { canonical: "/blog" },
};

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const revalidate = 60;

export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Our Blog</span>
          <h1>Insights &amp; Inspiration</h1>
          <p>
            Honest, practical writing on self-worth, resilience and living with purpose — written to
            lift you up on the days you need it most.
          </p>
          <p className="crumb">
            <Link href="/">Home</Link> / Blog
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {posts.length === 0 ? (
            <p style={{ textAlign: "center" }}>New articles are on the way — check back soon.</p>
          ) : (
            <div className="posts">
              {posts.map((post) => (
                <article className="post-card" key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="post-media">
                      {post.image && (
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={640}
                          height={400}
                          sizes="(max-width: 960px) 92vw, 360px"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="post-body">
                    <div className="post-meta">
                      <span className="tag">{post.tag || "Mindset"}</span>
                      <time dateTime={post.date}>{fmtDate(post.date)}</time>
                    </div>
                    <h3>
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p>{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="read-more">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
