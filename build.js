// Renders index.html (from index.template.html + profile.js), plus llms.txt, robots.txt and sitemap.xml.
// Run with:  npm run build
const fs = require('fs');
const path = require('path');
// PORTFOLIO_PROFILE and PORTFOLIO_OUT let the tests build a different profile into a temporary folder.
const OUT = process.env.PORTFOLIO_OUT || '.';
const out = f => path.join(OUT, f);
const { site, experience, education, beyond, projects, repos, skills, gradient } = require(path.resolve(process.env.PORTFOLIO_PROFILE || './profile.js'));
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
const heroStats = '<div class="stats">\n' + site.heroStats.map(s => '      <div><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></div>').join('\n') + '\n    </div>';
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
    '        <div class="ep-more"><div class="ep-more-in"><div><b>The situation</b><p>' + esc(e.situation) + '</p></div><div><b>What I did</b><ul>' +
    (e.did || []).map(d => '<li>' + esc(d) + '</li>').join('') + '</ul></div><div><b>Built with</b><p>' + esc(e.stack) + '</p></div></div></div>\n' +
    '      </div>').join('\n');
  return '      <div class="ep-head"' + (ci ? ' style="margin-top:22px"' : '') + '><h3>' + esc(co.company) + '</h3><span>' + esc([co.role, co.period, co.place].filter(Boolean).join(' · ')) + '</span></div>\n' + eps;
}).join('\n');

