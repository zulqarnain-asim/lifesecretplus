import Link from "next/link";
import ContactForm from "./ContactForm";
import { site, socials } from "../site";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Life Secret Plus to book a palmistry reading, life coaching session or ask a question. In-person and virtual sessions available.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Contact</span>
          <h1>Let&apos;s Talk</h1>
          <p>
            Book a session, ask a question, or simply say hello. Every message is read personally.
          </p>
          <p className="crumb">
            <Link href="/">Home</Link> / Contact
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="contact-grid">
            <aside>
              <span className="eyebrow">Get in touch</span>
              <h2>Ready to start your journey?</h2>
              <p style={{ marginTop: "0.85rem" }}>
                Reach out for personalized consultations and guidance. Sessions are available both
                in person and online.
              </p>

              <ul className="info-list">
                <li className="info-item">
                  <span className="info-icon" aria-hidden="true">
                    ✆
                  </span>
                  <div>
                    <strong>Phone</strong>
                    <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                  </div>
                </li>
                <li className="info-item">
                  <span className="info-icon" aria-hidden="true">
                    ✉
                  </span>
                  <div>
                    <strong>Email</strong>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </div>
                </li>
                <li className="info-item">
                  <span className="info-icon" aria-hidden="true">
                    ◷
                  </span>
                  <div>
                    <strong>Response time</strong>
                    <span>Usually within one to two working days</span>
                  </div>
                </li>
                <li className="info-item">
                  <span className="info-icon" aria-hidden="true">
                    ✦
                  </span>
                  <div>
                    <strong>Follow along</strong>
                    <div className="socials" style={{ marginTop: "0.5rem", color: "var(--brand)" }}>
                      {socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          style={{ background: "var(--brand-soft)" }}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d={s.path} />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              </ul>
            </aside>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
