# Apollo Auto — Enhancements Log

Track notable product and UX improvements here (newest first).

---

## 2026-05-27 — Navy hero & footer palette

**Category:** UX

**Migration:** none

**Why:** The bright sky-blue backgrounds felt too light and casual for a professional dealership brand.

**What was built:**
- `src/index.css` — Shifted `--color-sky-deep` to navy (`#0f2744`), muted section tints and shadows to match
- `src/components/HeroDecor.tsx` — Softer blob opacity on dark navy heroes
- `src/components/Navigation.tsx`, `MobileTabBar.tsx` — Navy-tinted elevation shadows
- `src/App.tsx` — Footer muted text contrast on navy background

---

## 2026-05-27 — Bright SoCal visual refresh & motion

**Category:** UX

**Migration:** none

**Why:** The site felt dull, gray, and generic (AI-style mesh gradients). Needed a warmer, sunnier dealership feel with more life and motion.

**What was built:**
- `src/index.css` — SoCal palette (sky, sun, lemon, coral), solid hero backgrounds, blob animations, spring-friendly card hovers, marquee ticker, removed mesh gradients
- `src/components/HeroDecor.tsx` — Floating solid-color shapes for hero sections
- `src/components/Navigation.tsx` — Light header with sky ribbon and orange CTAs
- `src/components/PageHero.tsx`, `TrustPillars.tsx`, `PathwayTiles.tsx`, `ShopByNeedCarousel.tsx` — Bold solid colors, scroll reveals, hover pop
- `src/components/RevealOnScroll.tsx` — Spring scale-in on scroll
- `src/App.tsx` — Sunny hero, welcome ticker, brighter homepage sections and footer
- `src/components/AIAssistant.tsx`, `ContactForm.tsx`, `MobileTabBar.tsx` — Matching sky/sun theme

---


**Category:** UX

**Migration:** none

**Why:** Cleaner, modern sans-serif aligned with premium dealer sites and improved readability on mobile.

**What was built:**
- `src/index.css` — Replaced Alegreya/Karla with Montserrat for body, headings, and labels

---

## 2026-05-27 — Priddy-inspired motion & mobile navigation

**Category:** UX

**Migration:** none

**Why:** Borrow scroll reveals, pathway tiles, and mobile tab bar patterns from [Priddy's Motor Company](https://www.priddysmotorcompany.co.uk/) to feel more premium while keeping Apollo's family/trust positioning.

**What was built:**
- `src/components/RevealOnScroll.tsx` — Motion-powered fade-up on scroll (respects reduced motion)
- `src/components/PathwayTiles.tsx` — Quick-route cards (Inventory, Financing, Guides, Contact)
- `src/components/ShopByNeedCarousel.tsx` — Horizontal snap carousel for family shopping needs
- `src/components/MobileTabBar.tsx` — Fixed bottom nav (Stock, Call, Lots, Apply) replacing floating CTA
- `src/index.css` — Pathway hover lift, hero drift, scrollbar-hide, safe-area padding

---

## 2026-05-27 — Mobile-readable typography & trust UI refresh

**Category:** UX

**Migration:** none

**Why:** Body copy and form fields were too small on phones (9–11px labels, 12px inputs), hurting readability and triggering iOS zoom on focus.

**What was built:**
- `src/index.css` — Mobile-first base font scale (18px on phones), `form-field` / `form-label` utilities, larger eyebrows, 48px+ touch targets
- `src/components/ContactForm.tsx` — 16px+ inputs, larger labels/submit button; Triune Brain structure unchanged
- `src/App.tsx` — Replaced micro copy sizes; larger hero body text and mobile call button
- `src/components/Navigation.tsx`, `TrustPillars.tsx`, `PageHero.tsx`, `TestimonialCarousel.tsx`, `FinancingCalculator.tsx`, `AIAssistant.tsx` — Minimum `text-sm` for supporting copy
- `src/components/PageHero.tsx`, `TrustPillars.tsx` — Trust-focused layout from prior session