const recapHtml = site.recap.map(r => '      <div class="stat"><b>' + esc(r.value) + '</b><span>' + esc(r.label) + '</span></div>').join('\n') +
  (site.status ? '\n      <div class="now"><i></i>' + esc(site.status) + '</div>' : '');

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
const aboutHtml = '      <div>\n        <div class="eyebrow">' + esc(site.about.eyebrow) + '</div>\n        <h3>' + esc(site.about.heading) + '</h3>\n' +
  site.about.paragraphs.map(p => '        <p>' + esc(p) + '</p>').join('\n') + '\n      </div>\n      <dl>\n' +
  site.about.facts.map(f => '        <dt>' + esc(f.label) + '</dt><dd>' + (f.url ? '<a href="' + esc(f.url) + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">' + esc(f.value) + '</a>' : esc(f.value)) + '</dd>').join('\n') + '\n      </dl>\n' +
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
const textVersion = '<details class="textver" id="text-version"><summary>Plain-text version of this portfolio (projects, repositories, skills)</summary>\n<h3>Projects</h3>\n' + projects.map(projectHtml).join('\n') + '\n' +
  (repos.length ? '<h3>GitHub repositories</h3><ul>' + repos.map(r => '<li><a href="' + esc(r.u) + '">' + esc(r.n) + '</a> (' + esc(r.l) + '): ' + esc(r.d) + '</li>').join('') + '</ul>\n' : '') +
  '<h3>Skills</h3><ul>' + skills.map(s => '<li>' + esc(s.n) + ' (' + esc(s.s) + ')</li>').join('') + '</ul>\n</details>';

// ---------- analytics and print ----------
const analytics = site.analytics && site.analytics.goatcounter
  ? '<script src="analytics.js"></script>\n<script data-goatcounter="https://' + esc(site.analytics.goatcounter) + '.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>' : '';
const printContact = [c.email].concat(c.phones.map(p => p.label + ' ' + p.number), c.links.map(l => hostPath(l.url))).join('  \\00B7  ');
const initials = (site.firstName.charAt(0) + site.lastName.charAt(0)).toUpperCase().replace(/["\\]/g, '');
const rootStyle = '<style>:root{--initials:"' + initials + '"}</style>';
const printStyle = '<style media="print">:root{--print-contact:"' + printContact.replace(/"/g, '') + '";--print-footer:"Full project write-ups and live demos: ' + hostPath(SITE).replace(/"/g, '') + '"}</style>';

// ---------- assemble ----------
let html = fs.readFileSync('index.template.html', 'utf8');
const marks = {
  HEAD: head, FAVICON: favicon, JSONLD: jsonld + '\n' + rootStyle + '\n' + printStyle, EXPERIENCE: experienceHtml, RECAP: recapHtml, BEYOND: beyondHtml, ABOUT: aboutHtml,
  CONTACT: contactHtml, FOOTER: footerHtml, TEXTVERSION: textVersion, HERO_META: heroMeta, HERO_STATS: heroStats, RESUME_NAV: resumeNav, RESUME_HERO: resumeHero, ANALYTICS: analytics
};
for (const [k, v] of Object.entries(marks)) html = html.replace('<!--@' + k + '-->', () => v);
const vars = { BRAND: esc(brand), INTRO_NAME: introName, HERO_NAME: '<span>' + esc(site.firstName) + '</span><br><span>' + esc(site.lastName) + '</span>', TAGLINE: esc(site.tagline), PROJECT_COUNT: String(projects.length), GITHUB_USER: esc(site.githubUser) };
for (const [k, v] of Object.entries(vars)) html = html.split('{{' + k + '}}').join(v);
if (!beyond.length) html = html.replace(/\n  <section class="row" id="beyond">[\s\S]*?<\/section>\n/, '\n');
if (!repos.length) html = html.replace(/\n  <section class="row" id="github">[\s\S]*?<\/section>\n/, '\n');
const leftover = html.match(/<!--@[A-Z_]+-->|\{\{[A-Z_]+\}\}/g);
if (leftover) throw new Error('Unreplaced template markers: ' + leftover.join(', '));
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(out('index.html'), html);

// ---------- llms.txt, robots.txt, sitemap.xml ----------
const md = '# ' + site.name + '\n\n> ' + site.role + '. Portfolio: ' + SITE + '\n\nThis file holds the full content of the portfolio so that people and AI agents can read all of it without running JavaScript.\n\n' +
  '## Contact\n- Email: ' + c.email + '\n' + c.phones.map(p => '- ' + p.label + ' phone: ' + p.number + '\n').join('') + c.links.map(l => '- ' + l.label + ': ' + l.url).join('\n') + '\n\n' +
  '## About\n' + site.about.paragraphs.join('\n\n') + '\n\n' + site.about.facts.map(f => '- ' + f.label + ': ' + f.value).join('\n') + '\n\n' +
  '## Experience\n' + experience.map(co => '### ' + co.company + ' · ' + [co.role, co.period, co.place].filter(Boolean).join(' · ') + '\n' + co.episodes.map(e => '- ' + e.title + ': ' + e.blurb + ' Situation: ' + e.situation + ' What I did: ' + (e.did || []).join(' ') + ' Built with: ' + e.stack).join('\n')).join('\n\n') + '\n\n' +
  '## Education\n' + education.map(e => '- ' + e.title + ', ' + e.school + ' · ' + e.period + (e.extra ? ' · ' + e.extra : '') + ((e.chips || []).length ? ' · ' + e.chips.join('; ') : '') + ((e.details || []).length ? ' · ' + e.details.map(d => d.label + ': ' + d.text).join(' ') : '')).join('\n') + '\n\n' +
  '## Projects\n' + projects.map(p => '### ' + p.t + '\n' + p.sub + (p.badge ? ' | ' + p.badge : '') + '\n' + (p.problem ? 'Problem: ' + p.problem + '\n' : '') + 'What I built: ' + p.built + '\nResult: ' + p.result + '\nBuilt with: ' + p.stack + '\nMy role: ' + p.role + '\n' +
    ((p.arch || []).length ? 'Architecture: ' + p.arch.join(' -> ') + '\n' : '') + (p.diff ? 'What I would do differently: ' + p.diff + '\n' : '') + [p.live && 'Live demo: ' + p.live, p.src && 'Source: ' + p.src, p.blog && 'Write-up: ' + p.blog].filter(Boolean).join('\n')).join('\n\n') + '\n\n' +
  (repos.length ? '## GitHub repositories\n' + repos.map(r => '- ' + r.n + ' (' + r.l + '): ' + r.d + ' ' + r.u).join('\n') + '\n\n' : '') +
  '## Skills\n' + skills.map(s => '- ' + s.n + ' (' + s.s + ')').join('\n') + '\n';
fs.writeFileSync(out('llms.txt'), md);
fs.writeFileSync(out('robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n');
fs.writeFileSync(out('sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>' + SITE + '/</loc></url>\n  <url><loc>' + SITE + '/llms.txt</loc></url>\n</urlset>\n');
console.log('built: index.html, llms.txt, robots.txt, sitemap.xml');
