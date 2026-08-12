import { site } from "./site";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
