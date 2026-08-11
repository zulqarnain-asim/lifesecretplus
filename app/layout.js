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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <header className="site-header">
          <nav className="nav">
            <Link className="brand" href="/">
              LifeSecret<span>+</span>
            </Link>
            <ul className="nav-links">
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/#about">About</Link>
              </li>
              <li>
                <Link className="nav-cta" href="/#contact">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="footer-inner">
            <Link className="brand brand-footer" href="/">
              LifeSecret<span>+</span>
            </Link>
            <p className="footer-tagline">
              Practical wisdom for a calmer mind and a healthier life.
            </p>
            <nav className="footer-links">
              <Link href="/blog">Blog</Link>
              <Link href="/#about">About</Link>
              <a href="mailto:hello@lifesecretplus.com">Email us</a>
            </nav>
            <p className="footer-copy">
              &copy; 2026 LifeSecret Plus. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
