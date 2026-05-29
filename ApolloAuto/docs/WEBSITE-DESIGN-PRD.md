# Apollo Auto Website — Design PRD & Master Prompt

**Version:** 1.0  
**Date:** 2026-05-27  
**Live domain:** https://www.apolloauto.us  
**Repo path:** `/home/tim/Applications/Websites/ApolloAuto`  
**Monorepo:** https://github.com/themios/websites

---

## 1. Executive summary

Apollo Auto is a **family-owned used car dealership** with two lots in **Simi Valley (Ventura County)** and **El Monte (Los Angeles County)**. The website must:

1. **Generate leads** — phone calls, texts, and contact form messages to Tim
2. **Rank locally** — be discoverable for “used cars Simi Valley,” “used car dealer El Monte,” bad credit financing, etc.
3. **Build authority** — feel like a trusted local expert, not a generic car lot or national aggregator
4. **Reduce friction** — explain financing, paperwork, and locations before the customer visits

The site is **not** a full inventory platform. Inventory lives on separate lot sites (`apolloauto-to.com`, `apolloauto-em.com`). This site is the **brand hub**, **SEO engine**, **trust layer**, and **lead capture** surface.

---

## 2. Business context

| Field | Detail |
|-------|--------|
| **Business name** | Apollo Auto |
| **Owner / contact** | Tim Harmantzis |
| **Primary phone** | (805) 404-3873 (Simi) · (626) 215-0440 (El Monte) |
| **Email** | apolloautous@gmail.com |
| **Simi Valley** | 1555 Simi Town Center Way, Suite 420, Simi Valley, CA 93065 |
| **El Monte** | 10915 Garvey Ave, El Monte, CA 91733 |
| **Inventory URLs** | apolloauto-to.com (Ventura) · apolloauto-em.com (LA) |
| **Social** | Facebook, Instagram @ApolloAuto |
| **Positioning** | Honest, family-owned, financing for all credit, no hidden fees |

### Target customer

- Budget-conscious buyers in Ventura & LA counties
- First-time buyers, bad credit, rebuilding credit, past repossession/bankruptcy
- People who want to **talk to a real person** (Tim), not a call center
- Spanish-speaking communities in San Gabriel Valley (future consideration)

### Primary conversion actions

1. Call or text Tim
2. Submit contact form on homepage
3. Click through to lot inventory sites
4. Read buyer guides / FAQ (trust-building, pre-visit education)

---

## 3. Product goals

### Must achieve

- [x] Clear local identity for **both** locations
- [x] SEO-optimized page structure (H1/H2, meta, schema, sitemap)
- [x] Authority content (blog, FAQ, buyer guides, real contract PDFs)
- [x] Mobile-first with sticky call button
- [x] Fast, lightweight static HTML (no React bloat)
- [x] Admin CMS for blog + homepage announcements
- [x] Lead form that emails Tim without backend email server

### Must avoid

- Keyword stuffing or unreadable SEO copy
- Generic “AI dealership” aesthetics (purple gradients, Inter font, stock templates)
- Hidden fees / pressure tactics in copy (brand promise is transparency)
- Duplicate location content (city pages must be unique)
- Committing secrets, `.env`, or `node_modules` to git

---

## 4. Information architecture

```
apolloauto.us/
├── /                           Homepage (hub + lead form + previews)
├── /simi-valley-used-cars/     Ventura County location landing page
├── /el-monte-used-cars/        LA County location landing page
├── /help/                      FAQ (16 questions, FAQPage schema)
├── /blog/                      Article index
├── /blog/*.html                Static SEO articles (+ dynamic post.html?slug=)
├── /resources/                 Buyer guides hub
├── /resources/forms/           Redacted real purchase paperwork (PDF viewer)
├── /admin/                     CMS (authenticated)
├── /sitemap.xml
└── /robots.txt
```

### Navigation (desktop)

Inventory (anchor) · Simi Valley · El Monte · Financing · Blog · Help · Guides · Contact

### Internal linking strategy

- Homepage → both location pages
- Location pages → FAQ, blog, inventory URLs, sibling location
- FAQ → location pages, guides, blog
- Blog → location pages, contact form
- Footer → all major sections + maps

