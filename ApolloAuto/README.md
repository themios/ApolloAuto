# Apollo Auto — Landing Page

Family-owned used car dealership site for **Ventura & Los Angeles counties**.

## What's included

- **Homepage** (`index.html`) — Hero with lead form, inventory strip, live updates feed, blog preview, SEO footer
- **Blog** (`blog/`) — Article list and dynamic post pages (`post.html?slug=…`)
- **Help / FAQ** (`help/`) — Common buyer questions (financing, locations, visits, trade-ins)
- **Buyer guides** (`resources/`) — Document library for purchase paperwork and pre-visit education; PDFs in `documents/`
- **Admin CMS** (`/admin/`) — Log in to manage blog posts, daily messages, specials, trends, and news
- **Mobile-friendly** — Sticky call button, responsive layout
- **Lead form** — FormSubmit to `apolloautous@gmail.com`

## Run locally (full site + admin)

Blog posts and homepage updates load from the API. Use the Node server:

```bash
cd /home/tim/Applications/Websites/ApolloAuto
cp .env.example .env   # optional: admin password & session secret
nvm use
npm install            # required after clone — node_modules is not in git
npm run rebuild:native # if admin/API fails with better-sqlite3 errors
npm start
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin/

Default admin email is `admin@apolloauto.us` (override with `ADMIN_EMAIL` in `.env`). The password is whatever you set as `ADMIN_PASSWORD` on first run.

If login returns **401 Invalid email or password**, the admin account may not exist yet (common when `.env` was added after the DB was created). Run:

```bash
npm run admin:ensure
```

Then restart `npm start` and sign in with the email and password from `.env`.

## Static-only preview

```bash
python3 -m http.server 8080
```

HTML pages work, but blog/feed content will not update from the database until you run `npm start`.

## Lead form email setup

The form uses [FormSubmit](https://formsubmit.co) to email leads to `apolloautous@gmail.com`.

1. Submit the form once from your live site (or locally). FormSubmit sends a confirmation email; click the link to activate.
2. Update the `action` URL in `index.html` if you prefer a different inbox.

## Deploy

Run the Node app on your host (VPS, Railway, Render, etc.) or use a process manager:

```bash
npm install --production
NODE_ENV=production npm start
```

Set environment variables from `.env.example`. The SQLite database is created in `data/apollo.db` on first start.

For static-only hosting (no admin), upload files without running Node; keep the static blog HTML fallbacks.

## Admin content types

| Type | Where it shows |
|------|----------------|
| **Blog** | `/blog/` and homepage preview (3 latest) |
| **Daily** | Banner strip below inventory on homepage |
| **Special** | Homepage updates (up to 3) |
| **Trend** | Homepage updates (up to 3) |
| **News** | Homepage updates (up to 5) |

## Customize

| Item | File |
|------|------|
| Form email | `index.html` → form `action` |
| Phone / links | `index.html`, footer |
| Colors / fonts | `css/styles.css` → `:root` |
| New blog post | Admin → Blog articles, or API |
| Buyer guide PDF | Drop file in `documents/`, register in `resources/documents.json` |

## Contact

**Simi Valley:** 1555 Simi Town Center Way #420, Simi Valley CA 93065 · (805) 404-3873 · [apolloauto-to.com](https://www.apolloauto-to.com)

**El Monte:** 10915 Garvey Ave, El Monte CA 91733 · (626) 215-0440 · [apolloauto-em.com](https://www.apolloauto-em.com)

Tim Harmantzis · apolloautous@gmail.com
