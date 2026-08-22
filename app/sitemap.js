import { getAllPosts } from "../lib/posts";
import { site } from "./site";

export default async function sitemap() {
  const base = site.url;
  const posts = (await getAllPosts()).map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.modified || post.date,
    changeFrequency: "monthly",
    priority: 0.8,
    images: post.image ? [`${base}${post.image}`] : undefined,
  }));
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/faqs`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.7 },
    ...posts,
  ];
}