---

## 5. SEO & local authority strategy

### Philosophy

> Rank by **deserving to rank**: answer real buyer questions, signal local presence, and use keywords **naturally** in titles, H1, first paragraph, and H2s — not by formulaic “top 8% keyword density.”

### Keyword map (primary phrase per page)

| Page | Primary keyword | H1 example |
|------|-----------------|------------|
| Homepage | used cars Simi Valley & El Monte | Used Cars in Simi Valley & El Monte |
| Simi Valley | used cars Simi Valley | Used Cars in Simi Valley, CA |
| El Monte | used cars El Monte | Used Cars for Sale in El Monte, CA |
| Help | used car buying FAQ | Used Car Buying & Financing FAQ |
| Blog hub | used car buying tips | Used Car Buying Tips & Guides |
| Bad credit article | bad credit used car financing | Bad Credit Used Car Financing in Ventura & LA Counties |
| Inspection article | used car inspection checklist | Used Car Inspection Checklist for Ventura & LA Buyers |
| First-time buyer | first-time used car buyer | First-Time Used Car Buyer Guide for Southern California |
| Trade-in | used car trade-in California | Used Car Trade-In Tips in California |
| What to bring | buying used car California | What to Bring When Buying a Used Car in California |
| Resources | used car buyer guides | Used Car Buyer Guides & Documents |

### On-page rules

1. **One H1 per page** — includes primary keyword + location where relevant
2. **Brand voice in subhead** — personality lives in tagline/lead, not at expense of H1 clarity
3. **H2s as buyer questions/topics** — e.g. “Used car financing in Simi Valley”
4. **First 100–150 words** — primary keyword once, naturally
5. **Canonical URLs** on all indexable pages
6. **Open Graph** tags on homepage and key pages

### Schema markup

| Page type | Schema |
|-----------|--------|
| Homepage | `AutoDealer`, `WebSite` |
| Location pages | `AutoDealer` (per lot), `FAQPage`, `BreadcrumbList` |
| Help/FAQ | `FAQPage` (16 Q&A pairs) |
| Blog articles | `Article` where applicable |

### Technical SEO

- `sitemap.xml` — all public URLs
- `robots.txt` — allow `/`, disallow `/admin/`, sitemap reference
- Semantic HTML (`header`, `main`, `section`, `article`, `address`)
- Lazy-loaded images, descriptive alt text with local context
- Google Search Console: submit sitemap after deploy

### Off-site SEO (operator tasks)

- Google Business Profile for **both** lots (photos, posts, Q&A)
- Consistent NAP (name, address, phone) on CarGurus, Yelp, Facebook
- Reviews mentioning city + “used car” naturally
- Instagram inventory updates linked from site

### Content pillars (authority)

1. **Financing** — bad credit, first-time buyers, pre-approval
2. **Buyer's education** — inspection, what to bring, trade-ins
3. **Local trust** — two locations, areas served, Tim as human contact
4. **Transparency** — real redacted contract PDFs, no hidden fees messaging

---

## 6. Visual design — “Golden Coast Trust”

### Design brief (master prompt for UI)

Design a **family-owned Southern California used car dealer** website that feels:

- **Trustworthy** — credible for bad-credit buyers who've been burned before
- **Warm** — human, approachable, Tim is reachable
- **Direct** — no corporate jargon, plain English
- **Local** — Ventura & LA county identity, not national chain

**Aesthetic direction:** “Golden Coast Trust” — deep teal-navy (credibility) + California gold accents (warmth, sun). Editorial layout with elevated cards, subtle grain texture, and confident typography. Avoid generic AI slop: no purple gradients, no Inter/Roboto, no cookie-cutter dealership templates.

### Typography

| Role | Font | Notes |
|------|------|-------|
| Display / H1–H2 | **Outfit** (700–800) | Confident, geometric, modern |
| Body / UI | **Albert Sans** (400–700) | Clean, readable, humanist |

Type scale uses `clamp()` for fluid headings. Line length capped ~48ch for hero lead copy.

### Color tokens (`css/styles.css`)

