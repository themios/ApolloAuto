require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const {
  getDb,
  verifyAdmin,
  listPosts,
  getPostBySlug,
  getPostById,
  savePost,
  deletePost,
  getThemeSettings,
  saveThemeSettings,
} = require("./db");
const {
  DEFAULT_THEME,
  FONT_PAIRS,
  COLOR_KEYS,
  RADIUS_PRESETS,
  normalizeTheme,
  themeCssVariables,
  googleFontsUrl,
} = require("./lib/theme");
const multer = require("multer");
const fs = require("fs");

const IMAGES_DIR = path.join(__dirname, "images");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, IMAGES_DIR),
    filename: (req, file, cb) => {
      const slot = req.params.slot || "upload";
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      cb(null, `${slot}${ext}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Images only"));
  },
});

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

function themePayload(theme) {
  const t = normalizeTheme(theme);
  return {
    ...t,
    cssVariables: themeCssVariables(t),
    googleFontsUrl: googleFontsUrl(t.fonts.display, t.fonts.body),
  };
}

// Public theme (site styling)
app.get("/api/theme", (req, res) => {
  const payload = themePayload(getThemeSettings());
  const logoExts = [".png", ".svg", ".jpg", ".webp"];
  const logoExt = logoExts.find((e) => fs.existsSync(path.join(IMAGES_DIR, `logo${e}`)));
  payload.logoUrl = logoExt ? `/images/logo${logoExt}` : null;
  res.json(payload);
});

// Admin theme
app.get("/api/admin/theme", requireAuth, (req, res) => {
  res.json({
    theme: getThemeSettings(),
    defaults: DEFAULT_THEME,
    fontPairs: FONT_PAIRS,
    colorKeys: COLOR_KEYS,
    radiusPresets: Object.keys(RADIUS_PRESETS),
  });
});

// Admin media
const IMAGE_SLOTS = [
  { id: "logo",          label: "Site logo",          hint: "Replaces the text logo in the header. PNG or SVG recommended." },
  { id: "hero-car",      label: "Hero image (primary)",hint: "Main hero background car photo." },
  { id: "hero-car-alt",  label: "Hero image (alt)",    hint: "Secondary hero image variant." },
  { id: "lot-1",         label: "Lot photo 1",         hint: "Location / gallery photo." },
  { id: "lot-2",         label: "Lot photo 2",         hint: "Location / gallery photo." },
  { id: "lot-3",         label: "Lot photo 3",         hint: "Location / gallery photo." },
];

app.get("/api/admin/images", requireAuth, (req, res) => {
  const slots = IMAGE_SLOTS.map((slot) => {
    const exts = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
    const found = exts.find((e) => fs.existsSync(path.join(IMAGES_DIR, `${slot.id}${e}`)));
    return { ...slot, url: found ? `/images/${slot.id}${found}` : null };
  });
  res.json(slots);
});

app.post("/api/admin/images/:slot", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const url = `/images/${req.file.filename}`;
  res.json({ ok: true, url });
});

app.delete("/api/admin/images/:slot", requireAuth, (req, res) => {
  const slot = req.params.slot;
  const exts = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
  let deleted = false;
  for (const ext of exts) {
    const fp = path.join(IMAGES_DIR, `${slot}${ext}`);
    if (fs.existsSync(fp)) { fs.unlinkSync(fp); deleted = true; }
  }
  res.json({ ok: deleted });
});

app.put("/api/admin/theme", requireAuth, (req, res) => {
  try {
    const saved = saveThemeSettings(req.body || {});
    res.json({ theme: saved });
  } catch (e) {
    res.status(400).json({ error: e.message || "Could not save theme" });
  }
});

app.post("/api/admin/theme/reset", requireAuth, (req, res) => {
  const saved = saveThemeSettings(DEFAULT_THEME);
  res.json({ theme: saved });
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
  try {
    getDb();
  } catch (err) {
    console.error("Database init failed:", err.message);
  }
  console.log(`Apollo Auto site running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin/`);
});
