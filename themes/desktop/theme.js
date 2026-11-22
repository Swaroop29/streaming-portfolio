// The "Desktop" theme: a small computer desktop. Each section is a window; folders open them; a terminal answers commands.
// Without JavaScript every window is just a readable section on the page. Same theme contract as every theme.
const core = require('../../core/core.js');
const { esc } = core;

function render(d) {
  const { site, PALETTE, experience, education, beyond, projects, repos, skills, extraSections, LABELS } = d;
  const c = site.contact;
  const link = (u, t) => '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(t) + '</a>';
  const row = (k, v) => v ? '<p><b>' + esc(k) + '</b> ' + esc(v) + '</p>' : '';
  const det = (summary, sub, body) => '<details class="item"><summary><span class="t">' + esc(summary) + '</span>' + (sub ? '<span class="s">' + esc(sub) + '</span>' : '') + '</summary><div class="in">' + body + '</div></details>';
  const plain = []; // plain-text lines for the terminal, per section id
  const lines = {};

  const projectsBody = projects.map(p => {
    const links = [p.live && ['Live demo', p.live], p.src && ['Source', p.src], p.blog && ['Write-up', p.blog]].concat((p.extra || []).map(x => [x.l, x.u])).filter(Boolean).map(([n, u]) => link(u, n)).join(' · ');
    return det(p.t, p.blurb || p.sub, '<p class="meta">' + esc(p.sub) + (p.badge ? ' · ' + esc(p.badge) : '') + '</p>' + row(LABELS.problem || 'The problem', p.problem) + row(LABELS.built || 'What I built', p.built) + row(LABELS.result || 'Result', p.result) +
      row(LABELS.stack || 'Built with', p.stack) + row(LABELS.role || 'My role', p.role) + row(LABELS.arch || 'Architecture', (p.arch || []).join(' → ')) + row(LABELS.diff || "What I'd do differently", p.diff) + (links ? '<p class="links">' + links + '</p>' : ''));
  }).join('');
  lines.projects = projects.map(p => p.t + ': ' + (p.blurb || p.built));

  const experienceBody = experience.map(co => '<h3>' + esc(co.company) + '</h3><p class="meta">' + esc(co.role) + ' · ' + esc(co.period) + (co.place ? ' · ' + esc(co.place) : '') + '</p>' +
    co.episodes.map(e => det(e.title, e.tag || e.label, '<p>' + esc(e.blurb) + '</p>' + row(LABELS.situation, e.situation) + ((e.did || []).length ? '<ul>' + e.did.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + (e.stack ? '<p class="meta">' + esc(LABELS.stack) + ': ' + esc(e.stack) + '</p>' : '')).replace('<details', '<details')).join('')).join('');
  lines.episodes = experience.map(co => co.role + ', ' + co.company + ' (' + co.period + ')');

  const educationBody = education.map(e => '<h3>' + esc(e.title) + '</h3><p class="meta">' + esc(e.school) + ' · ' + esc(e.period) + (e.extra ? ' · ' + esc(e.extra) : '') + '</p>' +
    ((e.chips || []).length ? '<p>' + e.chips.map(x => '<span class="chip">' + esc(x) + '</span>').join(' ') + '</p>' : '') + ((e.details || []).length ? '<ul>' + e.details.map(x => '<li><b>' + esc(x.label) + ':</b> ' + esc(x.text) + '</li>').join('') + '</ul>' : '')).join('');
  lines.education = education.map(e => e.title + ', ' + e.school + ' (' + e.period + ')');

  const githubBody = '<ul class="list">' + repos.map(r => '<li>' + link(r.u, r.n) + ' <span class="meta">' + esc(r.l) + (r.s ? ', ' + esc(r.s) + ' stars' : '') + '</span><br>' + esc(r.d) + '</li>').join('') + '</ul>';
  lines.github = repos.map(r => r.n + ' (' + r.l + '): ' + r.d);
  const skillsBody = '<ul class="tags">' + skills.map(s => '<li>' + esc(s.n) + '<small>' + esc(s.s) + '</small></li>').join('') + '</ul>';
  lines.skills = skills.map(s => s.n + ' (' + s.s + ')');
  const beyondBody = beyond.map(b => det(b.title, b.category, '<p>' + esc(b.blurb) + '</p>' + (b.backText ? '<p>' + esc(b.backText) + '</p>' : '') + (b.link && b.link.url ? '<p class="links">' + link(b.link.url, b.link.label || b.link.url) + '</p>' : ''))).join('');
  lines.beyond = beyond.map(b => b.title + ': ' + b.blurb);
  const extraBody = x => '<ul class="list">' + (x.items || []).map(it => '<li>' + (it.link && it.link.url ? link(it.link.url, it.title) : '<b>' + esc(it.title) + '</b>') + (it.tag || it.meta ? ' <span class="meta">' + [it.tag, it.meta].filter(Boolean).map(esc).join(', ') + '</span>' : '') + (it.text ? '<br>' + esc(it.text) : '') + '</li>').join('') + '</ul>';
  const aboutBody = (site.about.paragraphs || []).map(p => '<p>' + esc(p) + '</p>').join('') + ((site.about.facts || []).length ? '<dl class="facts">' + site.about.facts.map(f => '<dt>' + esc(f.label) + '</dt><dd>' + (f.url ? link(f.url, f.value) : esc(f.value)) + '</dd>').join('') + '</dl>' : '');
  lines.about = (site.about.paragraphs || []).slice();

  const DEFAULT_ORDER = ['projects', 'episodes', 'education', 'github', 'skills', 'beyond', 'about'];
  const SEC = {
    projects: { title: 'Projects', body: projectsBody }, episodes: { title: 'Experience', body: experienceBody }, education: { title: 'Education', body: educationBody },
    github: { title: 'On GitHub', body: repos.length ? githubBody : '' }, skills: { title: skills.length >= 3 ? 'Top ' + skills.length + ' skills' : 'Skills', body: skills.length ? skillsBody : '' },
    beyond: { title: 'Beyond work', body: beyondBody }, about: { title: 'About', body: aboutBody }
  };
  extraSections.forEach(x => { SEC[x.id] = { title: x.title, body: (x.items || []).length ? extraBody(x) : '' }; lines[x.id] = (x.items || []).map(it => it.title + (it.meta ? ' (' + it.meta + ')' : '')); });
  Object.keys(site.sections || {}).forEach(id => { if (SEC[id]) { if (site.sections[id].title) SEC[id].title = site.sections[id].title; if (site.sections[id].nav) SEC[id].nav = site.sections[id].nav; } });
  SEC.skills.title = core.fixTop(SEC.skills.title, skills.length).replace(/ in my toolkit$/i, ' skills');
  const chosen = site.sectionOrder || [];
  const ORDER = chosen.filter(id => SEC[id]).concat(DEFAULT_ORDER.concat(extraSections.map(x => x.id)).filter(id => !chosen.includes(id)));
  const present = ORDER.filter(id => SEC[id] && SEC[id].body);
  const names = Object.keys(PALETTE || {});
  const col = (i) => { const p = (PALETTE || {})[names[i % names.length]] || ['#333', '#777']; return '--c1:' + p[0] + ';--c2:' + p[1]; };

  const win = (id, title, body, extra) => '    <section class="win' + (extra || '') + '" id="' + esc(id) + '" aria-label="' + esc(title) + '" style="' + col(Math.max(0, present.indexOf(id)) + 1) + '">\n      <header class="bar"><button class="close" type="button" aria-label="Close ' + esc(title) + '">&times;</button><h2>' + esc(title) + '</h2><button class="grow" type="button" aria-label="Make ' + esc(title) + ' larger">&#9633;</button></header>\n      <div class="pane">' + body + '</div>\n    </section>';
  const stats = site.heroStats.length ? '<ul class="stats">' + site.heroStats.map(s => '<li><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></li>').join('') + '</ul>' : '';
  const welcome = '<h1>' + esc(site.name) + '</h1><p class="role">' + esc(site.role) + '</p><p class="lede">' + esc(site.tagline) + '</p>' + (site.badges.length ? '<p>' + site.badges.slice(0, 4).map(b => '<span class="chip">' + esc(b) + '</span>').join(' ') + '</p>' : '') + stats +
    '<p class="hint js-only">Open a folder on the left, drag windows around, or open the terminal and type <kbd>help</kbd>.</p>';
  const resume = [site.resume.view && link(site.resume.view, 'Resume'), site.resume.download && '<a href="' + esc(site.resume.download) + '" download>Download PDF</a>'].filter(Boolean).join(' · ');
  const contactBody = '<p>' + esc(c.text || '') + '</p><p class="links"><a class="btn" href="mailto:' + esc(c.email) + '">Email ' + esc(c.email) + '</a></p><p class="links">' + c.links.map(l => link(l.url, l.label)).join(' · ') + (resume ? (c.links.length ? ' · ' : '') + resume : '') + '</p>' +
    (c.phones.length ? '<p class="meta">' + c.phones.map(p => '<a href="tel:' + esc(p.number.replace(/[^+\d]/g, '')) + '">' + esc(p.label + ' ' + p.number) + '</a>').join(' · ') + '</p>' : '');
  lines.contact = [c.email].concat(c.links.map(l => l.label + ': ' + l.url));

  const wins = [win('welcome', 'Welcome', welcome, ' welcome')].concat(present.map(id => win(id, SEC[id].title, SEC[id].body)), [win('contact', c.heading || 'Contact', contactBody)]);
  const iconIds = present.concat(['contact']);
  const iconTitle = id => id === 'contact' ? 'Contact' : SEC[id].title;
  const icons = ['welcome'].concat(iconIds).map((id, i) => '    <a class="icon" href="#' + esc(id) + '" data-open="' + esc(id) + '" style="' + col(i) + '"><i aria-hidden="true"></i><span>' + esc(id === 'welcome' ? 'Welcome' : iconTitle(id)) + '</span></a>').join('\n') +
    '\n    <a class="icon js-only" href="#terminal" data-open="terminal" style="--c1:#0d2b2b;--c2:#3ddc97"><i class="term" aria-hidden="true"></i><span>Terminal</span></a>';
  const term = '    <section class="win term-win" id="terminal" aria-label="Terminal" style="--c1:#13262b;--c2:#2d5560">\n      <header class="bar"><button class="close" type="button" aria-label="Close Terminal">&times;</button><h2>Terminal</h2><button class="grow" type="button" aria-label="Make Terminal larger">&#9633;</button></header>\n      <div class="pane"><div class="out" role="log" aria-live="polite"></div><label class="prompt"><span>$</span><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal command"></label></div>\n    </section>';

  const data = { name: site.name, role: site.role, tagline: site.tagline, titles: Object.fromEntries(['welcome'].concat(iconIds).map(id => [id, id === 'welcome' ? 'Welcome' : iconTitle(id)])), lines: Object.fromEntries(Object.entries(lines).filter(([id, v]) => iconIds.includes(id) && v.length)) };
  const textVersion = core.textVersion(d, { projects: SEC.projects.title, skills: SEC.skills.title });
  const initial = encodeURIComponent((site.firstName || site.name).charAt(0));

  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' + core.headMeta(d, 'Portfolio') + '\n' +
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 rx=%2710%27 fill=%27%2312363f%27/%3E%3Crect x=%278%27 y=%2712%27 width=%2748%27 height=%2740%27 rx=%274%27 fill=%27%23f3f5f2%27/%3E%3Ctext x=%2732%27 y=%2745%27 font-size=%2730%27 font-family=%27Arial,sans-serif%27 font-weight=%27700%27 text-anchor=%27middle%27 fill=%27%2312363f%27%3E' + initial + '%3C/text%3E%3C/svg%3E">\n' +
    '<script>document.documentElement.className="js"</script>\n<link rel="stylesheet" href="style.css">\n' + core.jsonLd(d) + '\n</head>\n<body>\n<a class="skip" href="#desk">Skip to content</a>\n' +
    '<div class="menubar"><b>' + esc(site.name) + '</b><span class="mrole">' + esc(site.role) + '</span><time class="clock js-only" aria-hidden="true"></time></div>\n' +
    '<main id="desk">\n  <nav class="icons" aria-label="Folders">\n' + icons + '\n  </nav>\n  <div class="windows">\n' + wins.join('\n') + '\n' + term + '\n  </div>\n' +
    '  <footer><p>' + esc(site.name) + ' · ' + esc(site.role) + (site.footerNote ? ' · ' + esc(site.footerNote) : '') + '</p>\n  ' + textVersion + '\n  </footer>\n</main>\n' +
    '<script id="desk-data" type="application/json">' + JSON.stringify(data).replace(/</g, '\\u003c') + '</script>\n<script src="script.js"></script>\n' + core.analyticsTags(d) + '\n</body>\n</html>\n';
}

module.exports = { id: 'desktop', files: ['style.css', 'script.js'], render };
