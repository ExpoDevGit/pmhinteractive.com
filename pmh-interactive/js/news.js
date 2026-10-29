// ════════════════════════════════════════════════════════════
// NEWS — shared by the site, the post editor and tools/build-news.js.
// No DOM or Node APIs in here, so all three can import it as-is.
// ════════════════════════════════════════════════════════════

export const SITE_URL = 'https://pmhinteractive.com';

export const REPO = {
  owner:  'ExpoDevGit',
  name:   'pmhinteractive.com',
  branch: 'main',
  posts:  'pmh-interactive/news/posts',
  media:  'pmh-interactive/news/media',
};

// Editor sign-in, from the one-time setup in SETUP.md ("Editor sign-in").
// The client ID is meant to be public. The client secret lives only in the
// Cloudflare Worker (tools/news-auth-worker.js), never here.
export const EDITOR_AUTH = {
  clientId: '',   // the GitHub App's Client ID, e.g. 'Iv23li…'
  tokenUrl: '',   // the Worker's address, e.g. 'https://pmh-news-auth.yourname.workers.dev'
};

// The key is what goes in a post's `game:` line. Paths are from the site root.
export const GAMES = {
  'obsessive-shadow':   { name: 'The Obsessive Shadow',                     page: 'pages/obsessive-shadow.html#chapter1',           art: 'images/tos1-cover.jpg' },
  'obsessive-shadow-2': { name: 'The Obsessive Shadow — Chapter 2',         page: 'pages/obsessive-shadow.html#chapter2',           art: 'images/tos2-cover.jpg' },
  'former-residents':   { name: 'The Obsessive Shadow: Former Residents',   page: 'pages/obsessive-shadow.html#former-residents',   art: 'images/tos-former-residents.jpg' },
  'home-invasion':      { name: 'The Obsessive Shadow: Home Invasion',      page: 'pages/obsessive-shadow.html#mixed-reality',      art: 'images/tos-mr-home-invasion.jpg' },
  'monsters-and-mazes': { name: 'The Obsessive Shadow × Monsters and Mazes', page: 'pages/obsessive-shadow.html#monsters-and-mazes', art: 'images/tos-monsters-mazes.jpg' },
  'fortnite':           { name: 'The Obsessive Shadow (Fortnite)',          page: 'pages/obsessive-shadow.html#fortnite',           art: 'images/tos-fortnite.jpg' },
  'teamjumpers':        { name: 'TeamJumpers: New Reality',                 page: 'pages/games.html',                               art: 'images/teamjumpers-cover.jpg' },
  'galactabeat':        { name: 'Galactabeat',                              page: 'pages/games.html',                               art: 'images/galactabeat-cover.jpg' },
  'studio':             { name: 'PMH Interactive',                          page: 'index.html',                                     art: 'images/og-preview.jpg' },
};

// Logos and colours for these live in css/style.css (.plat-<key>).
export const PLATFORMS = {
  steam:       'Steam',
  meta:        'Meta Quest',
  playstation: 'PlayStation',
  xbox:        'Xbox',
  epic:        'Epic Games Store',
  pico:        'PICO',
  switch:      'Nintendo Switch',
  switch2:     'Nintendo Switch 2',
  ios:         'iOS',
  macos:       'macOS',
  android:     'Android',
};

const PLATFORM_ALIASES = {
  quest: 'meta', ps: 'playstation', ps5: 'playstation', psvr2: 'playstation',
  epicgames: 'epic', ns: 'switch', ns2: 'switch2', mac: 'macos',
};

export const POST_TYPES = ['Patch Notes', 'Update', 'Announcement', 'Release', 'Event', 'Dev Log'];

export function platformKey(word) {
  const w = String(word).toLowerCase();
  return PLATFORMS[w] ? w : PLATFORM_ALIASES[w] || null;
}

export function platformIcons(keys) {
  if (!keys.length) return '';
  const icons = keys.map(k => `<span class="plat plat-${k}" role="img" aria-label="${PLATFORMS[k]}" title="${PLATFORMS[k]}"></span>`);
  return `<span class="plats">${icons.join('')}</span>`;
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function slugify(s) {
  return String(s).toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 60).replace(/-+$/, '');
}

export function formatDate(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// Paths written in a post are relative to the news/ folder ("media/shot.jpg"),
// or start at the site root ("/images/logo.png"), or are full URLs.
// This turns any of them into a path from the site root.
export function sitePath(p) {
  if (!p) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(p)) return p;
  return decodeURI(new URL(p, 'https://site.invalid/news/').pathname.slice(1));
}

