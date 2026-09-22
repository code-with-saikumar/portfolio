# Sai Kumar — Portfolio (HTML/CSS/JS)

A premium, futuristic developer portfolio with a built-in admin CMS.
Built with **only** semantic HTML5, modern CSS3 and JavaScript.


## Overview

- Dark, cyberpunk-glass aesthetic (Apple × Vercel × Stripe × Linear × Framer × Awwwards vibes)
- Aurora backgrounds, animated grid, floating particles, custom cursor, magnetic buttons
- Every section is editable through a client-side admin dashboard
- Data persists to `localStorage`; export / import as JSON

## Live entry

Open **`/portfolio.html`** from the project root.

## Features

- Loading screen with step animation
- Sticky glass navbar with hamburger menu
- Hero with typing roles and floating terminal
- About, Skills, Projects, Featured project, Experience, Education
- Certificates, Achievements counters, Blog with search + category filter
- Services, Contact form (localStorage inbox), Social bar
- 60fps animations, `prefers-reduced-motion` respected
- Full SEO metadata, JSON-LD Person schema, `robots.txt`, `sitemap.xml`
- Fully responsive: mobile, tablet, laptop, desktop, ultrawide

## Folder structure

```
public/
├── portfolio.html
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── storage.js     # master data object + localStorage
│   ├── projects.js    # renderers for skills, projects, blog, timelines, etc.
│   ├── typing.js      # hero typewriter
│   ├── animations.js  # particles, tilt, ripple
│   ├── main.js        # cursor, nav, reveal, counters, magnetic, form
│   └── admin.js       # PIN modal + dashboard editor
├── images/
├── assets/
├── robots.txt
├── sitemap.xml
└── README.md
```

## How to change content

1. Open `/portfolio.html`.
2. Click the profile icon (top-right) in the navbar.
3. Enter PIN `****'. Wrong PIN triggers a shake animation.
4. Use the sidebar to edit any section. Changes preview live.
5. Click **Save** to persist to your browser's localStorage.

Toolbar buttons:

- **Save** — persist draft to localStorage
- **Cancel** — revert to last saved
- **Preview** — hide the dashboard temporarily
- **Restore Default** — reload the seed portfolio
- **Export JSON** — download the entire data blob
- **Import JSON** — replace data from a JSON file
- **Logout** — close the dashboard

## How to change the PIN

Two ways:

1. Admin dashboard → **Security (PIN)** → enter a new 4-digit PIN → Update.
2. Or open DevTools → `localStorage.removeItem("portfolio:pin")` to reset to `1234`.

The PIN is stored as a SHA-256 hash under the key `portfolio:pin`.
**This is client-side only** — it protects the UI, not the data. For real
auth, plug in a backend.

## How localStorage works

- `portfolio:data:v1` — the master data object (edits, projects, blog, etc.)
- `portfolio:pin` — SHA-256 of the admin PIN
- `portfolio:inbox` — contact-form submissions (client-only demo)

To reset everything, clear these keys from `localStorage` or click
**Restore Default** in the admin dashboard.

Images uploaded via the admin are stored as base64 data URLs inside the
JSON blob. `localStorage` has a ~5 MB cap; uploads over ~2 MB are
rejected with a message. For heavier assets, host them externally and
paste a URL directly into the data via **Export → edit → Import**.

## How to deploy

Any static host works:

- **Netlify / Vercel / Cloudflare Pages** — drop the `public/` folder.
- **GitHub Pages** — push `public/` contents to the branch root.
- **Lovable** — click **Publish** in the top bar. The site is served at
  `/portfolio.html`.

Because the app is a static bundle, there's nothing to build.


