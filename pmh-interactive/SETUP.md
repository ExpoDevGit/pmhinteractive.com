# PMH Interactive Website — Maintenance Guide

Plain HTML, CSS and JavaScript. No dependencies — edit a file, commit, and
GitHub Pages redeploys. The only build step is the news pages, which the deploy
runs for you (see **News & patch notes**).

---

## Files

```
pmh-interactive/
├── index.html              ← Homepage
├── css/style.css           ← The whole design system
├── js/main.js              ← Nav, mobile menu, scroll reveal
├── js/news.js              ← News: games list, platforms, Markdown rules
├── js/news-feed.js         ← Fills in news cards on the homepage, games pages, etc.
├── news/
│   ├── editor.html         ← The post editor (pmhinteractive.com/news/editor.html)
│   ├── index.html          ← The news page
│   ├── posts/*.md          ← One file per post
│   └── media/              ← Images and videos used in posts
├── pages/
│   ├── games.html          ← Full catalog
│   ├── obsessive-shadow.html ← The Obsessive Shadow franchise page
│   ├── privacy.html        ← Privacy policy
│   ├── redeem.html         ← Convention key redemption (noindex)
│   └── countdown.html      ← Standalone teaser page
├── images/
│   ├── logos/              ← Brand + platform logo files (see below)
│   └── *.jpg / *.png       ← Cover art, screenshots, stills
├── *.mp4                   ← Background videos (see below)
└── PMH_Interactive_ICON_1.png, logo.png, merch_banner.png
```

---

## Design system

Everything visual lives in `css/style.css`. Change it there and it changes
everywhere.

**Type**

| Role | Font | Used for |
|---|---|---|
| Display | Bebas Neue | All headings, game titles, logo wordmark |
| Body | Roboto Condensed | Paragraphs, descriptions |
| UI | Inter | Buttons, nav, labels, tags, eyebrows |

The Obsessive Shadow page adds **VCR OSD Mono** on top of this, used only for
eyebrows, status pills and small labels — that's the VHS accent voice. Body copy
and headings there use the same two fonts as the rest of the site.

**Color**

All colors are variables at the top of `css/style.css`:

```css
--teal:   #00c896;   /* accent — buttons, links, highlights */
--bg:     #0e0e0e;   /* page background */
--bg2:    #141414;   /* alternating section background */
--surface:#1a1a1a;   /* cards and rows */
```

The Obsessive Shadow page defines three extra accents in its own `<style>`
block: `--ash` (periwinkle), `--red` (Chapter 2) and `--ice` (Fortnite). Each
section picks one with a class — `.red`, `.ice`, `.teal` — and everything inside
it (tags, borders, buttons, headings) follows automatically.

**Spacing** — `--wrap` (1280px content width), `--gutter` (page side padding)
and `--nav-h` (navbar height) are set once and used everywhere.

---

## Logos

`images/logos/` holds the real brand marks as SVG files — Steam, PlayStation,
Xbox, Meta, Epic Games, Spotify, Apple Music, YouTube Music, YouTube, Instagram,
X, TikTok, Discord. They're filled white so they read on the dark background.

Use one like this:

```html
<a href="..." class="store-btn">
  <img src="../images/logos/steam.svg" alt="" class="brand-mark" /> Steam
</a>
```

Leave `alt=""` when the button text already names the platform, so screen
readers don't say "Steam Steam". Use `class="brand-mark lg"` for the larger
size on social cards.

To add a platform, drop its SVG into `images/logos/` and add
`fill="#ffffff"` to the `<svg>` tag.

---

## Adding a game

Open `pages/games.html`, copy any `<div class="game-row">` block and edit it.
Alternate `class="game-row reveal"` and `class="game-row alt reveal"` down the
page so the artwork zig-zags left and right.

Badges: `live` (teal), `demo` (amber), `soon` (outline), `partner` (purple).

---

## Adding an Obsessive Shadow section

