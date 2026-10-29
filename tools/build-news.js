// Turns pmh-interactive/news/posts/*.md into a page per post plus news/index.json.
// Runs during deploy (.github/workflows/static.yml); run `npm run news` to preview locally.
// No dependencies beyond Node itself.

import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from '../pmh-interactive/js/vendor/marked.esm.js';
import {
  GAMES, SITE_URL, parsePost, validatePost, createMarkdown, cardHTML,
  platformIcons, formatDate, escapeHtml, excerpt, sitePath, fromRoot,
} from '../pmh-interactive/js/news.js';

const here = dirname(fileURLToPath(import.meta.url));
const NEWS = join(here, '../pmh-interactive/news');
const POSTS = join(NEWS, 'posts');
const RESERVED = new Set(['posts', 'media']);
const MARKER = 'Built by tools/build-news.js';

const template = await readFile(join(here, 'news-post.html'), 'utf8');
const render = createMarkdown(Marked, { root: '../../' });

const warn = (file, msg) => console.warn(process.env.GITHUB_ACTIONS ? `::warning file=${file}::${msg}` : `! ${file}: ${msg}`);

// ── Read posts ──
const posts = [];
for (const file of (await readdir(POSTS)).filter(f => f.endsWith('.md') && !f.startsWith('_'))) {
  const slug = file.slice(0, -3);
  const rel = `pmh-interactive/news/posts/${file}`;
  const post = parsePost(await readFile(join(POSTS, file), 'utf8'));

  if (post.draft) continue;
  if (RESERVED.has(slug) || slug !== slug.toLowerCase() || /[^a-z0-9-]/.test(slug)) {
    warn(rel, 'Rename the file using only lowercase letters, numbers and dashes. Skipped.');
    continue;
  }
  const problems = validatePost(post);
  if (problems.length) {
    warn(rel, `${problems.join(' ')} Skipped.`);
    continue;
  }
  posts.push({ slug, ...post });
}

posts.sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));

const index = posts.map(p => ({
  slug:      p.slug,
  title:     p.title,
  game:      p.game,
  type:      p.type,
  version:   p.version,
  date:      p.date,
  platforms: p.platforms,
  summary:   p.summary || excerpt(p.body),
  thumbnail: sitePath(p.thumbnail) || GAMES[p.game].art,
}));

// ── Clear pages from the last build (a renamed or deleted post leaves one behind) ──
for (const entry of await readdir(NEWS, { withFileTypes: true })) {
  if (!entry.isDirectory() || RESERVED.has(entry.name)) continue;
  const page = join(NEWS, entry.name, 'index.html');
  if (existsSync(page) && (await readFile(page, 'utf8')).includes(MARKER)) {
    await rm(join(NEWS, entry.name), { recursive: true });
  }
}

// ── Write ──
for (const [i, post] of posts.entries()) {
  const entry = index[i];
  const game = GAMES[post.game];
  const thumb = fromRoot('../../', entry.thumbnail);
  const image = /^https?:/.test(entry.thumbnail) ? entry.thumbnail : `${SITE_URL}/${encodeURI(entry.thumbnail)}`;

  const related = index.filter(e => e.game === post.game && e.slug !== post.slug).slice(0, 3);
  const more = related.length ? `<section class="news-more">
  <div class="container">
    <div class="label">Keep Reading</div>
    <h2 class="section-title">More <em>${escapeHtml(game.name)}</em></h2>
    <div class="news-grid">
${related.map(e => cardHTML(e, '../../')).join('\n')}
    </div>
  </div>
</section>` : '';

  const vars = {
    slug:      post.slug,
    title:     escapeHtml(post.title),
    summary:   escapeHtml(entry.summary),
    url:       `${SITE_URL}/news/${post.slug}/`,
    image:     escapeHtml(image),
    thumbnail: escapeHtml(thumb),
    date:      post.date,
    dateLabel: formatDate(post.date),
    typeLabel: escapeHtml([post.type, post.version && `v${post.version.replace(/^v/i, '')}`].filter(Boolean).join(' · ')),
    game:      post.game,
    gameName:  escapeHtml(game.name),
    gamePage:  game.page,
    platforms: post.platforms.length ? `<div class="post-platforms">${platformIcons(post.platforms)}</div>` : '',
    body:      render(post.body),
    more,
  };

  const dir = join(NEWS, post.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? ''));
}

await writeFile(join(NEWS, 'index.json'), JSON.stringify(index, null, 1) + '\n');
console.log(`news: built ${posts.length} post${posts.length === 1 ? '' : 's'}`);
