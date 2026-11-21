// Renders index.html (from index.template.html + profile.js), plus llms.txt, robots.txt and sitemap.xml.
// Run with:  npm run build
const fs = require('fs');
const path = require('path');
// PORTFOLIO_PROFILE and PORTFOLIO_OUT let the tests build a different profile into a temporary folder.
const OUT = process.env.PORTFOLIO_OUT || '.';
const out = f => path.join(OUT, f);
const PROFILE = require(path.resolve(process.env.PORTFOLIO_PROFILE || './profile.js'));
const { site, gradient } = PROFILE;
// Every content list is optional: a missing or empty list removes its section from the page.
const experience = PROFILE.experience || [], education = PROFILE.education || [], beyond = PROFILE.beyond || [], projects = PROFILE.projects || [],
  repos = PROFILE.repos || [], skills = PROFILE.skills || [], extraSections = PROFILE.extraSections || [];
site.contact = site.contact || {}; site.contact.links = site.contact.links || []; site.contact.phones = site.contact.phones || [];
site.about = site.about || {}; site.about.paragraphs = site.about.paragraphs || []; site.about.facts = site.about.facts || [];
site.badges = site.badges || []; site.heroStats = site.heroStats || []; site.recap = site.recap || []; site.resume = site.resume || {};
const LABELS = Object.assign({ situation: 'The situation', did: 'What I did', stack: 'Built with' }, site.labels || {});
const ICONS = require('./icons.json');

const esc = v => String(v == null ? '' : v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SITE = String(site.url || '').replace(/\/+$/, '');
const brand = String(site.brand || site.firstName || site.name.split(' ')[0]).toUpperCase();
const hostPath = u => String(u).replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, '');
const github = (site.contact.links.find(l => /github\.com/.test(l.url)) || {}).url || '';

// ---------- head ----------
const shareTitle = site.name + ' | ' + site.role;
const shortDesc = site.description;
const head = [
  '<title>' + esc(site.name) + ' Streaming Portfolio</title>',
  '<meta name="description" content="' + esc(shortDesc) + '">',
  '<link rel="canonical" href="' + esc(SITE) + '/">',
  '<meta property="og:type" content="website">',
  '<meta property="og:site_name" content="' + esc(site.name) + '">',
  '<meta property="og:title" content="' + esc(shareTitle) + '">',
  '<meta property="og:description" content="' + esc(shortDesc) + '">',
  '<meta property="og:url" content="' + esc(SITE) + '/">',
  '<meta property="og:image" content="' + esc(SITE) + '/assets/og-image.png">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  '<meta property="og:image:alt" content="' + esc(site.name + ', ' + site.role.toLowerCase()) + '">',
  '<meta name="twitter:card" content="summary_large_image">',
  '<meta name="twitter:title" content="' + esc(shareTitle) + '">',
  '<meta name="twitter:description" content="' + esc(shortDesc) + '">',
  '<meta name="twitter:image" content="' + esc(SITE) + '/assets/og-image.png">'
].join('\n');

const initial = encodeURIComponent(brand.charAt(0));
const favicon = '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 rx=%2712%27 fill=%27%23e5231b%27/%3E%3Ctext x=%2732%27 y=%2747%27 font-size=%2742%27 font-family=%27Arial Narrow,Impact,sans-serif%27 font-weight=%27700%27 text-anchor=%27middle%27 fill=%27white%27%3E' + initial + '%3C/text%3E%3C/svg%3E">';

const jsonld = '<script type="application/ld+json">\n' + JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Person', name: site.name, url: SITE + '/', jobTitle: site.role, description: site.description,
  alumniOf: education.map(e => ({ '@type': 'CollegeOrUniversity', name: e.school })),
  knowsAbout: skills.map(s => s.n),
  sameAs: site.contact.links.map(l => l.url)
}) + '\n</script>';

