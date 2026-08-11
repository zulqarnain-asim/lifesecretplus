import "./globals.css";
import Link from "next/link";

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
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="nav">
            <Link className="brand" href="/">
              LifeSecret<span>Plus</span>
            </Link>
            <ul className="nav-links">
              <li>
                <Link href="/#about">About</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/#contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>&copy; 2026 LifeSecret Plus. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
