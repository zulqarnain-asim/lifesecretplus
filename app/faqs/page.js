import Link from "next/link";

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about our palmistry readings and self-motivation consulting — how sessions work, what to expect and how to book.",
  alternates: { canonical: "/faqs" },
};

const faqs = [
  {
    q: "What is palmistry and how does it work?",
    a: "Palmistry, also known as chiromancy, is the art of interpreting the lines, shapes and patterns of the hands. During a palm reading session we analyse the features of your palms to provide insights into your personality, life path and potential future events. Each line and shape can reveal unique information about your journey and personal characteristics.",
  },
  {
    q: "How can self-motivation consulting help me?",
    a: "Self-motivation consulting helps you identify and overcome the personal barriers standing between you and your goals. Together we develop strategies to boost your motivation, set realistic objectives and create a personalized action plan — so you can take control of your life and pursue your aspirations with confidence and clarity.",
  },
  {
    q: "How can I book a session with you?",
    a: "Visit our contact page and fill in the form, or send an email. You can also call directly to schedule a convenient time. We offer both in-person and virtual consultations to suit your preferences.",
  },
  {
    q: "What can I expect during a palmistry session?",
    a: "You will be guided through an in-depth analysis of your hands. The palmist examines the lines, mounts and shapes of your palms and discusses their meanings with you. Expect a personalized reading covering personality traits, life challenges and potential future developments.",
  },
];

export default function Faqs() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">FAQ&apos;s</span>
          <h1>Frequently Asked Questions</h1>
          <p>
            Common questions about our palmistry and self-motivation consulting services. If you
            have any others, feel free to reach out.
          </p>
          <p className="crumb">
            <Link href="/">Home</Link> / FAQ&apos;s
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="faq">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <div className="answer">{f.a}</div>
              </details>
            ))}
          </div>

          <div className="section-head" style={{ marginTop: "3.5rem", marginBottom: 0 }}>
            <h2>Still have a question?</h2>
            <p>Send a message and you&apos;ll get a reply within one to two working days.</p>
            <div className="cta-actions" style={{ marginTop: "1.5rem" }}>
              <Link href="/contact" className="btn">
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