| Token | Value | Use |
|-------|-------|-----|
| `--navy` | `#0c2836` | Headings, footer, primary buttons |
| `--navy-soft` | `#164456` | Hover states, gradients |
| `--gold` | `#c8872a` | Accents, eyebrows, CTA highlights |
| `--gold-light` | `#e8b04a` | Quote attribution, hover |
| `--paper` | `#f6f2ea` | Page background |
| `--ink` | `#121a1f` | Body text |
| `--success` | `#1f6b4f` | Trust checkmarks |

### Key UI components

1. **Logo mark** — gradient badge with stylized window shape + “Apollo Auto” wordmark
2. **Hero** — gradient + noise background, kicker pill, H1 + tagline, trust bar (4 pills), inventory cards, photo stack (desktop), contact panel
3. **Trust bar** — “No hidden fees · All credit welcome · Trade-ins accepted · Same-day replies”
4. **Inventory cards** — Simi / El Monte with hover lift + accent stripe
5. **Contact panel** — elevated card, gold top bar, minimal fields (name, phone, message)
6. **Location cards** — county badges, hover lift, links to inventory + dealer page + directions
7. **Financing checklist** — card with gold checkmarks
8. **Blog cards** — 4-column grid on homepage with hover
9. **Quote block** — navy gradient with Tim’s quote
10. **Sticky call button** — gold pill on mobile (“Call Tim”)

### Motion

- Scroll-triggered `.reveal` animations (opacity + translateY)
- Sticky header gains shadow on scroll (`.is-scrolled`)
- Card hover lift on lot cards, visit cards, blog cards
- **`prefers-reduced-motion`** — disables all motion

---

## 7. Page-by-page requirements

### Homepage (`index.html`)

**Purpose:** Brand hub, lead capture, route to inventory and location pages.

**Hero:**
- H1: “Used Cars in Simi Valley & El Monte”
- Tagline: “Reliable transportation at a price you can afford — from people you can talk to.”
- Lead paragraph with “family-owned used car dealer” + counties
- Trust bar (4 items)
- Financing note with gold left border
- Two inventory cards → external lot sites

**Contact panel (above fold on desktop):**
- H2: “Ask about used cars or financing”
- Fields: name, phone, message (required); email + location (optional expand)
- FormSubmit → apolloautous@gmail.com
- Alt CTA: call/text link

**Sections below fold:**
- Locations (copy + 2 visit cards + photo grid)
- Financing (copy + checklist)
- Blog preview (4 cards)
- About / Tim quote
- Footer with maps (both lots), SEO footer `<details>` block

**Live feed (optional):** Admin-driven daily message, specials, trends, news — loaded via `/api/feed`

---

### Simi Valley location page (`/simi-valley-used-cars/`)

**Purpose:** Rank for Ventura County / Simi Valley local searches.

**Unique content:**
- H1: “Used Cars in Simi Valley, CA”
- Areas served: Thousand Oaks, Moorpark, Camarillo, Ventura, Chatsworth, SFV
- Local FAQ (3 questions + link to full FAQ)
- CTA to apolloauto-to.com inventory
- Phone: (805) 404-3873

**Schema:** AutoDealer, FAQPage, BreadcrumbList

---

### El Monte location page (`/el-monte-used-cars/`)

**Purpose:** Rank for LA County / San Gabriel Valley searches.

**Unique content:**
- H1: “Used Cars for Sale in El Monte, CA”
- Areas served: West Covina, Baldwin Park, Monterey Park, Temple City, Arcadia, SGV
- Bad credit financing emphasis
- CTA to apolloauto-em.com inventory
- Phone: (626) 215-0440

**Schema:** AutoDealer, FAQPage, BreadcrumbList

---

### Help / FAQ (`/help/`)

**Purpose:** Capture long-tail questions + FAQ rich results.

**16 questions across:**
- Buying & inventory (4)
- Financing & trade-ins (7)
- Visiting (5)

**H1:** “Used Car Buying & Financing FAQ”

**Schema:** FAQPage with all Q&A in JSON-LD

---

### Blog (`/blog/`)

**Purpose:** Authority content + long-tail SEO.

