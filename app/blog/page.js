import Link from "next/link";
import { getAllPosts } from "../../lib/posts";

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
    <section className="section">
      <h2>Mental Health &amp; Wellbeing Blog</h2>
      <p>Practical guidance for a calmer mind and a healthier life.</p>
      <ul className="post-list">
        {posts.map((post) => (
          <li className="post-item" key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              {post.image && (
                <img className="thumb" src={post.image} alt={post.title} />
              )}
              <h3>{post.title}</h3>
              <p className="post-meta">{post.date}</p>
              <p>{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
