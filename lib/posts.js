import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { getDbPostBySlug, getDbPosts } from "./db";

const postsDir = path.join(process.cwd(), "posts");

function readFilePosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title,
        date: data.date,
        author: data.author || null,
        image: data.image || null,
        tag: data.tag || "Mindset",
        excerpt: data.excerpt || content.trim().split("\n")[0],
        content,
        source: "file",
      };
    });
}

function fromDbRow(row) {
  return {
    slug: row.slug,
    title: row.title,
    date: new Date(row.published_at).toISOString().slice(0, 10),
    author: row.author,
    image: row.image,
    tag: row.tag || "Mindset",
    excerpt: row.excerpt || row.content.trim().split("\n")[0],
    content: row.content,
    source: "db",
    id: row.id,
  };
}

async function toHtml(markdown) {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

/** Published posts from the database first, then the bundled markdown files. */
export async function getAllPosts() {
  const dbPosts = (await getDbPosts({ status: "published" }).catch(() => [])).map(fromDbRow);
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const filePosts = readFilePosts().filter((p) => !dbSlugs.has(p.slug));

  return [...dbPosts, ...filePosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFilePostSlugs() {
  return readFilePosts().map((p) => p.slug);
}

export async function getPost(slug) {
  const row = await getDbPostBySlug(slug).catch(() => null);
  if (row) {
    const post = fromDbRow(row);
    return { ...post, contentHtml: await toHtml(post.content) };
  }

  const file = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    slug,
    title: data.title,
    date: data.date,
    author: data.author || null,
    image: data.image || null,
    tag: data.tag || "Mindset",
    excerpt: data.excerpt || content.trim().split("\n")[0],
    contentHtml: await toHtml(content),
    source: "file",
  };
}
