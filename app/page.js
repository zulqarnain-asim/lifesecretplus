import Link from "next/link";
import { getAllPosts } from "../lib/posts";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  return (
    <>
      <section className="hero">
        <h1>Your Mind Matters</h1>
        <p>
          Practical mental health tips, wellbeing guides, and everyday wisdom —
          all in one place.
        </p>
        <Link className="btn" href="/blog">
          Read the Blog
        </Link>
      </section>

      <section id="about" className="section">
        <h2>About Us</h2>
        <p>
          LifeSecret Plus is dedicated to helping you build a calmer mind and a
          healthier life. We share evidence-based advice on mental health,
          stress, sleep, mindfulness, and personal growth.
        </p>
      </section>

      <section id="features" className="section">
        <h2>What We Cover</h2>
        <div className="cards">
          <div className="card">
            <h3>Mental Health</h3>
            <p>Understanding stress, anxiety, and how to care for your mind daily.</p>
          </div>
          <div className="card">
            <h3>Wellbeing Habits</h3>
            <p>Simple routines for better sleep, energy, and emotional balance.</p>
          </div>
          <div className="card">
            <h3>Mindfulness &amp; Growth</h3>
            <p>Practices to build focus, resilience, and a positive outlook.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Latest from the Blog</h2>
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

      <section id="contact" className="section">
        <h2>Get in Touch</h2>
        <p>
          Questions or ideas? Email us at{" "}
          <a href="mailto:hello@lifesecretplus.com">hello@lifesecretplus.com</a>
        </p>
      </section>
    </>
  );
}
