import { Poppins } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "./SiteHeader";
import { site, nav, socials } from "./site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Life Secret Plus — Palmistry Readings & Life Coaching",
    template: "%s — Life Secret Plus",
  },
  description:
    "Life Secret Plus offers palm readings, life coaching and positive psychology guidance with Shaheen Haq — helping you build a balanced, meaningful and joyful life.",
  keywords: [
    "palmistry",
    "palm reading",
    "life coaching",
    "positive psychology",
    "self motivation consulting",
    "mindfulness training",
    "personal development",
    "Shaheen Haq",
  ],
  authors: [{ name: site.author }],
  creator: site.author,
  alternates: { canonical: "/" },
  icons: { icon: "/images/shared/favicon-lifesecret-plus.png" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "Life Secret Plus — Palmistry Readings & Life Coaching",
    description:
      "Palm readings, life coaching and positive psychology guidance to help you live a balanced, meaningful life.",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Secret Plus — Palmistry Readings & Life Coaching",
    description:
      "Palm readings, life coaching and positive psychology guidance to help you live a balanced, meaningful life.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  themeColor: "#6d28d9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <SiteHeader />
        <main>{children}</main>

        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-col">
              <Link href="/" className="brand">
                <span className="brand-mark" aria-hidden="true">
                  ✦
                </span>
                <span>
                  Life Secret Plus
                  <small>Insight &amp; Guidance</small>
                </span>
              </Link>
              <p>
                Empowering lives with insight and guidance — palmistry readings, life coaching and
                positive psychology to help you build a balanced, meaningful life.
              </p>
              <div className="socials">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                <li>
                  <Link href="/services">Palm Reading</Link>
                </li>
                <li>
                  <Link href="/services">Future Predictions</Link>
                </li>
                <li>
                  <Link href="/services">Relationship Guidance</Link>
                </li>
                <li>
                  <Link href="/services">Life Coaching</Link>
                </li>
                <li>
                  <Link href="/services">Mindfulness Training</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col subscribe">
              <h4>Get in Touch</h4>
              <ul className="footer-contact">
                <li>
                  <i aria-hidden="true">✆</i>
                  <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                </li>
                <li>
                  <i aria-hidden="true">✉</i>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                <li>
                  <i aria-hidden="true">◷</i>
                  <span>In-person &amp; virtual sessions · replies within 1–2 days</span>
                </li>
              </ul>
              <Link href="/contact" className="btn btn-sm" style={{ marginTop: "0.5rem" }}>
                Book a Session
              </Link>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-inner">
              <span>© {year} Life Secret Plus. All rights reserved.</span>
              <span>Made with care for your personal growth.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