// A site-root path as seen from a page `root` levels deep ('', '../', '../../').
export function fromRoot(root, p) {
  return /^[a-z][a-z0-9+.-]*:/i.test(p) ? p : root + p;
}

// ── Front matter ──────────────────────────────────────────────
// Plain `key: value` lines between two `---` fences. Nothing nested.

const FIELDS = ['title', 'game', 'type', 'version', 'date', 'platforms', 'thumbnail', 'summary', 'draft'];

export function parsePost(source) {
  const src = source.replace(/^\uFEFF/, '');
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(src);
  const meta = {};
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(':');
      if (i < 1) continue;
      meta[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim().replace(/^(["'])(.*)\1$/, '$2');
    }
  }
  return {
    title:     meta.title || '',
    game:      meta.game || '',
    type:      meta.type || 'Patch Notes',
    version:   meta.version || '',
    date:      meta.date || '',
    platforms: (meta.platforms || '').split(/[\s,/]+/).map(platformKey).filter(Boolean),
    thumbnail: meta.thumbnail || '',
    summary:   meta.summary || '',
    draft:     /^(true|yes)$/i.test(meta.draft || ''),
    body:      (m ? src.slice(m[0].length) : src).replace(/^\s*\n/, ''),
  };
}

export function serializePost(post) {
  const values = { ...post, platforms: post.platforms.join(' '), draft: post.draft ? 'true' : '' };
  const lines = FIELDS
    .filter(k => values[k])
    .map(k => `${k}: ${String(values[k]).replace(/\s*\n\s*/g, ' ').trim()}`);
  return `---\n${lines.join('\n')}\n---\n\n${post.body.trim()}\n`;
}

export function validatePost(post) {
  const problems = [];
  if (!post.title.trim()) problems.push('Give the post a title.');
  if (!GAMES[post.game]) problems.push(`"${post.game}" is not a game the site knows. Use one of: ${Object.keys(GAMES).join(', ')}.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) problems.push('The date must look like 2026-10-28.');
  if (!post.body.trim()) problems.push('The post has no content.');
  return problems;
}

// Plain-text first paragraph, for cards and link previews when no summary is given.
export function excerpt(md, max = 190) {
  const text = md
    .replace(/^:::.*$/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/:[a-z0-9]+:/gi, w => (platformKey(w.slice(1, -1)) ? '' : w))
    .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_~`]+/g, '')
    .split(/\n\s*\n/).map(p => p.replace(/\s+/g, ' ').trim())
    .find(p => p && !/^https?:\/\/\S+$/.test(p)) || '';
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max)).replace(/[,.;:!?-]+$/, '') + '…';
}

// ── Cards ─────────────────────────────────────────────────────
// `entry` is one item of news/index.json; `root` is the path to the site root.

export function cardHTML(entry, root) {
  const game = GAMES[entry.game];
  const tag = [entry.type, entry.version && `v${entry.version.replace(/^v/i, '')}`].filter(Boolean).join(' · ');
  return `<a class="news-card" href="${root}news/${entry.slug}/">
  <div class="news-card-art"><img src="${escapeHtml(fromRoot(root, entry.thumbnail))}" alt="" loading="lazy" /><span class="news-card-type">${escapeHtml(tag)}</span></div>
  <div class="news-card-body">
    <div class="news-meta">${escapeHtml(game ? game.name : '')}<span>${formatDate(entry.date)}</span></div>
    <h3 class="news-card-title">${escapeHtml(entry.title)}</h3>
    <p class="news-card-summary">${escapeHtml(entry.summary)}</p>
    ${platformIcons(entry.platforms)}
  </div>
</a>`;
}

// ── Markdown ──────────────────────────────────────────────────
// Standard Markdown (GitHub flavour, single line breaks kept) plus:
//
//   :steam: :ps: :xbox:            platform icons, inline
//   ::: playstation xbox           a block that only applies to those
//   ...                            platforms, optionally titled with
//   :::                            "::: ps | PS5 Exclusive"
//
//   https://youtu.be/xxxxxxxxxxx   a YouTube link on its own line embeds
//   ![caption](media/clip.mp4)     image syntax pointing at a video plays it

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i;
const YOUTUBE = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:\S*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})\S*$/;

const CODES = [...Object.keys(PLATFORMS), ...Object.keys(PLATFORM_ALIASES)].join('|');
const CODE_AT = new RegExp(`:(?:${CODES}):`, 'i');
const CODE_RUN = new RegExp(`^:(?:${CODES}):(?:[ \\t]*/?[ \\t]*:(?:${CODES}):)*`, 'i');

