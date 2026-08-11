import { getAllPosts } from "../lib/posts";

export default function sitemap() {
  const base = "https://lifesecretplus.com";
  const posts = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.9 },
    ...posts,
  ];
}
