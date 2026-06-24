const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { DEFAULT_THEME, normalizeTheme } = require("./lib/theme");

const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "apollo.db");

let db = null;
let initialized = false;

function getDb() {
  if (db) return db;
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  let Database;
  try {
    Database = require("better-sqlite3");
  } catch (err) {
    const hint =
      "Run: npm rebuild better-sqlite3 (use the same Node version as npm start — see .nvmrc)";
    throw new Error(`${err.message}\n\n${hint}`);
  }

  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  if (!initialized) {
    initDb();
    seedAdmin();
    seedPosts();
    seedThemeSettings();
    initialized = true;
  }

  return db;
}

function initDb() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK (type IN ('blog', 'daily', 'special', 'trend', 'news')),
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      excerpt TEXT,
      body TEXT,
      category TEXT,
      link_url TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      published_at TEXT,
      expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
    CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function seedThemeSettings() {
  const row = getDb().prepare("SELECT value FROM site_settings WHERE key = 'theme'").get();
  if (row) return;
  getDb()
    .prepare("INSERT INTO site_settings (key, value) VALUES ('theme', ?)")
    .run(JSON.stringify(DEFAULT_THEME));
}

function getThemeSettings() {
  const row = getDb().prepare("SELECT value FROM site_settings WHERE key = 'theme'").get();
  if (!row) return normalizeTheme(DEFAULT_THEME);
  try {
    return normalizeTheme(JSON.parse(row.value));
  } catch {
    return normalizeTheme(DEFAULT_THEME);
  }
}

function saveThemeSettings(theme) {
  const normalized = normalizeTheme(theme);
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO site_settings (key, value, updated_at) VALUES ('theme', ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .run(JSON.stringify(normalized), now);
  return normalized;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@apolloauto.us").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn("Warning: ADMIN_PASSWORD not set. Admin user was not created.");
    return;
  }
  const count = getDb().prepare("SELECT COUNT(*) AS c FROM admin_users").get().c;
  if (count === 0) {
    upsertAdmin(email, password);
    console.log(`Admin user created for ${email}`);
    return;
  }
  const existing = getDb().prepare("SELECT id FROM admin_users WHERE email = ?").get(email);
  if (!existing) {
    upsertAdmin(email, password);
    console.log(`Admin user created for ${email}`);
  }
}

function upsertAdmin(email, password) {
  const normalized = String(email).trim().toLowerCase();
  if (!password) throw new Error("Password required");
  const hash = bcrypt.hashSync(password, 12);
  const existing = getDb().prepare("SELECT id FROM admin_users WHERE email = ?").get(normalized);
  if (existing) {
    getDb()
      .prepare("UPDATE admin_users SET password_hash = ? WHERE email = ?")
      .run(hash, normalized);
    return { created: false, email: normalized };
  }
  getDb()
    .prepare("INSERT INTO admin_users (email, password_hash) VALUES (?, ?)")
    .run(normalized, hash);
  return { created: true, email: normalized };
}

