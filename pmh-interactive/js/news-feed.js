// Fills news cards in from news/index.json.
//
//   <div data-news-feed data-games="obsessive-shadow,former-residents" data-limit="3"></div>
//       latest posts, optionally for some games only. If there is nothing to
//       show, the closest [data-news-section] around it is removed.
//
//   <div data-news-feed data-filters></div>
//       the full list with game filter chips (news/index.html), honouring ?game=
//
//   <a data-news-link="obsessive-shadow" hidden>Patch Notes</a>
//       un-hidden once that game has at least one post

import { GAMES, cardHTML, escapeHtml } from './news.js';

const root = new URL('../', import.meta.url).href;
const feeds = document.querySelectorAll('[data-news-feed]');
const links = document.querySelectorAll('[data-news-link]');

if (feeds.length || links.length) {
  fetch(`${root}news/index.json`)
    .then(r => (r.ok ? r.json() : []))
    .catch(() => [])
    .then(posts => {
      feeds.forEach(el => (el.hasAttribute('data-filters') ? filtered(el, posts) : latest(el, posts)));
      links.forEach(a => {
        const game = a.dataset.newsLink;
        if (posts.some(p => p.game === game)) {
          a.href = `${root}news/?game=${game}`;
          a.hidden = false;
        }
      });
    });
}

function latest(el, posts) {
  const games = (el.dataset.games || '').split(',').map(s => s.trim()).filter(Boolean);
  const shown = posts.filter(p => !games.length || games.includes(p.game)).slice(0, +el.dataset.limit || 3);
  if (!shown.length) {
    (el.closest('[data-news-section]') || el).remove();
    return;
  }
  el.innerHTML = shown.map(p => cardHTML(p, root)).join('');
}

function filtered(el, posts) {
  const games = Object.keys(GAMES).filter(g => posts.some(p => p.game === g));
  const bar = document.createElement('div');
  bar.className = 'news-filters';
  bar.setAttribute('role', 'tablist');
  bar.innerHTML = ['', ...games].map(g =>
    `<button type="button" role="tab" data-game="${g}">${escapeHtml(g ? GAMES[g].name : 'All')}</button>`).join('');

  const grid = document.createElement('div');
  grid.className = 'news-grid';
  el.replaceChildren(...(games.length > 1 ? [bar] : []), grid);

  const show = (game) => {
    const list = posts.filter(p => !game || p.game === game);
    grid.innerHTML = list.length
      ? list.map(p => cardHTML(p, root)).join('')
      : '<p class="news-empty">Nothing posted here yet. Check back soon.</p>';
    bar.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.game === game));
  };

  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const url = new URL(location.href);
    if (b.dataset.game) url.searchParams.set('game', b.dataset.game);
    else url.searchParams.delete('game');
    history.replaceState(null, '', url);
    show(b.dataset.game);
  });

  const wanted = new URLSearchParams(location.search).get('game') || '';
  show(games.includes(wanted) ? wanted : '');
}