Open `pages/obsessive-shadow.html` and copy a `<section class="tos-section">`
block. Each one takes:

- `alt` — use the darker alternating background
- `flip` — put the artwork on the right instead of the left
- `red` / `ice` / `teal` — swap the accent color (default is periwinkle)

The backdrop behind a section is either a video or a still image:

```html
<!-- video -->
<video class="tos-bg" autoplay muted loop playsinline preload="none">
  <source src="../tos-ch1-bg.mp4" type="video/mp4" />
</video>
<div class="tos-bg-fade"></div>

<!-- or a still -->
<div class="tos-bg-img" style="background-image:url('../images/your-art.jpg');"></div>
<div class="tos-bg-fade"></div>
```

Add the new section's anchor to the "On This Page" list in the footer.

---

## News & patch notes

### Posting

Open **pmhinteractive.com/news/editor.html** (it isn't linked anywhere on
the site). Fill in the title, game and the rest, write the post, and press
**Publish**. The preview on the right shows it exactly as it will look on the site.

The page is locked until you press **Sign in with GitHub**. GitHub checks your
password and two-factor code, then the editor opens, but only for an account that
can write to this repository. **Publish** puts the post and any images you added
onto the site in one go, and it's live about a minute later. You stay signed in
until you close the tab or press **Sign Out**, for 8 hours at most.

- **Edit a published post**: pick it from the drop-down, change it, press Publish.
- **Images & videos**: drag them into the text box, paste them, or use **Media**.
  They upload with the post.
- **YouTube**: use **Media** and paste the link, or put the link on its own line.
- **Platform icons**: click one in the toolbar, or type `:steam:`, `:ps:` and so on.
- **Platform-only section**: select the lines and press **Platform Section**.
- **Draft**: the editor keeps what you're writing even if you close the tab.

### Who can post

Only GitHub accounts with write access to this repository. Anyone else who opens
the editor page gets the sign-in screen and nothing more. Even someone who
copied the page's code couldn't post, because GitHub refuses them. Manage access
in the repo under **Settings → Collaborators**.

GitHub decides when to ask for your password and two-factor code. If you're
already logged into github.com in that browser, signing in can be one click.
Signing out of github.com makes it ask again next time.

### Editor sign-in (one-time setup)

The sign-in needs two free things the website can't do by itself: a **GitHub
App** (what you sign in to) and a **Cloudflare Worker**, which holds the app's
secret key so it never appears in the site's public code.

**1. Two-factor on GitHub.** At github.com/settings/security, make sure
two-factor authentication is on.

**2. Create the GitHub App** at github.com/settings/apps/new:
- **GitHub App name:** anything unique, e.g. `PMH News Editor`
- **Homepage URL:** `https://pmhinteractive.com`
- **Callback URL:** `https://pmhinteractive.com/news/editor.html`.
  For local testing, also add `http://localhost:8000/news/editor.html`.
- Leave **Expire user authorization tokens** ticked
- **Webhook:** untick **Active**
- **Repository permissions → Contents:** Read and write
- **Where can this GitHub App be installed?** Only on this account
- Click **Create GitHub App**. On the next page, copy the **Client ID**, then
  click **Generate a new client secret** and copy that too.
- In the app's left sidebar, click **Install App**, then **Install**. Choose
  **Only select repositories** and pick **pmhinteractive.com**.

**3. Create the Worker** at dash.cloudflare.com (a free account is fine):
- **Workers & Pages → Create → Create Worker**, name it `pmh-news-auth`, **Deploy**.
- **Edit code**, replace everything with the contents of
  `tools/news-auth-worker.js`, then **Deploy**.
- **Settings → Variables and Secrets**, then add:
  - `GITHUB_CLIENT_ID` as **Text**: the Client ID
  - `GITHUB_CLIENT_SECRET` as **Secret**: the client secret
- Copy the Worker's address, e.g. `https://pmh-news-auth.yourname.workers.dev`.

