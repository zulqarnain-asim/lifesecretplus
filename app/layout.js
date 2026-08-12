import { Poppins } from "next/font/google";
import "./globals.css";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { site } from "./site";

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
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
