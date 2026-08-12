import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "../lib/posts";
import { site } from "./site";

export const metadata = {
  title: "Life Secret Plus — Palmistry Readings & Life Coaching",
  description:
    "Empowering lives with insight and guidance. Palm readings, life coaching, mindfulness and positive psychology with Shaheen Haq.",
  alternates: { canonical: "/" },
};

const pillars = [
  {
    icon: "☀",
    title: "Positive Mindset Cultivation",
    text: "Workshops and resources that help you build a positive, resilient mindset you can rely on every day.",
  },
  {
    icon: "✧",
    title: "Personalized Guidance",
    text: "Tailored one-to-one guidance that supports your personal growth, self-discovery and confidence.",
  },
  {
    icon: "◈",
    title: "Holistic Development",
    text: "Insights from psychology, palmistry and astrology brought together for whole-person development.",
  },
];

const services = [
  { icon: "✋", title: "Palm Reading", text: "A comprehensive reading that reveals insights into your personality, health, career and relationships." },
  { icon: "◉", title: "Future Predictions", text: "Traditional palmistry methods used to guide you through the life changes ahead of you." },
  { icon: "❤", title: "Relationship Guidance", text: "Understand your relationship dynamics and navigate emotional challenges with clarity." },
  { icon: "☘", title: "Mental Health Well-being", text: "Compassionate support and practical resources to protect your mental health and balance." },
  { icon: "▲", title: "Life Coaching", text: "Set meaningful goals and build a life that feels purposeful, joyful and truly yours." },
  { icon: "❂", title: "Positive Psychology Workshops", text: "Group sessions focused on positive thinking, self-discovery and lasting happiness." },
];

const stats = [
  { value: "100+", label: "Blog Posts Published" },
  { value: "30K", label: "Monthly Readers" },
  { value: "10", label: "Countries Reached" },
  { value: "3", label: "Blog Awards Won" },
];