**Static articles (always available):**
1. What to Bring When Buying a Used Car in California
2. Bad Credit Used Car Financing in Ventura & LA
3. Used Car Inspection Checklist
4. First-Time Used Car Buyer Guide
5. Used Car Trade-In Tips in California

**Dynamic posts:** Admin CMS → `post.html?slug=` via `/api/posts/slug/:slug`

Each article: canonical URL, local keywords in title/H1/H2, CTA to contact or location pages.

---

### Resources / Guides (`/resources/`)

**Purpose:** Pre-visit education, differentiate from competitors.

- Buyer guides intro copy
- Link to **real redacted contract sections** (`/resources/forms/`) — 18 PDF sections from actual Apollo deal paperwork
- Plain-language glossary of purchase documents

**Why it matters:** “Expert” positioning — customers can review real paperwork before visiting.

---

## 8. Content & tone guidelines

### Voice

- First person plural (“we”) and Tim by name
- Plain English, no dealer hype
- Short sentences, conversational
- Acknowledge bad credit without shame
- Never promise specific approval — “most customers who apply get approved”

### Words to use

- used cars, pre-owned, family-owned, transparent pricing, no hidden fees
- financing, trade-in, test drive, Ventura County, Los Angeles County
- Simi Valley, El Monte, Tim

### Words to avoid

- “Best deals!” “Act now!” “Guaranteed approval”
- Corporate speak: “synergy,” “solutions,” “leverage”
- Keyword repetition in every sentence

---

## 9. Technical architecture

### Stack

| Layer | Technology |
|-------|------------|
| Frontend | Static HTML, CSS, vanilla JS |
| Server | Node.js 20 + Express |
| Database | SQLite (`better-sqlite3`) — blog + admin content |
| Auth | Session cookies + bcrypt admin password |
| Lead form | FormSubmit.co (external, no SMTP) |
| Fonts | Google Fonts (Outfit, Albert Sans) |
| PDF viewer | In-browser PDF.js-style viewer for contract sections |

### Why hybrid static + Node?

- **Static HTML** = fast, SEO-friendly, deployable anywhere
- **Node API** = admin CMS, dynamic blog slugs, homepage feed
- **Lazy SQLite load** = site serves static pages even if native module needs rebuild

### Key files

| File | Role |
|------|------|
| `server.js` | Express static + API routes |
| `db.js` | SQLite schema, lazy init, seed data |
| `css/styles.css` | Design system |
| `js/main.js` | Nav, form, scroll reveal, header shadow |
| `js/home-feed.js` | Homepage announcements from API |
| `scripts/rebuild-sqlite.js` | Native module rebuild for Node version |

### Environment variables (`.env`)

```
ADMIN_EMAIL=admin@apolloauto.us
ADMIN_PASSWORD=...
SESSION_SECRET=...
PORT=3000
NODE_ENV=production
```

### Local development

```bash
cd /home/tim/Applications/Websites/ApolloAuto
nvm use          # Node 20 (.nvmrc)
npm install      # required after clone
npm run rebuild:native  # if better-sqlite3 ABI mismatch
npm start        # http://localhost:3000
```

---

## 10. Repository & deployment

### Monorepo structure

```
/home/tim/Applications/Websites/     ← local
https://github.com/themios/websites  ← remote

Websites/
├── README.md
├── .gitignore
└── ApolloAuto/          ← this project
    ├── docs/
    │   └── WEBSITE-DESIGN-PRD.md
    ├── index.html
    ├── ...
    └── package.json
```

Each future customer gets a top-level folder (`CustomerName/`).

### Gitignore (per project)

- `node_modules/`
- `.env`
- `*.db`, `*.db-wal`, `*.db-shm`
- `.venv*/`

### Deploy options

1. **VPS / Node host** — `npm install --production && npm start` with PM2
2. **Railway / Render** — Node buildpack, set env vars
3. **Static-only** — upload HTML/CSS/JS without Node (lose admin + dynamic feed)

Production domain: **https://www.apolloauto.us**

---

## 11. Master AI prompt (copy-paste to recreate or extend)

Use this prompt to brief an AI designer/developer on a similar project:

