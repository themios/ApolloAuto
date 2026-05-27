# Enhancements Log

Project enhancements and new features. Newest entries first.

---

## 2026-05-27 — Golden Coast Trust visual redesign

**Category:** UX, Design

**Migration:** none

**Why:** The site felt bland and generic; needed a distinctive, trustworthy visual identity aligned with a family-owned Southern California used car dealer.

**What was built:**

- `css/styles.css` — "Golden Coast Trust" design system: deep teal-navy + gold accent, Outfit/Albert Sans typography, hero gradient with grain, elevated cards, scroll reveals
- `index.html` — Trust bar, hero photo stack, logo mark, section eyebrows, enhanced location/financing/blog layout
- `js/main.js` — Scroll-triggered reveal animations and sticky header shadow (respects reduced motion)
- Font links updated across `blog/`, `help/`, `resources/`, and location pages for consistent typography

---


**Category:** SEO, Content

**Migration:** none

**Why:** Build local search authority for used car sales in Simi Valley and El Monte with keyword-aware headers, location landing pages, expanded FAQ, and technical SEO foundations.

**What was built:**

- `simi-valley-used-cars/index.html` — Ventura County location page with AutoDealer, FAQ, and BreadcrumbList schema
- `el-monte-used-cars/index.html` — LA County location page with unique copy and local FAQ
- `sitemap.xml` — XML sitemap for all public indexable pages
- `robots.txt` — Crawl rules and sitemap reference
- `blog/what-to-bring-buying-used-car.html` — New California buyer checklist article
- `index.html` — Keyword-optimized H1/H2s, location nav links, internal linking to city pages
- `help/index.html` — Expanded to 16 FAQs with updated FAQPage schema and local keyword headers
- `blog/index.html`, `blog/*.html` — Local keyword titles, H1s, H2s, and canonical URLs
- `resources/index.html` — SEO-focused headers and location internal links
- `css/styles.css` — Styles for hero tagline, location pages, and nearby-area chips

---


**Category:** Content, UX, Legal/compliance

**Migration:** none

**Why:** Customers need to review the real Apollo Auto purchase paperwork (not generic samples) before visiting, with customer and vehicle details removed.

**What was built:**

- `scripts/process-contract.py` — Splits source contract PDF into 18 section PDFs and redacts PII
- `documents/contract-sections/*.pdf` — Redacted section documents (DMV, RISC pages 1–6, disclosures)
- `documents/contract-sections/manifest.json` — Section list for the forms hub
- `resources/forms/index.html` — Grouped catalog of all sections
- `resources/forms/view.html`, `view.js`, `form-viewer.css` — In-browser PDF review
- `resources/forms/forms-catalog.js` — Loads manifest and renders form groups
- `resources/documents.json`, `resources/resources.js`, `resources/index.html` — Links to real section PDFs
- Removed generic HTML sample forms in `resources/forms/`

---

## 2026-05-23 — Blank sample purchase forms

**Category:** Content, UX

**Migration:** none

**Why:** Customers wanted actual blank forms they could review at home before visiting, not just descriptions of paperwork.

**What was built:**

- `resources/forms/index.html` — Hub listing six blank sample forms
- `resources/forms/buyers-order.html` — Sample buyer's order / purchase agreement
- `resources/forms/retail-installment-contract.html` — Sample financing contract with TILA-style fields
- `resources/forms/buyers-guide.html` — Sample FTC Buyer's Guide layout
- `resources/forms/odometer-disclosure.html` — Sample federal odometer statement
- `resources/forms/credit-application.html` — Sample credit application fields
- `resources/forms/trade-in-sheet.html` — Sample trade-in information sheet
- `resources/forms/form-sample.css` — Print-friendly form styling with sample banner
- `resources/index.html` — Prominent CTA linking to blank forms
- `resources/documents.json` — New "Blank forms to review" category and live links
- `css/styles.css` — Sample forms CTA block and small button utility

---

## 2026-05-23 — Buyer guides & document library

**Category:** Content, UX

**Migration:** none

**Why:** Customers wanted to review purchase paperwork and related materials before visiting so contracts feel less intimidating.

**What was built:**

- `resources/index.html` — Buyer guides page with plain-language paperwork preview and downloadable guide catalog
- `resources/documents.json` — Manifest of guides by category (PDF or blog link)
- `resources/resources.js` — Renders guide cards from manifest
- `documents/README.md` — Instructions for adding PDFs to the library
- `css/styles.css` — Document card and glossary styles
- Nav links on homepage, help, and blog; financing section links to guides

---

## 2026-05-23 — Help & FAQ page

**Category:** Content, SEO

**Migration:** none

**Why:** A lightweight FAQ hub answers repeat customer questions without duplicating the blog or building a full wiki.

**What was built:**

- `help/index.html` — 10 FAQs in three sections (buying, financing, trade-ins, visiting), FAQPage schema.org markup, jump links
- `css/styles.css` — FAQ page styles
- `index.html`, `blog/index.html`, `blog/post.html` — Help link in navigation; financing section links to FAQ
- `README.md` — Documented `/help/`

---

## 2026-05-23 — Marketing content enrichment

**Category:** Content, SEO

**Migration:** none

**Why:** Owner provided Facebook, Instagram, mission statement, SEO copy, and outreach emails to weave into the site without repetitive AI-style blocks.

**What was built:**