const testimonials = [
  {
    name: "Zulqarnain",
    role: "Life Secret Plus Follower",
    quote:
      "Life Secret Plus is my daily source of inspiration. Every post and resource has helped me embrace life with more positivity and courage.",
  },
  {
    name: "Asim Raza",
    role: "Devoted Follower",
    quote:
      "The motivation I get from Life Secret Plus has truly transformed my outlook. It's not just a website — it's a community where I feel supported.",
  },
  {
    name: "Ayan Ikram",
    role: "Passionate Follower",
    quote:
      "My go-to place for finding peace and encouragement. The advice and stories shared here resonate deeply and have guided me through challenges.",
  },
  {
    name: "Syra Khan",
    role: "Loyal Follower",
    quote:
      "Following Life Secret Plus has been life-changing. The wisdom and positivity shared here helped me become a better, more fulfilled person.",
  },
];

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <span className="eyebrow">Prepare for a new future</span>
            <h1>
              Empower <span className="grad-text">Your Journey</span>
            </h1>
            <p className="hero-lead">
              Empowering lives with insight and guidance. I provide personalized palmistry readings,
              life coaching and positive psychology support to help you achieve a balanced and
              meaningful life.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn">
                Book a Session →
              </Link>
              <Link href="/services" className="btn btn-outline">
                Explore Services
              </Link>
            </div>
            <ul className="hero-badges">
              <li className="chip">
                <i aria-hidden="true" /> Palmistry &amp; Chiromancy
              </li>
              <li className="chip">
                <i aria-hidden="true" /> Life Coaching
              </li>
              <li className="chip">
                <i aria-hidden="true" /> Positive Psychology
              </li>
            </ul>
          </div>

          <div className="hero-visual">
            <div className="hero-photo">
              <Image
                src="/images/about/author-shaheen-haq.jpg"
                alt="Shaheen Haq, founder of Life Secret Plus"
                fill
                priority
                sizes="(max-width: 960px) 90vw, 460px"
              />
            </div>
            <div className="hero-float one">
              <span className="dot" aria-hidden="true">
                ✦
              </span>
              <div>
                <strong>Shaheen Haq</strong>
                <span>Palmist &amp; Life Coach</span>
              </div>
            </div>
            <div className="hero-float two">
              <span className="dot" aria-hidden="true">
                ★
              </span>
              <div>
                <strong>30K+</strong>
                <span>Monthly readers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow center">Empowering Lives with Insight &amp; Guidance</span>
            <h2>
              Personalized support to help you achieve a{" "}
              <span className="grad-text">balanced, meaningful life</span>
            </h2>
          </div>
          <div className="grid grid-3">
            {pillars.map((p) => (
              <article className="card" key={p.title}>
                <div className="card-icon" aria-hidden="true">
                  {p.icon}
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who I am */}
      <section className="section section-soft">
        <div className="wrap">
          <div className="split">
            <div className="split-media">
              <Image
                src="/images/services/services-palmistry-overview.jpeg"
                alt="A palmistry reading session in progress"
                fill
                sizes="(max-width: 960px) 92vw, 540px"
              />
            </div>
            <div className="split-body">
              <span className="eyebrow">Who I Am</span>
              <h2>I am dedicated to your personal growth</h2>
              <p>
                At Life Secret Plus, I provide personalized guidance and resources to help you
                achieve a balanced, fulfilling life. My approach integrates positive mindset
                cultivation, self-discovery and practical strategies for personal development.
              </p>
              <ul className="checks">
                <li>Readings that combine traditional palmistry with modern insight</li>
                <li>Practical, judgement-free coaching for real life</li>
                <li>In-person and virtual sessions to suit your schedule</li>
              </ul>
              <Link href="/about" className="btn">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="wrap">
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section section-soft">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow center">My Services</span>
            <h2>A variety of services to enhance your well-being</h2>
            <p>
              From palm readings to life coaching and mindfulness training — choose the support that
              fits where you are right now.
            </p>
          </div>
          <div className="grid grid-3">
            {services.map((s) => (
              <article className="card" key={s.title}>
                <div className="card-icon" aria-hidden="true">
                  {s.icon}
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link href="/services" className="btn btn-outline">
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="section">
        <div className="wrap">
          <div className="cta-band">
            <span className="eyebrow center">Get in Touch</span>
            <h2>Let&apos;s work together to make your ideas shine</h2>
            <a className="cta-phone" href={`tel:${site.phoneHref}`}>
              📱 {site.phone}
            </a>
            <p>
              Reach out for personalized consultations, guidance and strategy tailored to your
              journey. I usually reply within one to two working days.
            </p>
            <div className="cta-actions">
              <Link href="/contact" className="btn btn-light">
                Contact Me
              </Link>
              <Link href="/faqs" className="btn btn-outline">
                Read the FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-soft">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow center">What Our Community Says</span>
            <h2>See how Life Secret Plus has touched lives</h2>
          </div>
          <div className="grid grid-2">
            {testimonials.map((t) => (
              <figure className="quote" key={t.name}>
                <div className="stars" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                <p>“{t.quote}”</p>
                <figcaption>
                  <footer>
                    <span className="avatar" aria-hidden="true">
                      {t.name.charAt(0)}
                    </span>
                    <span>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </span>
                  </footer>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow center">Latest Insights</span>
              <h2>Resources to inspire and empower you</h2>
            </div>
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
                      <span className="tag">Inspiration</span>
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
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link href="/blog" className="btn btn-outline">
                Visit the blog
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Bottom band */}
      <section className="section section-soft">
        <div className="wrap">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow center">For Everyone Seeking Personal Growth</span>
            <h2>Transform your life with expert guidance and resources</h2>
            <p>
              Whether you are curious about palmistry or ready to commit to real change, there is a
              place for you here.
            </p>
            <div className="cta-actions" style={{ marginTop: "1.75rem" }}>
              <Link href="/contact" className="btn">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