// ---------- intro and hero ----------
const letters = [...brand].filter(c => c.trim());
const introName = '<div class="i-name">' + letters.map((c, i) => {
  const h = letters.length > 1 ? (1 - 0.11 * Math.sin(Math.PI * i / (letters.length - 1))).toFixed(2) : '1.00';
  return '<span style="--h:' + h + '"><b data-c="' + esc(c) + '">' + esc(c) + '</b></span>';
}).join('') + '</div>';

const heroMeta = '<div class="meta">\n      <b class="match">98% Match <span aria-label="just kidding" role="img" style="font-weight:400">&#128521;</span></b>\n      <span>' + esc(site.year) + '</span>\n' +
  site.badges.slice(0, 4).map((b, i) => '      <span' + (i === 0 ? ' class="age"' : '') + '>' + esc(b) + '</span>').join('\n') + '\n    </div>';
const heroStats = !site.heroStats.length ? '' : '<div class="stats">\n' + site.heroStats.map(s => '      <div><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></div>').join('\n') + '\n    </div>';
const resumeNav = site.resume.view ? '<a class="b info" data-track="resume" style="font-size:14px;padding:6px 16px" href="' + esc(site.resume.view) + '" target="_blank" rel="noopener">Resume</a>' : '';
const resumeHero = site.resume.download ? '<a class="b info" data-track="resume" href="' + esc(site.resume.download) + '" target="_blank" rel="noopener" download><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14v-2H5zM12 16l6-7h-4V3h-4v6H6z"/></svg>Download PDF</a>' : '';

// ---------- experience ----------
const experienceHtml = experience.map((co, ci) => {
  const eps = co.episodes.map((e, i) =>
    '      <div class="ep" role="button" tabindex="0" aria-expanded="false">\n' +
    '        <div class="n">' + (i + 1) + '</div>\n' +
    '        <div class="th" style="background:' + gradient(e.color, 135) + '">' + esc(e.label) + '</div>\n' +
    '        <div><h4>' + esc(e.title) + '</h4><p>' + esc(e.blurb) + '</p></div>\n' +
    '        <div class="dur">' + esc(e.tag) + '</div>\n' +
    '        <i class="chev" aria-hidden="true"></i>\n' +
    '        <div class="ep-more"><div class="ep-more-in">' + (e.situation ? '<div><b>' + esc(LABELS.situation) + '</b><p>' + esc(e.situation) + '</p></div>' : '') + ((e.did || []).length ? '<div><b>' + esc(LABELS.did) + '</b><ul>' +
    e.did.map(d => '<li>' + esc(d) + '</li>').join('') + '</ul></div>' : '') + (e.stack ? '<div><b>' + esc(LABELS.stack) + '</b><p>' + esc(e.stack) + '</p></div>' : '') + '</div></div>\n' +
    '      </div>').join('\n');
  return '      <div class="ep-head"' + (ci ? ' style="margin-top:22px"' : '') + '><h3>' + esc(co.company) + '</h3><span>' + esc([co.role, co.period, co.place].filter(Boolean).join(' · ')) + '</span></div>\n' + eps;
}).join('\n');

const recapBody = site.recap.map(r => '      <div class="stat"><b>' + esc(r.value) + '</b><span>' + esc(r.label) + '</span></div>').join('\n') +
  (site.status ? '\n      <div class="now"><i></i>' + esc(site.status) + '</div>' : '');
const recapHtml = (site.recap.length || site.status)
  ? '    <aside class="recap" aria-label="Season recap">\n      <div class="eyebrow">SEASON RECAP</div>\n      <h3>' + esc(site.recapTitle || 'By the numbers') + '</h3>\n' + recapBody + '\n    </aside>' : '';