- `index.html` — Richer hero, locations, financing, and mission copy; SEO meta keywords; schema `sameAs`; Google Maps embed in footer; consolidated SEO footer paragraphs with local keywords (Thousand Oaks, Ventura, LA counties)
- `content/outreach-templates.md` — CarGurus reply, follow-up, and social post templates for Tim
- `css/styles.css` — Footer map, about/mission layout, hero note styling
- `db.js` — Updated seed daily message excerpt

---

## 2026-05-23 — Editorial homepage redesign

**Category:** UX

**Migration:** none

**Why:** Site felt generic, repetitive, and the lead form looked like aggressive data collection. Owner wanted a modern, human layout with intentional whitespace.

**What was built:**

- `index.html` — Removed duplicate inventory strips, stats bar, hero action grid, and bottom CTA pile; merged locations + gallery; simplified contact to 3 core fields with optional expand
- `css/styles.css` — Newsreader + DM Sans typography, warm paper background, flat borders instead of heavy shadows, editorial section rhythm
- `js/main.js` — Progressive optional fields (email/location pills), removed share-from-form clutter
- `blog/index.html`, `blog/post.html` — Matching header/footer and typography

---

## 2026-05-23 — Denser homepage layout

**Category:** UX

**Migration:** none

**Why:** The page had large gaps and narrow text columns on wide screens, so content felt lost in empty space.

**What was built:**

- `css/styles.css` — Wider container (1320px), tighter section padding, side-by-side section layouts, hero quick-action tiles, horizontal CTA band, taller gallery grid, 4-column blog on large screens
- `index.html` — Hero quick links, inventory header beside buttons, split financing/locations layouts, shop-inventory buttons on location cards

---

## 2026-05-23 — Blog nav and admin CMS

**Category:** UX, Integrations

**Migration:** none (SQLite `data/apollo.db` created on first server start)

**Why:** Owner wanted Blog in the top navigation and a secure place to manage blog posts, daily messages, specials, trends, and news without editing HTML.

**What was built:**

- `index.html` — **Blog** in main and mobile nav; homepage updates strip (`#site-updates`); blog preview links to `blog/post.html?slug=…`
- `blog/index.html`, `blog/post.html` — Dynamic blog list and single-article page
- `js/blog.js`, `js/post.js`, `js/home-feed.js` — Load content from `/api/posts` and `/api/feed`
- `server.js`, `db.js`, `package.json` — Express API, SQLite storage, session auth
- `admin/index.html`, `admin/admin.css`, `admin/admin.js` — Admin UI at `/admin/`
- `.env.example`, `.gitignore` — Admin credentials and local DB paths
- `css/styles.css` — Homepage feed and article body styles
- `README.md` — Run and deploy instructions for Node + admin

---

## 2026-05-23 — Navy and white visual refresh

**Category:** UX

**Migration:** none

**Why:** Owner wanted navy blue instead of orange, no hero background image, and a clean white layout.

**What was built:**

- `css/styles.css` — Replaced copper/gold/cream palette with navy on white; removed hero photo overlay; updated buttons, tagline, inventory strip, and footer accents
- `index.html` — Removed hero background image element

---

## 2026-05-23 — Remove referral section, add form share button

**Category:** UX, Compliance

**Migration:** none

**Why:** Refer-a-friend rewards may raise legal concerns; owner preferred a simple share action on the lead form instead.

**What was built:**

- `index.html` — Removed `#referral` section; added “Share Apollo Auto with a friend” button below the lead form (and on success state)
- `js/main.js` — Web Share API with clipboard fallback
- `css/styles.css` — `.form-share` and `.btn-share` styles; removed referral card styles

---

## 2026-05-23 — Locations, inventory links, referral program, photos

**Category:** UX, Integrations, Content

**Migration:** none

**Why:** Owner provided real contact details, two dealership addresses, per-location inventory URLs, lead email, referral program request, and Google photo source.

**What was built:**

- `index.html` — Two location cards (Simi Valley + El Monte), inventory links to apolloauto-to.com / apolloauto-em.com, referral section, location field on lead form, form email apolloautous@gmail.com, photo gallery, updated schema/footer/CTAs
- `css/styles.css` — Location cards, inventory cards, referral styles, hero photo background
- `images/` — Placeholder dealership photos + README for swapping Google Business images

---

## 2026-05-23 — Apollo Auto landing page & lead funnel

**Category:** UX, Marketing, Content

**Migration:** none

**Why:** Small business owner needed a conversion-focused landing page with a simple lead form, car-buying blog content, and SEO footer copy for Apollo Auto (Ventura & LA counties).

**What was built:**

- `index.html` — Homepage with hero lead funnel (name, phone, email, interest, message), inventory/financing/about sections, blog preview, collapsible SEO footer, schema.org AutoDealer markup, meta tags
- `css/styles.css` — Distinctive automotive design (navy/copper/cream), responsive layout, sticky mobile call CTA
- `js/main.js` — Mobile nav, form validation, FormSubmit integration hook
- `blog/index.html` — Blog hub
- `blog/bad-credit-financing.html` — Bad credit financing guide
- `blog/used-car-inspection-checklist.html` — Pre-purchase inspection checklist
- `blog/first-time-buyer-guide.html` — First-time buyer guide
- `blog/trade-in-tips.html` — Trade-in preparation tips
- `README.md` — Local dev, form setup, deploy instructions
