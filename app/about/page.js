import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About Us",
  description:
    "Life Secret Plus empowers individuals through workshops, seminars and online resources — cultivating positive mindsets, self-love and balanced, meaningful lives.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    num: "01",
    title: "Our Mission",
    text: "To empower individuals to discover their inner beauty, embrace positive thinking and create a harmonious balance in all aspects of life. We provide the tools, resources and guidance that lead to greater peace, health and happiness.",
  },
  {
    num: "02",
    title: "Our Vision",
    text: "A world where every individual values their unique self and nurtures their inner light to build a beautiful, fulfilling life — a society where positivity, self-love and personal growth are celebrated.",
  },
  {
    num: "03",
    title: "Our Approach",
    text: "We focus on cultivating a positive mindset, self-discovery and alignment with your inner values. Our workshops and resources combine psychology, palmistry, astrology and practical strategy, delivered with personalized guidance.",
  },
];

const stats = [
  { value: "100+", label: "Work Done" },
  { value: "36K", label: "Followers" },
  { value: "4", label: "Community Groups" },
  { value: "10", label: "Countries Reached" },
];

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">About Us</span>
          <h1>Our Company</h1>
          <p>Empowering lives with insight and guidance since day one.</p>
          <p className="crumb">
            <Link href="/">Home</Link> / About Us
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="split-media">
              <Image
                src="/images/about/author-shaheen-haq.jpg"
                alt="Shaheen Haq, founder of Life Secret Plus"
                fill
                sizes="(max-width: 960px) 92vw, 540px"
                priority
              />
            </div>
            <div className="split-body">
              <span className="eyebrow">What we are</span>
              <h2>Empowering lives for balance and meaning</h2>
              <p>
                Our current focus is on empowering individuals through workshops, seminars and
                online resources. We aim to cultivate positive mindsets, promote self-love and inner
                beauty, and guide people in creating balanced and meaningful lives.
              </p>
              <ul className="checks">
                <li>Personalized palmistry readings rooted in tradition</li>
                <li>Life coaching that turns intention into action</li>
                <li>Positive psychology tools you can use every day</li>
              </ul>
              <Link href="/blog" className="btn">
                Get started →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow center">What drives us</span>
            <h2>Mission, vision and approach</h2>
          </div>
          <div className="grid grid-3">
            {values.map((v) => (
              <article className="card" key={v.num}>
                <div className="card-icon" aria-hidden="true">
                  {v.num}
                </div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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

      <section className="section section-soft">
        <div className="wrap">
          <div className="cta-band">
            <span className="eyebrow center">Ready when you are</span>
            <h2>Start your journey towards a balanced life</h2>
            <p>
              Book a consultation and let&apos;s explore what your next chapter could look like.
            </p>
            <div className="cta-actions">
              <Link href="/contact" className="btn btn-light">
                Book a Session
              </Link>
              <Link href="/services" className="btn btn-outline">
                See Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