// ---------- beyond code ----------
const generic = '<svg viewBox="0 0 64 64" aria-hidden="true"><g class="a"><path d="M32 8l7 16 17 2-13 12 4 17-15-9-15 9 4-17L8 26l17-2z"/></g></svg>';
const EXTRA_ICONS = {
  book: '<svg viewBox="0 0 64 64" aria-hidden="true"><g class="a"><path d="M12 14h18a4 4 0 014 4v32a4 4 0 00-4-4H12z"/><path d="M52 14H34a4 4 0 00-4 4v32a4 4 0 014-4h18z"/></g></svg>',
  music: '<svg viewBox="0 0 64 64" aria-hidden="true"><g class="a"><path d="M26 46V16l26-6v30"/><circle cx="20" cy="46" r="6"/><circle cx="46" cy="40" r="6"/></g></svg>',
  camera: '<svg viewBox="0 0 64 64" aria-hidden="true"><g class="a"><rect x="8" y="18" width="48" height="34" rx="6"/><circle cx="32" cy="35" r="10"/><path d="M22 18l4-6h12l4 6"/></g></svg>',
  star: generic
};
const iconFor = k => ICONS[k] || EXTRA_ICONS[k] || generic;
const beyondHtml = beyond.map(b => {
  const g = gradient(b.color, 160);
  return '        <div class="bey" tabindex="0" role="button" aria-pressed="false" aria-label="' + esc(b.title) + ': click to flip"><div class="bey-in">' +
    '<div class="bf front" style="background:' + g + '">' + iconFor(b.icon) + '<small>' + esc(b.category) + '</small><b>' + esc(b.title) + '</b><p>' + esc(b.blurb) + '</p><span class="hint">Tap to flip</span></div>' +
    '<div class="bf back" style="background:' + g + '"><small>' + esc(b.category) + '</small><b>' + esc(b.backTitle) + '</b><p>' + esc(b.backText) + '</p>' +
    (b.link ? '<a class="b play" href="' + esc(b.link.url) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">' + esc(b.link.label) + '</a>' : '') +
    '</div></div></div>';
}).join('\n');

// ---------- about and education ----------
const aboutHtml = (site.about.paragraphs.length ? '      <div>\n        <div class="eyebrow">' + esc(site.about.eyebrow || '') + '</div>\n        <h3>' + esc(site.about.heading || ('About ' + site.firstName)) + '</h3>\n' +
  site.about.paragraphs.map(p => '        <p>' + esc(p) + '</p>').join('\n') + '\n      </div>\n' : '') + (site.about.facts.length ? '      <dl>\n' +
  site.about.facts.map(f => '        <dt>' + esc(f.label) + '</dt><dd>' + (f.url ? '<a href="' + esc(f.url) + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">' + esc(f.value) + '</a>' : esc(f.value)) + '</dd>').join('\n') + '\n      </dl>\n' : '') +
  (education.length ? '      <div class="edu" id="edu">\n        <h4>Education <small>Tap a stop to open it</small></h4>\n        <ol class="tl">\n' +
    education.map(e => '          <li class="stop" tabindex="0" role="button" aria-expanded="false"><div class="when">' + esc(e.level) + '</div><h5>' + esc(e.title) + ' <i class="chev" aria-hidden="true"></i></h5><div class="where">' +
      esc([e.school, e.period, e.extra].filter(Boolean).join(' · ')) + '</div>' +
      ((e.chips || []).length ? '<div class="chips">' + e.chips.map(c => '<span>' + esc(c) + '</span>').join('') + '</div>' : '') +
      ((e.details || []).length ? '\n            <div class="more"><div class="more-in">' + e.details.map(d => '<p><b>' + esc(d.label) + ':</b> ' + esc(d.text) + '</p>').join('') + '</div></div>' : '') + '</li>').join('\n') +
    '\n        </ol>\n      </div>' : '');

// ---------- contact and footer ----------
const c = site.contact;
const contactHtml = '<section class="upnext pad" id="contact">\n  <small>UP NEXT</small>\n  <h2>' + esc(c.heading) + '</h2>\n  <p>' + esc(c.text) + '</p>\n  <div class="cta">\n' +
  '    <a class="b play" href="mailto:' + esc(c.email) + '">Email me</a>\n' +
  c.links.map(l => '    <a class="b info" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>').join('\n') + '\n  </div>\n' +
  '  <div class="mail">' + esc(c.email) + '</div>\n' +
  (c.phones.length ? '  <div class="mail phones">' + c.phones.map(p => '<a href="tel:' + esc(p.number.replace(/[^+\d]/g, '')) + '">' + esc(p.label + ' ' + p.number) + '</a>').join('<span> &middot; </span>') + '</div>\n' : '') +
  '</section>';
const footerHtml = '<footer class="pad"><span>' + esc(site.name) + ' &middot; ' + esc(site.role) + '</span><span><button class="flink" id="kb-open" type="button">Keyboard shortcuts (?)</button> &middot; <button class="flink" id="print-open" type="button">Print view</button>' + (site.footerNote ? ' &middot; ' + esc(site.footerNote) : '') + '</span></footer>';

// ---------- plain-text version for crawlers ----------
function projectHtml(p) {
  const links = [p.live && ['Live demo', p.live], p.src && ['Source code', p.src], p.blog && ['Write-up', p.blog]].filter(Boolean).map(([n, u]) => '<a href="' + esc(u) + '">' + n + '</a>').join(' &middot; ');
  return '<article><h4>' + esc(p.t) + '</h4><p><em>' + esc(p.sub) + (p.badge ? ' &middot; ' + esc(p.badge) : '') + '</em></p>' +
    (p.problem ? '<p><b>Problem:</b> ' + esc(p.problem) + '</p>' : '') + '<p><b>What I built:</b> ' + esc(p.built) + '</p><p><b>Result:</b> ' + esc(p.result) + '</p><p><b>Built with:</b> ' + esc(p.stack) + '</p><p><b>My role:</b> ' + esc(p.role) + '</p>' +
    ((p.arch || []).length ? '<p><b>Architecture:</b> ' + p.arch.map(esc).join(' &rarr; ') + '</p>' : '') + (p.diff ? '<p><b>What I would do differently:</b> ' + esc(p.diff) + '</p>' : '') + (links ? '<p>' + links + '</p>' : '') + '</article>';
}

// ---------- analytics and print ----------
const analytics = site.analytics && site.analytics.goatcounter
  ? '<script src="analytics.js"></script>\n<script data-goatcounter="https://' + esc(site.analytics.goatcounter) + '.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>' : '';
const printContact = [c.email].concat(c.phones.map(p => p.label + ' ' + p.number), c.links.map(l => hostPath(l.url))).join('  \\00B7  ');
const initials = (site.firstName.charAt(0) + site.lastName.charAt(0)).toUpperCase().replace(/["\\]/g, '');
const rootStyle = '<style>:root{--initials:"' + initials + '"}</style>';
const printStyle = '<style media="print">:root{--print-contact:"' + printContact.replace(/"/g, '') + '";--print-footer:"Full project write-ups and live demos: ' + hostPath(SITE).replace(/"/g, '') + '"}</style>';

// ---------- assemble ----------
let html = fs.readFileSync('index.template.html', 'utf8');

// ---------- sections: which ones exist, their order, titles, navigation ----------
// A section appears only when it has content. site.sections can rename any of them, site.sectionOrder reorders them,
// and extraSections (profile.js) adds new ones, so the page fits the person's job instead of a fixed template.
const DEFAULT_ORDER = ['projects', 'github', 'episodes', 'skills', 'beyond', 'about'];
const SEC = {
  projects: { title: 'Featured projects', small: '[' + projects.length + ' titles]', nav: 'Projects', tab: 'Work', has: projects.length > 0 },
  github: { title: 'On GitHub', small: site.githubUser || '', nav: 'GitHub', tab: 'GitHub', has: repos.length > 0 },
  episodes: { title: 'Continue watching', small: 'Season 1', nav: 'Experience', tab: 'Experience', has: experience.length > 0 },
  skills: { title: 'Top 10 in my toolkit', small: 'Today', nav: 'Skills', tab: 'Skills', has: skills.length > 0 },
  beyond: { title: 'Beyond code', small: 'Extras', nav: 'Beyond', tab: 'Beyond', has: beyond.length > 0 },
  about: { title: 'Cast & crew', small: 'More info', nav: 'About', tab: 'About', has: aboutHtml.trim().length > 0 }
};
extraSections.forEach(x => { SEC[x.id] = { title: x.title, small: x.small || '', nav: x.nav || x.title, tab: x.nav || x.title, has: (x.items || []).length > 0, custom: x }; });
Object.keys(site.sections || {}).forEach(id => { if (SEC[id]) Object.assign(SEC[id], site.sections[id]); });
const ORDER = (site.sectionOrder || []).filter(id => SEC[id]).concat(DEFAULT_ORDER.concat(extraSections.map(x => x.id)).filter(id => !(site.sectionOrder || []).includes(id)));
const present = ORDER.filter(id => SEC[id].has);

function extraHtml(x) {
  const items = (x.items || []).map(it => {
    const inner = '<b>' + esc(it.title) + '</b>' + (it.text ? '<p>' + esc(it.text) + '</p>' : '<p></p>') +
      ((it.meta || it.tag) ? '<div class="m">' + (it.meta ? '<i style="--c:' + esc(((PROFILE.PALETTE || {})[it.color] || [])[1] || '#888') + '">' + esc(it.meta) + '</i>' : '') + (it.tag ? '<span>' + esc(it.tag) + '</span>' : '') + '</div>' : '');
    return it.link && it.link.url
      ? '        <a class="repo" href="' + esc(it.link.url) + '" target="_blank" rel="noopener">' + inner + '</a>'
      : '        <div class="repo">' + inner + '</div>';
  }).join('\n');
  return '  <section class="row" id="' + esc(x.id) + '">\n    <h2>' + esc(x.title) + (x.small ? ' <small>' + esc(x.small) + '</small>' : '') + '</h2>\n    <div class="track-wrap">\n      <button class="arrow l" aria-label="Scroll left">&#8249;</button>\n      <div class="track">\n' + items + '\n      </div>\n      <button class="arrow r" aria-label="Scroll right">&#8250;</button>\n    </div>\n  </section>\n';
}

// The top menu has room for about five sections; About is always kept when present.
const navSections = present.filter(id => id !== 'about').slice(0, 4).concat(present.includes('about') ? ['about'] : []);
const navLinks = ['home'].concat(ORDER.filter(id => navSections.includes(id))).concat(['contact']);
const navHtml = navLinks.map(id => '    <a href="#' + id + '">' + esc(id === 'home' ? 'Home' : id === 'contact' ? 'Contact' : SEC[id].nav) + '</a>').join('\n');
const TAB_ICON = {
  home: '<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/>',
  projects: '<path d="M8 5v14l11-7z"/>',
  episodes: '<path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z"/>',
  skills: '<path d="M12 3l2.6 6 6.4.6-4.9 4.3 1.5 6.3L12 17l-5.6 3.2 1.5-6.3L3 9.6 9.4 9z"/>',
  contact: '<path d="M4 4h16v12H8l-4 4z"/>'
};
const GENERIC_TAB = '<path d="M5 4h14v16H5zm3 4v2h8V8zm0 4v2h8v-2z"/>';
const tabIds = ['home'].concat(present.slice(0, 3)).concat(['contact']);   // the phone tab bar has room for five
const tabsHtml = tabIds.map(id => '  <a href="#' + id + '" data-s="' + id + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + (TAB_ICON[id] || GENERIC_TAB) + '</svg>' + esc(id === 'home' ? 'Home' : id === 'contact' ? 'Contact' : SEC[id].tab) + '</a>').join('\n');
const firstId = present[0] || 'contact';
const heroCta = '      <a class="b play" href="#' + firstId + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg>' + esc(site.heroCta || (firstId === 'projects' ? 'Watch my work' : 'Explore my profile')) + '</a>';

const textVersion = '<details class="textver" id="text-version"><summary>Plain-text version of this portfolio (all sections as plain text)</summary>\n' + (projects.length ? '<h3>' + esc(SEC.projects.title) + '</h3>\n' + projects.map(projectHtml).join('\n') + '\n' : '') +
  (repos.length ? '<h3>GitHub repositories</h3><ul>' + repos.map(r => '<li><a href="' + esc(r.u) + '">' + esc(r.n) + '</a> (' + esc(r.l) + '): ' + esc(r.d) + '</li>').join('') + '</ul>\n' : '') +
  (skills.length ? '<h3>' + esc(SEC.skills.title) + '</h3><ul>' + skills.map(s => '<li>' + esc(s.n) + ' (' + esc(s.s) + ')</li>').join('') + '</ul>\n' : '') +
  extraSections.filter(x => (x.items || []).length).map(x => '<h3>' + esc(x.title) + '</h3><ul>' + x.items.map(it => '<li>' + (it.link && it.link.url ? '<a href="' + esc(it.link.url) + '">' + esc(it.title) + '</a>' : esc(it.title)) + (it.meta ? ' (' + esc(it.meta) + ')' : '') + (it.text ? ': ' + esc(it.text) : '') + '</li>').join('') + '</ul>\n').join('') + '</details>';

// Picker labels can be renamed for non-engineering roles (site.profileNames: { recruiter, manager, engineer, guest }).
const PNAMES = site.profileNames || {};
const DEFAULT_PICKER = { recruiter: 'Recruiter', manager: 'Hiring Manager', engineer: 'Engineer', guest: 'Just Browsing' };
const BUBBLES = { engineer: 'Compiling…' };
Object.keys(DEFAULT_PICKER).forEach(id => {
  if (PNAMES[id]) html = html.replace(new RegExp('(data-id="' + id + '">[\\s\\S]*?<span>)[^<]*(</span>)'), (m, a, z) => a + esc(PNAMES[id]) + z);
});
if (site.engineerBubble) html = html.replace(BUBBLES.engineer, esc(site.engineerBubble));

const marks = {
  HEAD: head, FAVICON: favicon, JSONLD: jsonld + '\n' + rootStyle + '\n' + printStyle, EXPERIENCE: experienceHtml, RECAP: recapHtml, BEYOND: beyondHtml, ABOUT: aboutHtml,
  CONTACT: contactHtml, FOOTER: footerHtml, TEXTVERSION: textVersion, HERO_META: heroMeta, HERO_STATS: heroStats, RESUME_NAV: resumeNav, NAV: navHtml, TABS: tabsHtml, HERO_CTA: heroCta, RESUME_HERO: resumeHero, ANALYTICS: analytics
};
for (const [k, v] of Object.entries(marks)) html = html.replace('<!--@' + k + '-->', () => v);
const vars = { BRAND: esc(brand), INTRO_NAME: introName, HERO_NAME: '<span>' + esc(site.firstName) + '</span><br><span>' + esc(site.lastName) + '</span>', TAGLINE: esc(site.tagline), PROJECT_COUNT: String(projects.length), GITHUB_USER: esc(site.githubUser) };
for (const [k, v] of Object.entries(vars)) html = html.split('{{' + k + '}}').join(v);

// Keep only the sections that have content, in the chosen order, with their (possibly renamed) headings.
html = html.replace(/(<main class="pad">\n)([\s\S]*?)(\n<\/main>)/, (all, open, body, close) => {
  const blocks = {};
  body.replace(/  <section class="row[^"]*" id="([\w-]+)">[\s\S]*?<\/section>\n/g, (m, id) => { blocks[id] = m; return m; });
  const out2 = present.map(id => {
    let b = SEC[id].custom ? extraHtml(SEC[id].custom) : blocks[id];
    if (!b) return '';
    return b.replace(/<h2>[\s\S]*?<\/h2>/, '<h2>' + esc(SEC[id].title) + (SEC[id].small ? ' <small>' + esc(SEC[id].small) + '</small>' : '') + '</h2>');
  }).join('\n');
  return open + out2 + close;
});
if (!recapHtml) html = html.replace('<div class="ep-layout">', '<div class="ep-layout solo">');
const leftover = html.match(/<!--@[A-Z_]+-->|\{\{[A-Z_]+\}\}/g);
if (leftover) throw new Error('Unreplaced template markers: ' + leftover.join(', '));
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(out('index.html'), html);

// ---------- llms.txt, robots.txt, sitemap.xml ----------
const md = '# ' + site.name + '\n\n> ' + site.role + '. Portfolio: ' + SITE + '\n\nThis file holds the full content of the portfolio so that people and AI agents can read all of it without running JavaScript.\n\n' +
  '## Contact\n- Email: ' + c.email + '\n' + c.phones.map(p => '- ' + p.label + ' phone: ' + p.number + '\n').join('') + c.links.map(l => '- ' + l.label + ': ' + l.url).join('\n') + '\n\n' +
  ((site.about.paragraphs.length || site.about.facts.length) ? ('## About\n' + site.about.paragraphs.join('\n\n') + '\n\n' + site.about.facts.map(f => '- ' + f.label + ': ' + f.value).join('\n') + '\n\n') : '') +
  (experience.length ? ('## Experience\n' + experience.map(co => '### ' + co.company + ' · ' + [co.role, co.period, co.place].filter(Boolean).join(' · ') + '\n' + co.episodes.map(e => '- ' + e.title + ': ' + e.blurb + ' Situation: ' + e.situation + ' What I did: ' + (e.did || []).join(' ') + ' Built with: ' + e.stack).join('\n')).join('\n\n') + '\n\n') : '') +
  (education.length ? ('## Education\n' + education.map(e => '- ' + e.title + ', ' + e.school + ' · ' + e.period + (e.extra ? ' · ' + e.extra : '') + ((e.chips || []).length ? ' · ' + e.chips.join('; ') : '') + ((e.details || []).length ? ' · ' + e.details.map(d => d.label + ': ' + d.text).join(' ') : '')).join('\n') + '\n\n') : '') +
  (projects.length ? ('## Projects\n' + projects.map(p => '### ' + p.t + '\n' + p.sub + (p.badge ? ' | ' + p.badge : '') + '\n' + (p.problem ? 'Problem: ' + p.problem + '\n' : '') + 'What I built: ' + p.built + '\nResult: ' + p.result + '\nBuilt with: ' + p.stack + '\nMy role: ' + p.role + '\n' +
    ((p.arch || []).length ? 'Architecture: ' + p.arch.join(' -> ') + '\n' : '') + (p.diff ? 'What I would do differently: ' + p.diff + '\n' : '') + [p.live && 'Live demo: ' + p.live, p.src && 'Source: ' + p.src, p.blog && 'Write-up: ' + p.blog].filter(Boolean).join('\n')).join('\n\n') + '\n\n') : '') +
  (repos.length ? '## GitHub repositories\n' + repos.map(r => '- ' + r.n + ' (' + r.l + '): ' + r.d + ' ' + r.u).join('\n') + '\n\n' : '') +
  (skills.length ? ('## Skills\n' + skills.map(s => '- ' + s.n + ' (' + s.s + ')').join('\n') + '\n') : '') +
  extraSections.filter(x => (x.items || []).length).map(x => '\n## ' + x.title + '\n' + x.items.map(it => '- ' + it.title + (it.meta ? ' (' + it.meta + ')' : '') + (it.text ? ': ' + it.text : '') + (it.link && it.link.url ? ' ' + it.link.url : '')).join('\n') + '\n').join('') + '\n';
fs.writeFileSync(out('llms.txt'), md);
fs.writeFileSync(out('robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n');
fs.writeFileSync(out('sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>' + SITE + '/</loc></url>\n  <url><loc>' + SITE + '/llms.txt</loc></url>\n</urlset>\n');
console.log('built: index.html, llms.txt, robots.txt, sitemap.xml');