function platformsIn(text) {
  return [...text.matchAll(/:([a-z0-9]+):/gi)].map(m => platformKey(m[1]));
}

// `Marked` is passed in so this file never has to know where marked lives.
// `root` is the path from the rendering page to the site root.
// `media` optionally maps site paths to blob: URLs (the editor's unsent uploads).
export function createMarkdown(Marked, { root = '', media = null } = {}) {
  const asset = (href) => {
    const p = sitePath(href);
    return (media && media.get(p)) || fromRoot(root, p);
  };

  const mediaTag = (href, alt) => {
    const src = escapeHtml(asset(href));
    if (VIDEO_EXT.test(href)) return `<video src="${src}" controls playsinline preload="metadata"></video>`;
    return `<img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" />`;
  };

  const platformRun = {
    name: 'platformRun',
    level: 'inline',
    start(src) {
      const i = src.search(CODE_AT);
      return i < 0 ? undefined : i;
    },
    tokenizer(src) {
      const m = CODE_RUN.exec(src);
      if (m) return { type: 'platformRun', raw: m[0], keys: platformsIn(m[0]) };
    },
    renderer: t => platformIcons(t.keys),
  };

  const platformSection = {
    name: 'platformSection',
    level: 'block',
    start(src) {
      const i = src.search(/^:::/m);
      return i < 0 ? undefined : i;
    },
    tokenizer(src) {
      const m = /^:::[ \t]*([^\n|]*?)[ \t]*(?:\|[ \t]*([^\n]*?))?[ \t]*\n([\s\S]*?)\n?^:::[ \t]*(?:\n+|$)/m.exec(src);
      if (!m || m.index !== 0) return;
      const keys = m[1].split(/[\s,/]+/).filter(Boolean).map(platformKey);
      if (!keys.length || keys.includes(null)) return;
      return {
        type: 'platformSection', raw: m[0], keys,
        label: m[2] || keys.map(k => PLATFORMS[k]).join(' · '),
        tokens: this.lexer.blockTokens(m[3], []),
      };
    },
    renderer(t) {
      return `<section class="plat-section">
<div class="plat-section-head">${platformIcons(t.keys)}<span>${escapeHtml(t.label)}</span></div>
${this.parser.parse(t.tokens)}</section>\n`;
    },
  };

  const embed = {
    name: 'embed',
    level: 'block',
    start(src) {
      for (const m of src.matchAll(/^ {0,3}<?(https?:\/\/[^\s>]+)>?[ \t]*$/gm)) {
        if (YOUTUBE.test(m[1]) || VIDEO_EXT.test(m[1])) return m.index;
      }
    },
    tokenizer(src) {
      const m = /^ {0,3}<?(https?:\/\/[^\s>]+)>?[ \t]*(?:\n+|$)/.exec(src);
      if (!m) return;
      const yt = YOUTUBE.exec(m[1]);
      if (yt) return { type: 'embed', raw: m[0], youtube: yt[1] };
      if (VIDEO_EXT.test(m[1])) return { type: 'embed', raw: m[0], video: m[1] };
    },
    renderer(t) {
      if (t.video) return `<figure class="news-media">${mediaTag(t.video, '')}</figure>\n`;
      return `<figure class="news-media embed"><iframe src="https://www.youtube-nocookie.com/embed/${t.youtube}" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></figure>\n`;
    },
  };

  const renderer = {
    image({ href, text }) {
      return mediaTag(href, text);
    },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      const external = /^https?:\/\//i.test(href) && !href.startsWith(SITE_URL);
      const url = /^(#|mailto:|tel:)/i.test(href) ? href : asset(href);
      return `<a href="${escapeHtml(url)}"${title ? ` title="${escapeHtml(title)}"` : ''}${external ? ' target="_blank" rel="noopener"' : ''}>${inner}</a>`;
    },
    // An image alone in its paragraph becomes a figure; its "title" is the caption.
    paragraph({ tokens }) {
      const parts = tokens.filter(t => !(t.type === 'text' && !t.raw.trim()) && t.type !== 'br');
      if (parts.length !== 1 || parts[0].type !== 'image') return false;
      const { href, text, title } = parts[0];
      const caption = title ? `<figcaption>${escapeHtml(title)}</figcaption>` : '';
      return `<figure class="news-media">${mediaTag(href, text)}${caption}</figure>\n`;
    },
  };

  const md = new Marked({ gfm: true, breaks: true });
  md.use({ extensions: [platformSection, embed, platformRun], renderer });
  return src => md.parse(src);
}
