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

export async function getContactMessages({ limit = 50, offset = 0 } = {}) {
  const pool = getPool();
  if (!pool) return [];
  await ensureSchema(pool);

  const { rows } = await pool.query(
    `SELECT id, name, email, subject, message, status, created_at
     FROM contact_messages
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
}