**4. Point the editor at them.** In `js/news.js`, fill in `EDITOR_AUTH`:

```js
export const EDITOR_AUTH = {
  clientId: 'Iv23li…',
  tokenUrl: 'https://pmh-news-auth.yourname.workers.dev',
};
```

Commit, wait a minute, and the sign-in button works. If the secret ever
leaks, generate a new one on the GitHub App and update the Worker's secret.

### Writing by hand

A post is a Markdown file in `news/posts/`. The file name becomes the address:
`news/posts/2026-10-28-v2-0-8.md` → `pmhinteractive.com/news/2026-10-28-v2-0-8/`.
Use lowercase letters, numbers and dashes. The top of the file holds the details:

```
---
title: v2.0.8 Is now Live on ALL PLATFORMS!
game: obsessive-shadow
type: Patch Notes
version: 2.0.8
date: 2026-10-28
platforms: steam meta playstation
thumbnail: media/tos-v2-0-8.jpg
summary: One line for the card and link previews (optional).
---
```

`game` is a key from `GAMES` in `js/news.js`. To add a game, add a line
there. `draft: true` hides a post, and so does starting its file name with `_`.

Paths like `media/shot.jpg` point into `news/media/`; `/images/...` points at
the site's own images; full `https://` links work everywhere.

| Write | Get |
|---|---|
| `## Heading` | Section heading |
| `**bold**` `*italic*` `~~strike~~` | Text styles |
| `- item` | Bullet list |
| `[text](https://…)` | Link |
| `:steam: :meta: :ps: :xbox: :epic: :pico: :switch: :switch2: :ios: :macos: :android:` | Platform icons (`:quest:` and `:playstation:` work too) |
| `::: ps xbox` … `:::` | A boxed section for those platforms; `::: ps \| PS5 Only` adds a title |
| `![caption](media/shot.jpg)` | Image; a `.mp4`/`.webm` file plays as video |
| A YouTube link on its own line | Embedded player |

### Adding a platform

Drop a white SVG logo into `images/logos/`, add the key and name to
`PLATFORMS` in `js/news.js`, and add a `.plat-<key>` line next to the others
in `css/style.css` with its colour.

### How it's built

`tools/build-news.js` runs during deploy. It turns each post into
`news/<name>/index.html`, with link previews for Discord, X and the like, and
writes `news/index.json` for the news cards. Those files are generated, so
they're git-ignored. A post with a mistake in it gets skipped with a warning in
the Actions log instead of breaking the deploy.

To preview locally with posts: `npm run preview` (needs Node), then open
http://localhost:8000.

---

## Background videos

Drop an `.mp4` in the `pmh-interactive/` root and point a `<source>` at it.

| File | Where it plays |
|---|---|
| `hero-bg.mp4` | Homepage hero |
| `tos-ch1-bg.mp4` | Obsessive Shadow hero fallback + Chapter 1 |
| `tos-ch2-bg.mp4` | Chapter 2 |
| `tos-mr-bg.mp4` | Mixed Reality |
| `tos-fortnite-bg.mp4` | Fortnite |
| `tos-film-bg.mp4` | Short film |

Keep them short and compressed — they autoplay muted and loop, and they pause
automatically while off-screen. If a file is missing the section still renders
correctly, just without motion behind it.

---

## Images

Cover art works best in portrait; section stills and screenshots in 16:9.
Anything much over ~500KB is worth compressing first — these load on phones.

---

## Publishing

The site deploys from `.github/workflows/static.yml` on every push to `main`.
Commit, push, wait about a minute.

To preview locally:

```bash
cd pmh-interactive
python3 -m http.server 8000
# open http://localhost:8000
```

---

## Accessibility notes

- The mobile menu opens with click, Enter or Space, and closes on Escape.
- All motion respects `prefers-reduced-motion` — the scroll reveals, the VHS
  grain and the scan bar all switch off.
- Decorative images use `alt=""`; meaningful ones carry a real description.
