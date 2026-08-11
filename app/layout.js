import "./globals.css";
import Link from "next/link";
import { Inter, Newsreader } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata = {
  metadataBase: new URL("https://lifesecretplus.com"),
  title: {
    default: "LifeSecret Plus — Mental Health & Wellbeing",
    template: "%s — LifeSecret Plus",
  },
  description:
    "Practical mental health tips, wellbeing guides, and everyday wisdom for a calmer mind and a healthier life.",
  keywords: [
    "mental health",
    "wellbeing",
    "mindfulness",
    "stress relief",
    "self care",
    "healthy habits",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://lifesecretplus.com",
    siteName: "LifeSecret Plus",
    title: "LifeSecret Plus — Mental Health & Wellbeing",
    description:
      "Practical mental health tips, wellbeing guides, and everyday wisdom for a calmer mind and a healthier life.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeSecret Plus — Mental Health & Wellbeing",
    description:
      "Practical mental health tips, wellbeing guides, and everyday wisdom.",
  },
  robots: { index: true, follow: true },
};

function Brand() {
  return (
    <Link className="brand" href="/">
      <span className="brand-mark">L</span>
      LifeSecret Plus
    </Link>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <header className="site-header">
          <nav className="nav">
            <Brand />
            <ul className="nav-links">
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link className="nav-cta" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="footer-grid">
            <div>
              <Brand />
              <p>
                Practical, evidence-based guidance for a calmer mind and a
                healthier everyday life.
              </p>
            </div>
            <div className="footer-col">
              <h4>Explore</h4>
              <Link href="/">Home</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="mailto:hello@lifesecretplus.com">
                hello@lifesecretplus.com
              </a>
              <Link href="/contact">Send a message</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} LifeSecret Plus.</span>
            <span>Built for calmer, healthier days.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
