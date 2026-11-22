// Shared by every theme: loads and normalises the profile, and produces everything that does not depend on the design
// (share-card meta tags, structured data, the plain-text version for crawlers, llms.txt, robots.txt, sitemap.xml).
const path = require('path');

function load(file) {
  const PROFILE = require(path.resolve(file));
const { site, gradient } = PROFILE;
// Every content list is optional: a missing or empty list removes its section from the page.
const experience = PROFILE.experience || [], education = PROFILE.education || [], beyond = PROFILE.beyond || [], projects = PROFILE.projects || [],
  repos = PROFILE.repos || [], skills = PROFILE.skills || [], extraSections = PROFILE.extraSections || [];
site.contact = site.contact || {}; site.contact.links = site.contact.links || []; site.contact.phones = site.contact.phones || [];
site.about = site.about || {}; site.about.paragraphs = site.about.paragraphs || []; site.about.facts = site.about.facts || [];
site.badges = site.badges || []; site.heroStats = site.heroStats || []; site.recap = site.recap || []; site.resume = site.resume || {};
const LABELS = Object.assign({ situation: 'The situation', did: 'What I did', stack: 'Built with' }, site.labels || {});
  return { PROFILE, site, gradient, PALETTE: PROFILE.PALETTE, experience, education, beyond, projects, repos, skills, extraSections, LABELS };
}

const esc = v => String(v == null ? '' : v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hostPath = u => String(u).replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, '');
const siteUrl = site => String(site.url || '').replace(/\/+$/, '');

// Share-card and SEO tags for <head>. titleSuffix is the design's name, for example "Streaming Portfolio".
function headMeta(d, titleSuffix) {
  const { site } = d, SITE = siteUrl(site);
const shareTitle = site.name + ' | ' + site.role;
const shortDesc = site.description;
const head = [
  '<title>' + esc(site.name) + ' ' + titleSuffix + '</title>',
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
  return head;
}

function jsonLd(d) {
  const { site, education, skills } = d, SITE = siteUrl(site);
  return '<script type="application/ld+json">\n' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Person', name: site.name, url: SITE + '/', jobTitle: site.role, description: site.description,
    alumniOf: education.map(e => ({ '@type': 'CollegeOrUniversity', name: e.school })),
    knowsAbout: skills.map(s => s.n),
    sameAs: site.contact.links.map(l => l.url)
  }) + '\n</script>';
}

function projectHtml(p) {
  const links = [p.live && ['Live demo', p.live], p.src && ['Source code', p.src], p.blog && ['Write-up', p.blog]].filter(Boolean).map(([n, u]) => '<a href="' + esc(u) + '">' + n + '</a>').join(' &middot; ');
  return '<article><h4>' + esc(p.t) + '</h4><p><em>' + esc(p.sub) + (p.badge ? ' &middot; ' + esc(p.badge) : '') + '</em></p>' +
    (p.problem ? '<p><b>Problem:</b> ' + esc(p.problem) + '</p>' : '') + '<p><b>What I built:</b> ' + esc(p.built) + '</p><p><b>Result:</b> ' + esc(p.result) + '</p><p><b>Built with:</b> ' + esc(p.stack) + '</p><p><b>My role:</b> ' + esc(p.role) + '</p>' +
    ((p.arch || []).length ? '<p><b>Architecture:</b> ' + p.arch.map(esc).join(' &rarr; ') + '</p>' : '') + (p.diff ? '<p><b>What I would do differently:</b> ' + esc(p.diff) + '</p>' : '') + (links ? '<p>' + links + '</p>' : '') + '</article>';
}

// GoatCounter analytics is optional and off unless the profile has a code. Returns the tags, or '' when off.
function analyticsTags(d) {
  const { site } = d;
  return site.analytics && site.analytics.goatcounter
  ? '<script src="analytics.js"></script>\n<script data-goatcounter="https://' + esc(site.analytics.goatcounter) + '.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>' : '';
}

// Hidden-but-readable text version of the whole portfolio. titles = the headings the design uses for its sections.
function textVersion(d, titles) {
  const { projects, repos, skills, extraSections } = d;
  return '<details class="textver" id="text-version"><summary>Plain-text version of this portfolio (all sections as plain text)</summary>\n' + (projects.length ? '<h3>' + esc(titles.projects) + '</h3>\n' + projects.map(projectHtml).join('\n') + '\n' : '') +
  (repos.length ? '<h3>GitHub repositories</h3><ul>' + repos.map(r => '<li><a href="' + esc(r.u) + '">' + esc(r.n) + '</a> (' + esc(r.l) + '): ' + esc(r.d) + '</li>').join('') + '</ul>\n' : '') +
  (skills.length ? '<h3>' + esc(titles.skills) + '</h3><ul>' + skills.map(s => '<li>' + esc(s.n) + ' (' + esc(s.s) + ')</li>').join('') + '</ul>\n' : '') +
  extraSections.filter(x => (x.items || []).length).map(x => '<h3>' + esc(x.title) + '</h3><ul>' + x.items.map(it => '<li>' + (it.link && it.link.url ? '<a href="' + esc(it.link.url) + '">' + esc(it.title) + '</a>' : esc(it.title)) + (it.meta ? ' (' + esc(it.meta) + ')' : '') + (it.text ? ': ' + esc(it.text) : '') + '</li>').join('') + '</ul>\n').join('') + '</details>';
}

// llms.txt, robots.txt and sitemap.xml
function seoFiles(d) {
  const { site, experience, education, projects, repos, skills, extraSections } = d, SITE = siteUrl(site), c = site.contact;
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
  return { 'llms.txt': md, 'robots.txt': 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n', 'sitemap.xml': '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>' + SITE + '/</loc></url>\n  <url><loc>' + SITE + '/llms.txt</loc></url>\n</urlset>\n' };
}

// A "Top N" title always matches the real number of items, so a short list is never labelled "Top 10". Fewer than 3 drops the number.
function fixTop(title, n) { return String(title).replace(/^Top\s*\d+\s*/i, n >= 3 ? 'Top ' + n + ' ' : '').replace(/^[a-z]/, ch => ch.toUpperCase()); }

module.exports = { fixTop, load, esc, hostPath, siteUrl, headMeta, jsonLd, projectHtml, analyticsTags, textVersion, seoFiles };
