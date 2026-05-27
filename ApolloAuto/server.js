require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const {
  verifyAdmin,
  listPosts,
  getPostBySlug,
  getPostById,
  savePost,
  deletePost,
} = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
  session({
    name: "apollo_admin",
    secret: process.env.SESSION_SECRET || "dev-only-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

function requireAuth(req, res, next) {
  if (req.session?.admin) return next();
  res.status(401).json({ error: "Login required" });
}

function sanitizePost(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category,
    link_url: row.link_url,
    active: !!row.active,
    published_at: row.published_at,
    expires_at: row.expires_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Auth
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  const admin = verifyAdmin(email.trim().toLowerCase(), password);
  if (!admin) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  req.session.admin = admin;
  res.json({ ok: true, email: admin.email });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/auth/me", (req, res) => {
  if (!req.session?.admin) return res.status(401).json({ error: "Not logged in" });
  res.json(req.session.admin);
});

// Public content
app.get("/api/posts", (req, res) => {
  const type = req.query.type || null;
  const rows = listPosts({ type, activeOnly: true, publicOnly: true });
  res.json(rows.map(sanitizePost));
});

app.get("/api/posts/slug/:slug", (req, res) => {
  const row = getPostBySlug(req.params.slug);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(sanitizePost(row));
});

app.get("/api/feed", (req, res) => {
  const daily = listPosts({ type: "daily", activeOnly: true, publicOnly: true }).slice(0, 1);
  const specials = listPosts({ type: "special", activeOnly: true, publicOnly: true }).slice(0, 3);
  const trends = listPosts({ type: "trend", activeOnly: true, publicOnly: true }).slice(0, 3);
  const news = listPosts({ type: "news", activeOnly: true, publicOnly: true }).slice(0, 5);
  res.json({
    daily: daily.map(sanitizePost),
    specials: specials.map(sanitizePost),
    trends: trends.map(sanitizePost),
    news: news.map(sanitizePost),
  });
});

// Admin CRUD
app.get("/api/admin/posts", requireAuth, (req, res) => {
  const type = req.query.type || null;
  res.json(listPosts({ type }).map(sanitizePost));
});

app.get("/api/admin/posts/:id", requireAuth, (req, res) => {
  const row = getPostById(Number(req.params.id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(sanitizePost(row));
});

app.post("/api/admin/posts", requireAuth, (req, res) => {
  try {
    const saved = savePost(req.body);
    res.status(201).json(sanitizePost(saved));
  } catch (e) {
    res.status(400).json({ error: e.message || "Could not save" });
  }
});

app.put("/api/admin/posts/:id", requireAuth, (req, res) => {
  try {
    const saved = savePost({ ...req.body, id: Number(req.params.id) });
    res.json(sanitizePost(saved));
  } catch (e) {
    res.status(400).json({ error: e.message || "Could not save" });
  }
});

app.delete("/api/admin/posts/:id", requireAuth, (req, res) => {
  deletePost(Number(req.params.id));
  res.json({ ok: true });
});

// Static files
app.use("/admin", express.static(path.join(__dirname, "admin")));
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Apollo Auto site running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin/`);
});