```
You are building a local SEO + lead generation website for Apollo Auto, a family-owned 
used car dealer with two lots:

- Simi Valley, CA (Ventura County) — (805) 404-3873 — inventory at apolloauto-to.com
- El Monte, CA (Los Angeles County) — (626) 215-0440 — inventory at apolloauto-em.com

PRIMARY GOALS:
1. Local SEO authority for "used cars [city]", bad credit financing, trade-ins
2. Lead capture: phone, text, simple contact form to owner Tim
3. Trust: FAQ, blog, real buyer guides, redacted contract PDFs — NOT inventory hosting

AUDIENCE:
Budget-conscious SoCal buyers, many with bad credit or first-time buyers. They want 
honest pricing, no hidden fees, and to talk to a real person.

SEO REQUIREMENTS:
- One primary keyword per page in H1, meta title, and opening paragraph (natural, not stuffed)
- Dedicated location landing pages for each city with unique copy and FAQPage schema
- 15+ FAQ questions with FAQPage JSON-LD
- Blog with 5+ authority articles targeting long-tail local keywords
- sitemap.xml, robots.txt, canonical URLs, AutoDealer + BreadcrumbList schema
- Internal linking between homepage, locations, FAQ, blog, guides

DESIGN DIRECTION — "Golden Coast Trust":
- Tone: trustworthy, warm, direct, local (NOT corporate, NOT generic AI dealership)
- Colors: deep teal-navy (#0c2836) + California gold accent (#c8872a) + cream paper (#f6f2ea)
- Fonts: Outfit (display) + Albert Sans (body) — NO Inter, Roboto, Newsreader, purple gradients
- Hero: gradient + subtle grain, trust pills, inventory cards, photo stack, elevated contact form
- Motion: scroll reveals + card hover lift; respect prefers-reduced-motion
- Mobile: sticky gold "Call Tim" button

TECH STACK:
- Static HTML/CSS/vanilla JS
- Node 20 + Express for static serving, SQLite CMS, admin panel at /admin/
- FormSubmit.co for lead form email (no SMTP)
- Lazy-load SQLite so static pages work without native module

PAGES:
/ (homepage hub)
/simi-valley-used-cars/
/el-monte-used-cars/
/help/ (FAQ)
/blog/ + static articles
/resources/ + /resources/forms/ (redacted PDFs)
/admin/ (CMS)

DO NOT:
- Keyword stuff or use "top 8% keyword density" formulas
- Use generic dealership templates
- Host full inventory (link out to lot sites)
- Commit node_modules, .env, or database files

CONTACT COPY TONE:
"We're family-owned. Transparent pricing, no add-on fees. Financing for all credit types. 
Tim usually replies the same day."
```

---

## 12. Success metrics

| Metric | Target |
|--------|--------|
| Google Search Console impressions | Growth for local keywords (monthly) |
| Organic clicks to location pages | Track separately per city |
| Form submissions | Steady weekly volume |
| Phone calls (mobile) | Sticky CTA click-through |
| FAQ rich results | FAQPage schema indexed |
| Page speed | LCP < 2.5s on mobile |
| Bounce rate on homepage | Decrease over time as content authority grows |

---

## 13. Future roadmap (not yet built)

- [ ] Customer review carousel with schema (`Review`, `AggregateRating`)
- [ ] Spanish language pages or toggle (`/es/`)
- [ ] Google Analytics 4 + conversion events (form, call click, inventory click)
- [ ] City-specific blog posts at scale (programmatic SEO with quality guardrails)
- [ ] Real logo SVG (replace CSS logo mark)
- [ ] Hero video or 360° lot tour
- [ ] WhatsApp / SMS deep link on mobile
- [ ] Structured `LocalBusiness` hours + `openingHoursSpecification`

---

## 14. Changelog reference

See `ENHANCEMENTS.md` for dated implementation log:

- **2026-05-27** — Golden Coast Trust visual redesign
- **2026-05-24** — Local SEO overhaul (location pages, FAQ, sitemap, blog)
- **2026-05-23** — Redacted contract PDFs, buyer guides

---

*This document is the single source of truth for how Apollo Auto’s website was designed. Use it to onboard developers, brief AI tools, or replicate the pattern for other dealer customers in the Websites monorepo.*
