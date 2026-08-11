import Link from "next/link";
import { getAllPosts } from "../../lib/posts";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const metadata = {
  title: "Mental Health & Wellbeing Blog",
  description:
    "Articles on mental health, stress, sleep, mindfulness, and healthy habits — practical guidance for a calmer mind.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Mental Health & Wellbeing Blog — LifeSecret Plus",
    description:
      "Articles on mental health, stress, sleep, mindfulness, and healthy habits.",
    url: "https://lifesecretplus.com/blog",
    type: "website",
  },
};

export default function Blog() {
  const posts = getAllPosts();

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>The Blog</h1>
          <p>
            Practical guidance on mental health, wellbeing habits, and
            mindfulness — written to be used, not just read.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "2rem" }}>
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="post-meta">No articles published yet.</p>
          ) : (
            <ul className="post-list">
              {posts.map((post) => (
                <li className="post-item" key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>
                    {post.image && (
                      <img className="thumb" src={post.image} alt={post.title} />
                    )}
                    <div className="post-body">
                      <p className="post-meta">{fmtDate(post.date)}</p>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <span className="read-more">Read article →</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
