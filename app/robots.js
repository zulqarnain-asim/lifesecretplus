export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: "https://lifesecretplus.com/sitemap.xml",
  };
}
