import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with the LifeSecret Plus team — questions, feedback, or topic requests.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Get in touch</h1>
          <p>
            Questions, feedback, or a topic you&rsquo;d like us to cover? Send us
            a message.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "2rem" }}>
        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-aside">
              <h2>We read everything</h2>
              <p>
                Every message reaches a real person. We usually reply within a
                couple of days.
              </p>
              <ul className="contact-info">
                <li>
                  <span className="ci-icon" aria-hidden="true">
                    ✉️
                  </span>
                  <div>
                    <strong>Email</strong>
                    <span>hello@lifesecretplus.com</span>
                  </div>
                </li>
                <li>
                  <span className="ci-icon" aria-hidden="true">
                    ⏱️
                  </span>
                  <div>
                    <strong>Response time</strong>
                    <span>Within 2 business days</span>
                  </div>
                </li>
                <li>
                  <span className="ci-icon" aria-hidden="true">
                    💡
                  </span>
                  <div>
                    <strong>Topic requests</strong>
                    <span>Tell us what you want to read next</span>
                  </div>
                </li>
              </ul>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
