import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Our Services",
  description:
    "Palm reading, future predictions, relationship guidance, life coaching, mindfulness training and positive psychology workshops with Life Secret Plus.",
  alternates: { canonical: "/services" },
};

const services = [
  { icon: "✋", title: "Palm Reading", text: "A comprehensive palm reading that reveals insights into your personality, health, career and relationships." },
  { icon: "◉", title: "Future Predictions", text: "Traditional methods used to read the signs of upcoming life changes and guide you through them." },
  { icon: "❤", title: "Relationship Guidance", text: "Insight into your relationships and love life, helping you navigate emotional challenges." },
  { icon: "☘", title: "Mental Health Well-being", text: "Comprehensive support and resources to enhance your mental health and overall well-being." },
  { icon: "▲", title: "Life Coaching", text: "Coaching that helps you achieve personal goals and create a more meaningful, joyful life." },
  { icon: "❂", title: "Positive Psychology Workshops", text: "Workshops focused on positive thinking and self-discovery to improve overall happiness." },
  { icon: "◍", title: "Mindfulness Training", text: "Learn mindfulness techniques that reduce stress and improve mental clarity and focus." },
  { icon: "➜", title: "Personal Development Programs", text: "Structured programs designed to foster personal growth and steady self-improvement." },
  { icon: "✎", title: "Creative Arts Therapy", text: "Use creative arts as a therapeutic approach to enhance your emotional well-being." },
];

const benefits = [
  {
    title: "Self-Awareness",
    text: "Gain a deeper understanding of your personality, strengths and areas for growth.",
    img: "/images/services/services-benefit-self-awareness.jpeg",
  },
  {
    title: "Life Path Guidance",
    text: "Receive guidance on making informed decisions and choosing the right path in life.",
    img: "/images/services/services-benefit-life-path-guidance.jpeg",
  },
  {
    title: "Relationship Insights",
    text: "Understand your relationship dynamics and how to nurture meaningful connections.",
    img: "/images/services/services-benefit-relationship-insights.jpeg",
  },
];

const steps = [
  {
    title: "Initial Consultation",
    text: "We begin by understanding your concerns and the areas of your life you'd like to explore.",
    img: "/images/services/services-step-1-initial-consultation.jpeg",
  },
  {
    title: "Palm Reading Session",
    text: "Your palmist carefully examines the lines, shapes and patterns of your hands.",
    img: "/images/services/services-step-2-palm-reading-session.jpeg",
  },
  {
    title: "Detailed Analysis",
    text: "You receive a detailed analysis explaining what each line reveals about your life.",
    img: "/images/services/services-step-3-detailed-analysis.jpeg",
  },
  {
    title: "Personalized Guidance",
    text: "Based on the reading, we offer personalized advice to help you move forward with confidence.",
    img: "/images/services/services-step-4-personalized-guidance.jpeg",
  },
];

export default function Services() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Our services</span>
          <h1>What We Do</h1>
          <p>
            A wide range of services designed to help you live a meaningful and joyful life.
          </p>
          <p className="crumb">
            <Link href="/">Home</Link> / Our services
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow center">Our Services</span>
            <h2>
              Support for a <span className="grad-text">meaningful and joyful</span> life
            </h2>
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
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow center">Our Palmistry Services</span>
            <h2>Discover your destiny through the art of palmistry</h2>
            <p>
              Explore the ancient practice of palmistry, where the lines of your palm reveal secrets
              about your life, personality and future.
            </p>
          </div>

          <div className="split">
            <div className="split-media">
              <Image
                src="/images/services/services-palmistry-overview.jpeg"
                alt="Palmistry overview — reading the lines of the hand"
                fill
                sizes="(max-width: 960px) 92vw, 540px"
              />
            </div>
            <div className="split-body">
              <span className="eyebrow">What is Palmistry?</span>
              <h2>The art of reading the hands</h2>
              <p>
                Palmistry, also known as chiromancy, is the art of interpreting the lines, shapes
                and patterns of your hands. Your hands hold vital clues to your inner self and the
                life you are destined to live.
              </p>
              <p>
                Our readings offer insight into your character, strengths, challenges and potential
                future events — combining traditional technique with modern understanding for the
                most helpful reading possible.
              </p>
              <Link href="/contact" className="btn">
                Book a reading
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow center">Benefits</span>
            <h2>What a palmistry reading gives you</h2>
          </div>
          <div className="grid grid-3">
            {benefits.map((b) => (
              <article className="tile" key={b.title}>
                <Image src={b.img} alt={b.title} width={640} height={520} sizes="(max-width: 960px) 92vw, 360px" />
                <div className="tile-body">
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow center">How it works</span>
            <h2>Our palmistry reading process</h2>
          </div>
          <div className="steps">
            {steps.map((s, i) => (
              <article className="step" key={s.title}>
                <div className="step-media">
                  <Image src={s.img} alt={s.title} width={520} height={330} sizes="(max-width: 960px) 92vw, 280px" />
                </div>
                <div className="step-body">
                  <span className="step-num">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid-2">
            <figure className="quote">
              <div className="stars" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <p>
                “The palmistry reading was incredibly accurate. It gave me clarity on my career path
                and relationships.”
              </p>
              <figcaption>
                <footer>
                  <span className="avatar" aria-hidden="true">
                    W
                  </span>
                  <span>
                    <strong>Williams</strong>
                    <span>Palm reading client</span>
                  </span>
                </footer>
              </figcaption>
            </figure>
            <figure className="quote">
              <div className="stars" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <p>
                “I was amazed by the insights provided through the palm reading. It has positively
                impacted my life.”
              </p>
              <figcaption>
                <footer>
                  <span className="avatar" aria-hidden="true">
                    Z
                  </span>
                  <span>
                    <strong>Zulqarnain</strong>
                    <span>Palm reading client</span>
                  </span>
                </footer>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap">
          <div className="cta-band">
            <span className="eyebrow center">Take the first step</span>
            <h2>Book your palmistry session today</h2>
            <p>
              Ready to discover the secrets in your palms? Get in touch to book your session and
              take the first step towards a deeper understanding of yourself.
            </p>
            <div className="cta-actions">
              <Link href="/contact" className="btn btn-light">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
