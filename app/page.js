import Link from "next/link";
import { getAllPosts } from "../lib/posts";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const topics = [
  {
    icon: "🧠",
    title: "Mental Health",
    text: "Understanding stress, anxiety, and low mood — and what actually helps.",
  },
  {
    icon: "🌿",
    title: "Wellbeing Habits",
    text: "Simple routines for better sleep, steady energy, and emotional balance.",
  },
  {
    icon: "🧘",
    title: "Mindfulness",
    text: "Short, practical exercises to calm your nervous system in minutes.",
  },
  {
    icon: "📈",
    title: "Personal Growth",
    text: "Build focus, resilience, and confidence with small consistent steps.",
  },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div>
            <span className="eyebrow">Mental health &amp; wellbeing</span>
            <h1>
              A calmer mind, <em>one habit</em> at a time.
            </h1>
            <p className="hero-lead">
              Practical, evidence-based guidance on stress, sleep, mindfulness
              and healthy routines — written to be read in five minutes and used
              the same day.
            </p>
            <div className="hero-actions">
              <Link className="btn" href="/blog">
                Read the blog
              </Link>
              <Link className="btn btn-ghost" href="/about">
                About us
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>5 min</strong>
                <span>Average read</span>
              </div>
              <div>
                <strong>Weekly</strong>
                <span>New guides</span>
              </div>
              <div>
                <strong>Free</strong>
                <span>Always</span>
              </div>
            </div>
          </div>

          <aside className="hero-card">
            <h3>What you&rsquo;ll find here</h3>
            <ul className="check-list">
              <li>Habits that fit into a busy day</li>
              <li>Calm, judgement-free explanations</li>
              <li>Techniques backed by research</li>
              <li>No jargon, no hype, no selling</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap">
          <div className="section-head">
            <h2>What we cover</h2>
            <p>
              Four areas that make the biggest difference to how you feel day to
              day.
            </p>
          </div>
          <div className="cards">
            {topics.map((t) => (
              <article className="card" key={t.title}>
                <div className="card-icon" aria-hidden="true">
                  {t.icon}
                </div>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Latest articles</h2>
            <p>Fresh guides to help you feel steadier this week.</p>
          </div>
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
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta">
            <h2>Have a question or a topic request?</h2>
            <p>
              We read every message. Tell us what you&rsquo;re struggling with
              and we may turn it into a guide.
            </p>
            <Link className="btn" href="/contact">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
