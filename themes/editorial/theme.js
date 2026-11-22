// The "Editorial" theme: a calm, typographic one-column page. No JavaScript.
// Same theme contract as every theme: module.exports = { id, files, render(data) -> html }.
const core = require('../../core/core.js');
const { esc, hostPath, siteUrl } = core;

function render(d) {
  const { site, experience, education, beyond, projects, repos, skills, extraSections, LABELS, PROFILE } = d;
  const c = site.contact;
  const link = (u, t, extra) => '<a href="' + esc(u) + '" target="_blank" rel="noopener"' + (extra || '') + '>' + esc(t) + '</a>';

  // ---------- section bodies ----------
  const projectsHtml = projects.map(p => {
    const links = [p.live && ['Live demo', p.live], p.src && ['Source', p.src], p.blog && ['Write-up', p.blog]].concat((p.extra || []).map(x => [x.l, x.u])).filter(Boolean)
      .map(([n, u]) => link(u, n)).join(' · ');
    const rows = [[LABELS.problem || 'The problem', p.problem], [LABELS.built || 'What I built', p.built], [LABELS.result || 'Result', p.result], [LABELS.stack || 'Built with', p.stack], [LABELS.role || 'My role', p.role],
      [LABELS.arch || 'Architecture', (p.arch || []).join(' → ')], [LABELS.diff || "What I'd do differently", p.diff]].filter(r => r[1]);
    return '    <article class="item">\n      <h3>' + esc(p.t) + (p.badge ? ' <span class="tag">' + esc(p.badge) + '</span>' : '') + '</h3>\n      <p class="sub">' + esc(p.sub) + '</p>\n' +
      (rows.length ? '      <dl>' + rows.map(r => '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>').join('') + '</dl>\n' : '') + (links ? '      <p class="links">' + links + '</p>\n' : '') + '    </article>';
  }).join('\n');

  const experienceHtml = experience.map(co =>
    '    <article class="item">\n      <h3>' + esc(co.company) + '</h3>\n      <p class="sub">' + esc(co.role) + ' · ' + esc(co.period) + (co.place ? ' · ' + esc(co.place) : '') + '</p>\n' +
    co.episodes.map(e =>
      '      <div class="ep">\n        <h4>' + esc(e.title) + (e.tag ? ' <span class="tag">' + esc(e.tag) + '</span>' : '') + '</h4>\n        <p>' + esc(e.blurb) + '</p>\n' +
      (e.situation ? '        <p><b>' + esc(LABELS.situation) + ':</b> ' + esc(e.situation) + '</p>\n' : '') +
      ((e.did || []).length ? '        <ul>' + e.did.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>\n' : '') +
      (e.stack ? '        <p class="sub">' + esc(LABELS.stack) + ': ' + esc(e.stack) + '</p>\n' : '') + '      </div>').join('\n') + '\n    </article>').join('\n');

  const educationHtml = education.map(e =>
    '    <article class="item">\n      <h3>' + esc(e.title) + '</h3>\n      <p class="sub">' + esc(e.school) + ' · ' + esc(e.period) + (e.extra ? ' · ' + esc(e.extra) : '') + '</p>\n' +
    ((e.chips || []).length ? '      <p>' + e.chips.map(x => '<span class="tag">' + esc(x) + '</span>').join(' ') + '</p>\n' : '') +
    ((e.details || []).length ? '      <ul>' + e.details.map(x => '<li><b>' + esc(x.label) + ':</b> ' + esc(x.text) + '</li>').join('') + '</ul>\n' : '') + '    </article>').join('\n');

  const reposHtml = '    <ul class="plain">' + repos.map(r => '<li>' + link(r.u, r.n) + ' <span class="sub">(' + esc(r.l) + (r.s ? ', ' + esc(r.s) + ' stars' : '') + ')</span><br>' + esc(r.d) + '</li>').join('') + '</ul>';
  const skillsHtml = '    <ul class="chips">' + skills.map(s => '<li>' + esc(s.n) + '<small>' + esc(s.s) + '</small></li>').join('') + '</ul>';
  const beyondHtml = beyond.map(b =>
    '    <article class="item">\n      <h3>' + esc(b.title) + (b.category ? ' <span class="tag">' + esc(b.category) + '</span>' : '') + '</h3>\n      <p>' + esc(b.blurb) + '</p>\n' +
    (b.link && b.link.url ? '      <p class="links">' + link(b.link.url, b.link.label || b.link.url) + '</p>\n' : '') + '    </article>').join('\n');
  const aboutHtml = ((site.about.paragraphs || []).map(p => '    <p>' + esc(p) + '</p>').join('\n') +
    ((site.about.facts || []).length ? '\n    <dl class="facts">' + site.about.facts.map(f => '<dt>' + esc(f.label) + '</dt><dd>' + (f.url ? link(f.url, f.value) : esc(f.value)) + '</dd>').join('') + '</dl>' : '')).trim();
  const extraBody = x => '    <ul class="plain">' + (x.items || []).map(it => '<li>' + (it.link && it.link.url ? link(it.link.url, it.title) : '<b>' + esc(it.title) + '</b>') +
    (it.meta || it.tag ? ' <span class="sub">' + [it.tag, it.meta].filter(Boolean).map(esc).join(' · ') + '</span>' : '') + (it.text ? '<br>' + esc(it.text) : '') + '</li>').join('') + '</ul>';

  // ---------- which sections, in which order (same rules as every theme) ----------
  const DEFAULT_ORDER = ['episodes', 'projects', 'github', 'skills', 'beyond', 'about'];
  const SEC = {
    episodes: { title: 'Experience', nav: 'Experience', has: experience.length > 0, body: experienceHtml },
    projects: { title: 'Projects', nav: 'Projects', has: projects.length > 0, body: projectsHtml },
    github: { title: 'On GitHub', nav: 'GitHub', has: repos.length > 0, body: reposHtml },
    skills: { title: 'Skills', nav: 'Skills', has: skills.length > 0, body: skillsHtml },
    beyond: { title: 'Beyond work', nav: 'Beyond', has: beyond.length > 0, body: beyondHtml },
    about: { title: 'About', nav: 'About', has: aboutHtml.length > 0, body: aboutHtml + (education.length ? '\n    <h3 class="subhead">Education</h3>\n' + educationHtml : '') }
  };
  if (!SEC.about.has && education.length) { SEC.about.has = true; SEC.about.title = 'Education'; SEC.about.nav = 'Education'; }
  extraSections.forEach(x => { SEC[x.id] = { title: x.title, nav: x.nav || x.title, has: (x.items || []).length > 0, body: extraBody(x) }; });
  Object.keys(site.sections || {}).forEach(id => { if (SEC[id]) { if (site.sections[id].title) SEC[id].title = site.sections[id].title; if (site.sections[id].nav) SEC[id].nav = site.sections[id].nav; } });
  SEC.skills.title = core.fixTop(SEC.skills.title, skills.length);
  const chosen = site.sectionOrder || [];
  const ORDER = chosen.filter(id => SEC[id]).concat(DEFAULT_ORDER.concat(extraSections.map(x => x.id)).filter(id => !chosen.includes(id)));
  const present = ORDER.filter(id => SEC[id].has);

  const nav = present.map(id => '<a href="#' + esc(id) + '">' + esc(SEC[id].nav) + '</a>').concat('<a href="#contact">Contact</a>').join('\n    ');
  const sections = present.map(id => '  <section id="' + esc(id) + '">\n    <h2>' + esc(SEC[id].title) + '</h2>\n' + SEC[id].body + '\n  </section>').join('\n');
  const stats = site.heroStats.length ? '<ul class="stats">' + site.heroStats.map(s => '<li><b>' + esc(s.value) + '</b> ' + esc(s.label) + '</li>').join('') + '</ul>' : '';
  const recap = site.recap.length ? '  <section id="recap">\n    <h2>' + esc(site.recapTitle || 'By the numbers') + '</h2>\n    <ul class="stats big">' + site.recap.map(r => '<li><b>' + esc(r.value) + '</b> ' + esc(r.label) + '</li>').join('') + '</ul>\n  </section>' : '';
  const resume = [site.resume.view && link(site.resume.view, 'Resume'), site.resume.download && link(site.resume.download, 'Download PDF', ' download')].filter(Boolean).join(' · ');
  const contact = '  <section id="contact">\n    <h2>' + esc(c.heading || 'Get in touch') + '</h2>\n    <p>' + esc(c.text || '') + '</p>\n    <p class="links"><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>' +
    c.links.map(l => ' · ' + link(l.url, l.label)).join('') + (resume ? ' · ' + resume : '') + '</p>\n' +
    (c.phones.length ? '    <p class="links">' + c.phones.map(p => '<a href="tel:' + esc(p.number.replace(/[^+\d]/g, '')) + '">' + esc(p.label + ' ' + p.number) + '</a>').join(' · ') + '</p>\n' : '') + '  </section>';

  const titles = { projects: SEC.projects.title, skills: SEC.skills.title };
  const textVersion = core.textVersion(d, titles);
  const html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' + core.headMeta(d, 'Portfolio') + '\n' +
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 fill=%27%23222%27/%3E%3Ctext x=%2732%27 y=%2746%27 font-size=%2740%27 font-family=%27Georgia,serif%27 text-anchor=%27middle%27 fill=%27white%27%3E' + encodeURIComponent((site.firstName || site.name).charAt(0)) + '%3C/text%3E%3C/svg%3E">\n' +
    '<link rel="stylesheet" href="style.css">\n' + core.jsonLd(d) + '\n</head>\n<body>\n<header class="top">\n  <p class="eyebrow">' + esc(site.role) + '</p>\n  <h1>' + esc(site.name) + '</h1>\n  <p class="lede">' + esc(site.tagline) + '</p>\n' +
    (site.badges.length ? '  <p class="badges">' + site.badges.map(b => '<span class="tag">' + esc(b) + '</span>').join(' ') + '</p>\n' : '') + (stats ? '  ' + stats + '\n' : '') + '  <nav aria-label="Sections">\n    ' + nav + '\n  </nav>\n</header>\n<main>\n' +
    sections + (recap ? '\n' + recap : '') + '\n' + contact + '\n</main>\n<footer>\n  <p>' + esc(site.name) + ' · ' + esc(site.role) + (site.footerNote ? ' · ' + esc(site.footerNote) : '') + '</p>\n  ' + textVersion + '\n</footer>\n' + core.analyticsTags(d) + '\n</body>\n</html>\n';
  return html;
}

module.exports = { id: 'editorial', files: ['style.css'], render };