function seedPosts() {
  const count = getDb().prepare("SELECT COUNT(*) AS c FROM posts").get().c;
  if (count > 0) return;

  const now = new Date().toISOString();
  const insert = getDb().prepare(`
    INSERT INTO posts (type, title, slug, excerpt, body, category, active, published_at)
    VALUES (@type, @title, @slug, @excerpt, @body, @category, 1, @published_at)
  `);

  const blogs = [
    {
      title: "Buying a Used Car With Bad Credit",
      slug: "bad-credit-financing",
      category: "Financing",
      excerpt:
        "What matters when your score isn't great, and what to do before you apply.",
      body: "<p>A low credit score doesn't mean you're stuck without a car. Every week we talk to buyers who got turned down somewhere else. Here's what lenders actually care about, and how to prepare.</p>",
    },
    {
      title: "Used Car Inspection Checklist",
      slug: "used-car-inspection-checklist",
      category: "Buyer's Guide",
      excerpt: "A simple walk-around and test drive list before you sign anything.",
      body: "<p>Take fifteen minutes to go through this list before you commit. It's a small step that can save you a lot of headache later.</p>",
    },
    {
      title: "First-Time Buyer Guide",
      slug: "first-time-buyer-guide",
      category: "First-Time Buyers",
      excerpt: "Budget, financing, and questions to ask if this is your first car.",
      body: "<p>Buying your first car is a big deal. This guide covers the basics so you don't stretch your budget too thin.</p>",
    },
    {
      title: "Trade-In Tips: Get More for Your Current Car",
      slug: "trade-in-tips",
      category: "Trade-In",
      excerpt: "How trade-ins work here and how to get your car ready.",
      body: "<p>Trading in your current vehicle can lower what you need to finance and keep everything in one place.</p>",
    },
  ];

  for (const b of blogs) {
    insert.run({ type: "blog", published_at: now, ...b });
  }

  insert.run({
    type: "daily",
    title: "Welcome to Apollo Auto",
    slug: null,
    excerpt: "Family-owned pre-owned dealerships in Ventura and Los Angeles counties. Reliable cars, trucks, and SUVs at fair prices. Financing for all credit types. Call or text Tim at (805) 404-3873.",
    body: null,
    category: null,
    published_at: now,
  });

  insert.run({
    type: "special",
    title: "Ask about financing today",
    slug: "financing-special",
    excerpt: "Most customers qualify. Call or text Tim to discuss options with no pressure.",
    body: null,
    category: null,
    published_at: now,
    expires_at: null,
  });

  console.log("Seeded sample blog posts and announcements.");
}

function verifyAdmin(email, password) {
  const user = getDb().prepare("SELECT * FROM admin_users WHERE email = ?").get(email.toLowerCase());
  if (!user) return null;
  const ok = bcrypt.compareSync(password, user.password_hash);
  return ok ? { id: user.id, email: user.email } : null;
}

function listPosts({ type, activeOnly = false, publicOnly = false } = {}) {
  let sql = "SELECT * FROM posts WHERE 1=1";
  const params = [];
  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }
  if (activeOnly) {
    sql += " AND active = 1";
  }
  if (publicOnly) {
    sql += " AND (expires_at IS NULL OR expires_at > datetime('now'))";
  }
  sql += " ORDER BY COALESCE(published_at, created_at) DESC";
  return getDb().prepare(sql).all(...params);
}

function getPostBySlug(slug) {
  return getDb()
    .prepare(
      `SELECT * FROM posts WHERE slug = ? AND active = 1
       AND (expires_at IS NULL OR expires_at > datetime('now'))`
    )
    .get(slug);
}

function getPostById(id) {
  return getDb().prepare("SELECT * FROM posts WHERE id = ?").get(id);
}

function savePost(data) {
  const now = new Date().toISOString();
  if (data.id) {
    getDb().prepare(`
      UPDATE posts SET
        type = @type, title = @title, slug = @slug, excerpt = @excerpt, body = @body,
        category = @category, link_url = @link_url, active = @active,
        published_at = @published_at, expires_at = @expires_at, updated_at = @now
      WHERE id = @id
    `).run({ ...data, active: data.active ? 1 : 0, now });
    return getPostById(data.id);
  }
  const slug = data.slug || (data.type === "blog" ? slugify(data.title) : null);
  const info = getDb().prepare(`
    INSERT INTO posts (type, title, slug, excerpt, body, category, link_url, active, published_at, expires_at, updated_at)
    VALUES (@type, @title, @slug, @excerpt, @body, @category, @link_url, @active, @published_at, @expires_at, @now)
  `).run({
    type: data.type,
    title: data.title,
    slug,
    excerpt: data.excerpt || null,
    body: data.body || null,
    category: data.category || null,
    link_url: data.link_url || null,
    active: data.active ? 1 : 0,
    published_at: data.published_at || now,
    expires_at: data.expires_at || null,
    now,
  });
  return getPostById(info.lastInsertRowid);
}

function deletePost(id) {
  getDb().prepare("DELETE FROM posts WHERE id = ?").run(id);
}

module.exports = {
  getDb,
  upsertAdmin,
  verifyAdmin,
  listPosts,
  getPostBySlug,
  getPostById,
  savePost,
  deletePost,
  slugify,
  getThemeSettings,
  saveThemeSettings,
};
