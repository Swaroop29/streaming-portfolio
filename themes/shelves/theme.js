// The "Shelves" theme: a dark side-menu layout with a hero banner and shelves of cards that open in a pop-up.
// Without JavaScript every card shows all of its text. Same theme contract as every theme.
const core = require('../../core/core.js');
const { esc } = core;

function render(d) {
  const { site, gradient, experience, education, beyond, projects, repos, skills, extraSections, LABELS } = d;
  const c = site.contact;
  const link = (u, t) => '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(t) + '</a>';
  const rows = (pairs) => pairs.filter(p => p[1]).map(p => '<p><b>' + esc(p[0]) + '</b> ' + esc(p[1]) + '</p>').join('');

  // A card = thumbnail, title, one line, and a detail block (hidden behind the pop-up when JavaScript runs).
  const card = (o) => '        <article class="card" tabindex="0"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + '>\n' +
    '          <div class="thumb" style="background:' + gradient(o.color || 'indigo', 135) + '"><span>' + esc(o.thumb || '') + '</span></div>\n' +
    '          <h3>' + esc(o.title) + '</h3>\n          <p class="sub">' + esc(o.sub || '') + '</p>\n' +
    '          <div class="detail">' + (o.detail || '') + '</div>\n        </article>';

  const projectCards = projects.map(p => {
    const links = [p.live && ['Live demo', p.live], p.src && ['Source', p.src], p.blog && ['Write-up', p.blog]].concat((p.extra || []).map(x => [x.l, x.u])).filter(Boolean).map(([n, u]) => link(u, n)).join(' · ');
    return card({ color: p.color, thumb: p.badge || p.sub.split('·')[0], title: p.t, sub: p.blurb || p.sub,
      detail: '<p class="meta">' + esc(p.sub) + '</p>' + rows([[LABELS.problem || 'The problem', p.problem], [LABELS.built || 'What I built', p.built], [LABELS.result || 'Result', p.result], [LABELS.stack || 'Built with', p.stack], [LABELS.role || 'My role', p.role], [LABELS.arch || 'Architecture', (p.arch || []).join(' → ')], [LABELS.diff || "What I'd do differently", p.diff]]) + (links ? '<p class="links">' + links + '</p>' : '') });
  });
  const episodeCards = [].concat(...experience.map(co => co.episodes.map(e => card({ color: e.color, thumb: e.label, title: e.title, sub: co.company + ' · ' + co.period,
    detail: '<p class="meta">' + esc(co.role) + ' · ' + esc(co.company) + ' · ' + esc(co.period) + (co.place ? ' · ' + esc(co.place) : '') + '</p><p>' + esc(e.blurb) + '</p>' +
      (e.situation ? '<p><b>' + esc(LABELS.situation) + '</b> ' + esc(e.situation) + '</p>' : '') + ((e.did || []).length ? '<ul>' + e.did.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + (e.stack ? '<p class="meta">' + esc(LABELS.stack) + ': ' + esc(e.stack) + '</p>' : '') }))));
  const educationCards = education.map(e => card({ color: 'blue', thumb: e.level.split('·')[0], title: e.title, sub: e.school + ' · ' + e.period,
    detail: '<p class="meta">' + esc(e.school) + ' · ' + esc(e.period) + (e.extra ? ' · ' + esc(e.extra) : '') + '</p>' + ((e.chips || []).length ? '<p>' + e.chips.map(x => '<span class="chip">' + esc(x) + '</span>').join(' ') + '</p>' : '') + ((e.details || []).length ? '<ul>' + e.details.map(x => '<li><b>' + esc(x.label) + ':</b> ' + esc(x.text) + '</li>').join('') + '</ul>' : '') }));
  const repoCards = repos.map(r => card({ color: 'dark', thumb: r.l, title: r.n, sub: r.d, detail: '<p>' + esc(r.d) + '</p><p class="meta">' + esc(r.l) + (r.s ? ' · ' + esc(r.s) + ' stars' : '') + '</p><p class="links">' + link(r.u, 'Open on GitHub') + '</p>' }));
  const skillCards = skills.map((s, i) => card({ color: s.color, thumb: String(i + 1), title: s.n, sub: s.s, detail: '<p>' + esc(s.n) + ' · ' + esc(s.s) + '</p>' }));
  const beyondCards = beyond.map(b => card({ color: b.color, thumb: b.category || '', title: b.title, sub: b.blurb, detail: '<p>' + esc(b.blurb) + '</p>' + (b.backText ? '<p>' + esc(b.backText) + '</p>' : '') + (b.link && b.link.url ? '<p class="links">' + link(b.link.url, b.link.label || b.link.url) + '</p>' : '') }));
  const extraCards = (x) => (x.items || []).map(it => card({ color: it.color, thumb: it.tag || '', title: it.title, sub: it.meta || it.text || '', detail: (it.text ? '<p>' + esc(it.text) + '</p>' : '') + (it.meta ? '<p class="meta">' + esc(it.meta) + '</p>' : '') + (it.link && it.link.url ? '<p class="links">' + link(it.link.url, it.link.label || it.title) + '</p>' : '') }));
  const aboutBlock = ((site.about.paragraphs || []).map(p => '<p>' + esc(p) + '</p>').join('') + ((site.about.facts || []).length ? '<dl class="facts">' + site.about.facts.map(f => '<dt>' + esc(f.label) + '</dt><dd>' + (f.url ? link(f.url, f.value) : esc(f.value)) + '</dd>').join('') + '</dl>' : ''));

  const DEFAULT_ORDER = ['projects', 'episodes', 'education', 'github', 'skills', 'beyond', 'about'];
  const SEC = {
    projects: { title: 'Featured projects', nav: 'Projects', cards: projectCards },
    episodes: { title: 'Continue watching', nav: 'Experience', cards: episodeCards },
    education: { title: 'Education', nav: 'Education', cards: educationCards },
    github: { title: 'On GitHub', nav: 'GitHub', cards: repoCards },
    skills: { title: skills.length >= 3 ? 'Top ' + skills.length + ' in my toolkit' : 'In my toolkit', nav: 'Skills', cards: skillCards },
    beyond: { title: 'Beyond work', nav: 'Beyond', cards: beyondCards },
    about: { title: 'About', nav: 'About', html: aboutBlock }
  };
  extraSections.forEach(x => { SEC[x.id] = { title: x.title, nav: x.nav || x.title, cards: extraCards(x) }; });
  Object.keys(site.sections || {}).forEach(id => { if (SEC[id]) { if (site.sections[id].title) SEC[id].title = site.sections[id].title; if (site.sections[id].nav) SEC[id].nav = site.sections[id].nav; } });
  SEC.skills.title = core.fixTop(SEC.skills.title, skills.length);
  const chosen = site.sectionOrder || [];
  const ORDER = chosen.filter(id => SEC[id]).concat(DEFAULT_ORDER.concat(extraSections.map(x => x.id)).filter(id => !chosen.includes(id)));
  const present = ORDER.filter(id => SEC[id] && ((SEC[id].cards && SEC[id].cards.length) || (SEC[id].html && SEC[id].html.length)));

  const shelves = present.map(id => '    <section class="shelf" id="' + esc(id) + '">\n      <h2>' + esc(SEC[id].title) + '</h2>\n' +
    (SEC[id].html ? '      <div class="about">' + SEC[id].html + '</div>' : '      <div class="track">\n' + SEC[id].cards.join('\n') + '\n      </div>') + '\n    </section>').join('\n');
  const menu = ['<a href="#top">Home</a>'].concat(present.map(id => '<a href="#' + esc(id) + '">' + esc(SEC[id].nav) + '</a>'), '<a href="#contact">Contact</a>').join('\n    ');
  const stats = site.heroStats.length ? '<ul class="stats">' + site.heroStats.map(s => '<li><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></li>').join('') + '</ul>' : '';
  const firstId = present[0] || 'contact';
  const resume = [site.resume.view && link(site.resume.view, 'Resume'), site.resume.download && '<a href="' + esc(site.resume.download) + '" download>Download PDF</a>'].filter(Boolean).join(' · ');
  const contact = '    <section class="shelf" id="contact">\n      <h2>' + esc(c.heading || 'Get in touch') + '</h2>\n      <div class="about"><p>' + esc(c.text || '') + '</p><p class="links"><a class="btn" href="mailto:' + esc(c.email) + '">Email me</a> ' + c.links.map(l => link(l.url, l.label)).join(' · ') + (resume ? ' · ' + resume : '') + '</p><p class="meta">' + esc(c.email) + '</p>' +
    (c.phones.length ? '<p class="meta">' + c.phones.map(p => '<a href="tel:' + esc(p.number.replace(/[^+\d]/g, '')) + '">' + esc(p.label + ' ' + p.number) + '</a>').join(' · ') + '</p>' : '') + '</div>\n    </section>';
  const textVersion = core.textVersion(d, { projects: SEC.projects.title, skills: SEC.skills.title });
  const initial = encodeURIComponent((site.firstName || site.name).charAt(0));

  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' + core.headMeta(d, 'Portfolio') + '\n' +
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 rx=%2714%27 fill=%27%230b1220%27/%3E%3Ctext x=%2732%27 y=%2745%27 font-size=%2740%27 font-family=%27Arial,sans-serif%27 font-weight=%27700%27 text-anchor=%27middle%27 fill=%27%2338bdf8%27%3E' + initial + '%3C/text%3E%3C/svg%3E">\n' +
    '<script>document.documentElement.className="js"</script>\n<link rel="stylesheet" href="style.css">\n' + core.jsonLd(d) + '\n</head>\n<body>\n' +
    '<a class="skip" href="#main">Skip to content</a>\n<nav class="rail" aria-label="Sections">\n  <div class="brand">' + esc((site.firstName || site.name).toUpperCase()) + '</div>\n  <div class="links">\n    ' + menu + '\n  </div>\n</nav>\n' +
    '<main id="main">\n  <header class="hero" id="top">\n    <p class="eyebrow">' + esc(site.role) + '</p>\n    <h1>' + esc(site.name) + '</h1>\n    <p class="lede">' + esc(site.tagline) + '</p>\n' +
    (site.badges.length ? '    <p class="badges">' + site.badges.slice(0, 4).map(b => '<span class="chip">' + esc(b) + '</span>').join(' ') + '</p>\n' : '') + (stats ? '    ' + stats + '\n' : '') +
    '    <p class="cta"><a class="btn" href="#' + esc(firstId) + '">' + esc(site.heroCta || (firstId === 'projects' ? 'See my work' : 'Explore')) + '</a> <a class="btn ghost" href="#contact">Contact</a></p>\n  </header>\n' + shelves + '\n' + contact + '\n' +
    '  <footer><p>' + esc(site.name) + ' · ' + esc(site.role) + (site.footerNote ? ' · ' + esc(site.footerNote) : '') + '</p>\n  ' + textVersion + '\n  </footer>\n</main>\n' +
    '<dialog id="pop" aria-labelledby="pop-title"><button class="x" aria-label="Close">&times;</button><div class="body"></div></dialog>\n<script src="script.js"></script>\n' + core.analyticsTags(d) + '\n</body>\n</html>\n';
}

module.exports = { id: 'shelves', files: ['style.css', 'script.js'], render };
