import pg from "pg";

// Vercel's Postgres/Neon integration injects DATABASE_URL; POSTGRES_URL is the legacy name.
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export const isDatabaseConfigured = Boolean(connectionString);

const isLocal = /@(localhost|127\.0\.0\.1)/.test(connectionString || "");

// Reused across hot reloads in dev and across warm serverless invocations in production.
const globalForDb = globalThis;

function getPool() {
  if (!connectionString) return null;
  globalForDb._pgPool ??= new pg.Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: true },
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });
  return globalForDb._pgPool;
}

function ensureSchema(pool) {
  globalForDb._pgSchema ??= (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id         bigserial PRIMARY KEY,
        name       text NOT NULL,
        email      text NOT NULL,
        subject    text,
        message    text NOT NULL,
        ip         text,
        user_agent text,
        status     text NOT NULL DEFAULT 'new',
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
      ON contact_messages (created_at DESC)
    `);
  })();
  return globalForDb._pgSchema;
}

export async function saveContactMessage({ name, email, subject, message, ip, userAgent }) {
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema(pool);

  const { rows } = await pool.query(
    `INSERT INTO contact_messages (name, email, subject, message, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, created_at`,
    [name, email, subject || null, message, ip || null, userAgent || null]
  );
  return rows[0];
}

export async function getContactMessages({ limit = 50, offset = 0, status, q } = {}) {
  const pool = getPool();
  if (!pool) return [];
  await ensureSchema(pool);

  const where = [];
  const values = [];

  if (status === "new" || status === "read") {
    values.push(status);
    where.push(`status = $${values.length}`);
  }
  if (q) {
    values.push(`%${q}%`);
    where.push(
      `(name ILIKE $${values.length} OR email ILIKE $${values.length} OR subject ILIKE $${values.length} OR message ILIKE $${values.length})`
    );
  }

  values.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT id, name, email, subject, message, status, created_at
     FROM contact_messages
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return rows;
}

export async function countContactMessages() {
  const pool = getPool();
  if (!pool) return { total: 0, unread: 0 };
  await ensureSchema(pool);

  const { rows } = await pool.query(
    `SELECT count(*) AS total, count(*) FILTER (WHERE status = 'new') AS unread
     FROM contact_messages`
  );
  return { total: Number(rows[0].total), unread: Number(rows[0].unread) };
}

export async function setContactMessageStatus(id, status) {
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema(pool);

  const { rows } = await pool.query(
    `UPDATE contact_messages SET status = $2 WHERE id = $1 RETURNING id`,
    [id, status]
  );
  return rows[0] || null;
}

export async function deleteContactMessage(id) {
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema(pool);

  const { rows } = await pool.query(
    `DELETE FROM contact_messages WHERE id = $1 RETURNING id`,
    [id]
  );
  return rows[0] || null;
}

/* ---------- Blog posts ---------- */

function ensurePostSchema(pool) {
  globalForDb._pgPostSchema ??= (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id           bigserial PRIMARY KEY,
        slug         text UNIQUE NOT NULL,
        title        text NOT NULL,
        excerpt      text,
        image        text,
        author       text,
        tag          text,
        content      text NOT NULL,
        status       text NOT NULL DEFAULT 'published',
        published_at timestamptz NOT NULL DEFAULT now(),
        updated_at   timestamptz NOT NULL DEFAULT now()
      )
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx
      ON blog_posts (published_at DESC)
    `);
  })();
  return globalForDb._pgPostSchema;
}

const POST_COLUMNS = `id, slug, title, excerpt, image, author, tag, content, status, published_at, updated_at`;

export async function getDbPosts({ status = "published" } = {}) {
  const pool = getPool();
  if (!pool) return [];
  await ensurePostSchema(pool);

  const { rows } = await pool.query(
    status === "all"
      ? `SELECT ${POST_COLUMNS} FROM blog_posts ORDER BY published_at DESC`
      : `SELECT ${POST_COLUMNS} FROM blog_posts WHERE status = $1 ORDER BY published_at DESC`,
    status === "all" ? [] : [status]
  );
  return rows;
}

export async function getDbPostBySlug(slug, { includeDrafts = false } = {}) {
  const pool = getPool();
  if (!pool) return null;
  await ensurePostSchema(pool);

  const { rows } = await pool.query(
    includeDrafts
      ? `SELECT ${POST_COLUMNS} FROM blog_posts WHERE slug = $1`
      : `SELECT ${POST_COLUMNS} FROM blog_posts WHERE slug = $1 AND status = 'published'`,
    [slug]
  );
  return rows[0] || null;
}

export async function getDbPostById(id) {
  const pool = getPool();
  if (!pool) return null;
  await ensurePostSchema(pool);

  const { rows } = await pool.query(`SELECT ${POST_COLUMNS} FROM blog_posts WHERE id = $1`, [id]);
  return rows[0] || null;
}

export async function createDbPost(post) {
  const pool = getPool();
  if (!pool) return null;
  await ensurePostSchema(pool);

  const { rows } = await pool.query(
    `INSERT INTO blog_posts (slug, title, excerpt, image, author, tag, content, status, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9::timestamptz, now()))
     RETURNING id, slug`,
    [
      post.slug,
      post.title,
      post.excerpt || null,
      post.image || null,
      post.author || null,
      post.tag || null,
      post.content,
      post.status || "published",
      post.publishedAt || null,
    ]
  );
  return rows[0];
}

export async function updateDbPost(id, post) {
  const pool = getPool();
  if (!pool) return null;
  await ensurePostSchema(pool);

  const { rows } = await pool.query(
    `UPDATE blog_posts
     SET slug = $2, title = $3, excerpt = $4, image = $5, author = $6, tag = $7,
         content = $8, status = $9, published_at = COALESCE($10::timestamptz, published_at),
         updated_at = now()
     WHERE id = $1
     RETURNING id, slug`,
    [
      id,
      post.slug,
      post.title,
      post.excerpt || null,
      post.image || null,
      post.author || null,
      post.tag || null,
      post.content,
      post.status || "published",
      post.publishedAt || null,
    ]
  );
  return rows[0] || null;
}

export async function deleteDbPost(id) {
  const pool = getPool();
  if (!pool) return null;
  await ensurePostSchema(pool);

  const { rows } = await pool.query(`DELETE FROM blog_posts WHERE id = $1 RETURNING id, slug`, [id]);
  return rows[0] || null;
}

/* ---------- Uploaded images ---------- */

function ensureImageSchema(pool) {
  globalForDb._pgImageSchema ??= (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS post_images (
        id         bigserial PRIMARY KEY,
        filename   text NOT NULL,
        mime       text NOT NULL,
        bytes      bytea NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
  })();
  return globalForDb._pgImageSchema;
}

export async function saveImage({ filename, mime, buffer }) {
  const pool = getPool();
  if (!pool) return null;
  await ensureImageSchema(pool);

  const { rows } = await pool.query(
    `INSERT INTO post_images (filename, mime, bytes) VALUES ($1, $2, $3) RETURNING id`,
    [filename, mime, buffer]
  );
  return rows[0];
}

export async function getImage(id) {
  const pool = getPool();
  if (!pool) return null;
  await ensureImageSchema(pool);

  const { rows } = await pool.query(`SELECT mime, bytes FROM post_images WHERE id = $1`, [id]);
  return rows[0] || null;
}
