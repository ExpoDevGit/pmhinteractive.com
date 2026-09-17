# PMH Interactive Website — Maintenance Guide

Plain HTML, CSS and JavaScript. No build step, no dependencies — edit a file,
commit, and GitHub Pages redeploys.

---

## Files

```
pmh-interactive/
├── index.html              ← Homepage
├── css/style.css           ← The whole design system
├── js/main.js              ← Nav, mobile menu, scroll reveal
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
