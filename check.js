// Checks profile.js and tells you (or your AI) exactly what is missing or wrong.
//   npm run check                 checks ./profile.js
//   node check.js path/to/file.js checks another profile
//   node check.js --links         also requests every link to see that it opens (needs internet)
// Exit code 1 means there are errors that must be fixed before publishing. Warnings are advice.
const path = require('path');
const args = process.argv.slice(2);
const online = args.includes('--links');
const file = args.find(a => !a.startsWith('--')) || './profile.js';
const P = require(path.resolve(file));
const { site, PALETTE } = P;
// Every list is optional. A section with no items is simply not shown on the site.
const experience = P.experience || [], education = P.education || [], beyond = P.beyond || [], projects = P.projects || [],
  repos = P.repos || [], skills = P.skills || [], extraSections = P.extraSections || [];

const errors = [], warnings = [];
const err = m => errors.push(m), warn = m => warnings.push(m);
const str = v => typeof v === 'string' && v.trim().length > 0;
const isUrl = u => { try { return new URL(u).protocol === 'https:'; } catch { return false; } };
const need = (obj, keys, where) => keys.forEach(k => { if (!str(obj && obj[k])) err(where + ' is missing "' + k + '"'); });

// 1. Sample data must be gone
const SAMPLE = ['Alex Rivera', 'Northwind', 'Example University', 'Example Studio', 'example.com', 'alex-rivera', 'github.com/example', 'linkedin.com/in/example'];
const everything = JSON.stringify({ site, experience, education, beyond, projects, repos, skills, extraSections });
for (const s of SAMPLE) if (everything.includes(s)) err('Sample data is still present: "' + s + '". Replace it with the real person\'s details.');

// 2. Plain text only, no placeholders
(function walk(v, p) {
  if (typeof v === 'string') {
    if (/&[a-z#0-9]+;|<[a-z/][^>]*>/i.test(v)) err(p + ' contains HTML or an entity. Use plain text ("·" instead of &middot;).');
    if (/\bTODO\b|lorem ipsum|\bXXX\b|\[.*here\]/i.test(v)) err(p + ' still has a placeholder: "' + v.slice(0, 40) + '"');
    if (/—/.test(v)) warn(p + ' contains an em dash. Prefer commas, colons or full stops.');
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, p + '[' + i + ']'));
  else if (v && typeof v === 'object') for (const k of Object.keys(v)) if (k !== 'g') walk(v[k], p ? p + '.' + k : k);
})({ site, experience, education, beyond, projects, repos, skills, extraSections }, '');

// 3. Site basics
need(site, ['url', 'name', 'firstName', 'lastName', 'role', 'description', 'tagline'], 'site');
if (str(site.url) && !isUrl(site.url)) err('site.url must be a full https address, for example https://yourname.pages.dev');
if (str(site.description) && (site.description.length < 60 || site.description.length > 200)) warn('site.description is ' + site.description.length + ' characters. 80 to 160 works best for share cards.');
if (str(site.tagline) && site.tagline.length > 200) warn('site.tagline is long (' + site.tagline.length + '). Keep it to two lines.');
if (site.badges && (!Array.isArray(site.badges) || site.badges.length > 4)) err('site.badges can hold up to 4 short tags.');
if (site.heroStats && (!Array.isArray(site.heroStats) || site.heroStats.length > 3)) err('site.heroStats can hold up to 3 items ({ value, label }). Use [] to hide them.');
else (site.heroStats || []).forEach((s, i) => need(s, ['value', 'label'], 'site.heroStats[' + i + ']'));
for (const k of ['recruiter', 'manager', 'engineer', 'guest']) if (!str(site.profileTaglines && site.profileTaglines[k])) err('site.profileTaglines.' + k + ' is missing.');
if (site.recap && (!Array.isArray(site.recap) || site.recap.length > 5)) err('site.recap can hold up to 5 numbers, each backed by the person\'s data. Use [] to hide the box.');
else (site.recap || []).forEach((s, i) => need(s, ['value', 'label'], 'site.recap[' + i + ']'));
if (site.ticker && site.ticker.length && site.ticker.length < 6) warn('site.ticker has fewer than 6 [name, category] pairs. Use 6 or more, or leave it empty to build it automatically.');
if (site.resume && (site.resume.view || site.resume.download)) for (const k of ['view', 'download']) if (site.resume[k] && !isUrl(site.resume[k])) err('site.resume.' + k + ' must be an https link.');
if (!site.resume || (!site.resume.view && !site.resume.download)) warn('No resume link set. The Resume and Download buttons are hidden.');

// Theme must exist
if (site.theme) {
  const fsx = require('fs'), tdir = path.join(__dirname, 'themes');
  const known = fsx.readdirSync(tdir).filter(n => fsx.existsSync(path.join(tdir, n, 'theme.js')));
  if (!known.includes(site.theme)) err('site.theme "' + site.theme + '" does not exist. Available themes: ' + known.join(', '));
}

// 4. About and contact
if (!site.about || !((site.about.paragraphs || []).length || (site.about.facts || []).length || education.length)) warn('The About section is empty, so it is hidden. Add site.about.paragraphs if you have a short bio.');
if (site.about && (site.about.paragraphs || []).length) need(site.about, ['heading'], 'site.about');
(site.about && site.about.facts || []).forEach((f, i) => need(f, ['label', 'value'], 'site.about.facts[' + i + ']'));
need(site.contact, ['heading', 'text', 'email'], 'site.contact');
if (str(site.contact && site.contact.email) && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(site.contact.email)) err('site.contact.email does not look like an email address.');
if (site.contact && site.contact.phones && site.contact.phones.length) warn('Phone numbers will be public on the site. Keep them only if the person asked for that.');
(site.contact && site.contact.links || []).forEach((l, i) => { need(l, ['label', 'url'], 'site.contact.links[' + i + ']'); if (l.url && !isUrl(l.url)) err('site.contact.links[' + i + '].url must be https.'); });
if (!(site.contact && site.contact.links || []).some(l => /linkedin\.com/.test(l.url || ''))) warn('No LinkedIn link in site.contact.links.');
if (repos.length && !str(site.githubUser)) warn('site.githubUser is empty. Set it so the GitHub row has a label.');

// 5. Experience
const PERIOD = /^[A-Z][a-z]{2} \d{4} to ([A-Z][a-z]{2} \d{4}|Present)$/;
(experience || []).forEach((c, i) => {
  const w = 'experience[' + i + ']';
  need(c, ['company', 'role', 'period'], w);
  if (str(c.period) && !PERIOD.test(c.period)) warn(w + '.period "' + c.period + '" should look like "Jun 2023 to Aug 2025" or "Jun 2023 to Present".');
  if (!Array.isArray(c.episodes) || c.episodes.length < 1) err(w + ' needs at least one episode (achievement). Remove the company if there is nothing to say.');
  (c.episodes || []).forEach((e, j) => {
    need(e, ['label', 'color', 'title', 'blurb', 'tag'], w + '.episodes[' + j + ']');
    if (e.color && !PALETTE[e.color]) err(w + '.episodes[' + j + '].color "' + e.color + '" must be one of: ' + Object.keys(PALETTE).join(', '));
    if (str(e.label) && e.label.length > 8) warn(w + '.episodes[' + j + '].label "' + e.label + '" is long. One short word in capitals looks best.');
  });
});

// 6. Education and beyond (both optional)
(education || []).forEach((e, i) => need(e, ['level', 'title', 'school', 'period'], 'education[' + i + ']'));
const ICONS = Object.keys(require('./icons.json')).concat(['book', 'music', 'camera', 'star']);
(beyond || []).forEach((b, i) => {
  need(b, ['icon', 'color', 'category', 'title', 'blurb', 'backTitle', 'backText'], 'beyond[' + i + ']');
  if (b.icon && !ICONS.includes(b.icon)) err('beyond[' + i + '].icon "' + b.icon + '" must be one of: ' + ICONS.join(', '));
  if (b.color && !PALETTE[b.color]) err('beyond[' + i + '].color "' + b.color + '" is not a known colour.');
  if (b.link) { need(b.link, ['label', 'url'], 'beyond[' + i + '].link'); if (b.link.url && !isUrl(b.link.url)) err('beyond[' + i + '].link.url must be https.'); }
});

// 7. Projects, repos, skills
if (projects.length && projects.length < 3) warn('Only ' + projects.length + ' project(s). 3 to 7 looks best.');
else if (projects.length > 7) warn(projects.length + ' projects is a lot. 3 to 7 looks best.');
const titles = new Set();
(projects || []).forEach((p, i) => {
  const w = 'projects[' + i + ']';
  need(p, ['t', 'color', 'sub', 'built', 'blurb'], w);
  if (p.color && !PALETTE[p.color]) err(w + '.color "' + p.color + '" must be one of: ' + Object.keys(PALETTE).join(', '));
  if (titles.has(p.t)) err(w + ' has a duplicate title "' + p.t + '".'); titles.add(p.t);
  for (const k of ['live', 'src', 'blog']) if (p[k] && !isUrl(p[k])) err(w + '.' + k + ' must be an https link or "".');
  if (str(p.blurb) && p.blurb.length > 120) warn(w + '.blurb is long (' + p.blurb.length + '). One short line shows best on the card.');
});
(repos || []).forEach((r, i) => {
  need(r, ['n', 'd', 'l', 'c', 'u'], 'repos[' + i + ']');
  if (typeof r.s !== 'number') err('repos[' + i + '].s (stars) must be a number.');
  if (r.u && !/^https:\/\/github\.com\//.test(r.u)) err('repos[' + i + '].u must be a github.com link.');
});
if ((experience || []).length && !(site.heroStats || []).length) warn('They have work experience but heroStats is empty. Make the first stat how long they have worked (AGENTS.md).');
if (skills.length && skills.length < 4) warn('Only ' + skills.length + ' skills. A row of 4 to 10 looks best, or leave it empty to hide it. Never pad it to reach a number.');
if (skills.length > 15) warn('skills has ' + skills.length + ' items. Keep the strongest 10 to 15; a long row is hard to scan.');
(skills || []).forEach((s, i) => { need(s, ['n', 's', 'color'], 'skills[' + i + ']'); if (s.color && !PALETTE[s.color]) err('skills[' + i + '].color "' + s.color + '" is not a known colour.'); });

// 7b. Custom sections, order and titles
const CORE = ['projects', 'github', 'episodes', 'skills', 'beyond', 'about'];
const extraIds = new Set();
extraSections.forEach((x, i) => {
  const w = 'extraSections[' + i + ']';
  need(x, ['id', 'title'], w);
  if (str(x.id) && !/^[a-z][a-z0-9-]{1,30}$/.test(x.id)) err(w + '.id "' + x.id + '" must be lowercase letters, numbers and dashes, for example "publications".');
  if (CORE.includes(x.id) || ['home', 'contact', 'top', 'picker', 'intro', 'modal', 'tabbar', 'edu'].includes(x.id)) err(w + '.id "' + x.id + '" is already used by the page. Pick another id.');
  if (extraIds.has(x.id)) err(w + '.id "' + x.id + '" is used twice.'); extraIds.add(x.id);
  if (!Array.isArray(x.items) || !x.items.length) err(w + ' has no items. Remove the section instead of leaving it empty.');
  (x.items || []).forEach((it, j) => {
    need(it, ['title'], w + '.items[' + j + ']');
    if (it.color && !PALETTE[it.color]) err(w + '.items[' + j + '].color "' + it.color + '" is not a known colour.');
    if (it.link && (!isUrl(it.link.url))) err(w + '.items[' + j + '].link.url must be an https link.');
  });
  if ((x.items || []).length > 12) warn(w + ' has ' + x.items.length + ' items. 12 or fewer scans best.');
});
const ALL_IDS = CORE.concat([...extraIds]);
(site.sectionOrder || []).forEach(id => { if (!ALL_IDS.includes(id)) err('site.sectionOrder lists "' + id + '", which is not a section. Use: ' + ALL_IDS.join(', ')); });
Object.keys(site.sections || {}).forEach(id => { if (!ALL_IDS.includes(id)) err('site.sections has "' + id + '", which is not a section. Use: ' + ALL_IDS.join(', ')); });
if (!projects.length && !experience.length && !extraSections.length && !((site.about || {}).paragraphs || []).length) err('There is nothing to show yet. Add at least one of: projects, experience, extraSections or site.about.paragraphs.');

// 8. Optional: do the links open?
async function links() {
  const urls = new Set();
  const grab = v => { if (typeof v === 'string' && /^https:\/\//.test(v)) urls.add(v); else if (Array.isArray(v)) v.forEach(grab); else if (v && typeof v === 'object') Object.values(v).forEach(grab); };
  grab({ site, projects, repos, beyond, extraSections });
  urls.delete(site.url);
  for (const u of urls) {
    try {
      const r = await fetch(u, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 portfolio-check' } });
      if (r.status >= 400 && r.status !== 403 && r.status !== 999) err('Link does not open (' + r.status + '): ' + u);
    } catch (e) { warn('Could not check link (' + (e.cause && e.cause.code || e.message) + '): ' + u); }
  }
}

(async () => {
  if (online) await links();
  for (const w of warnings) console.log('warning: ' + w);
  for (const e of errors) console.log('ERROR:   ' + e);
  console.log('\n' + errors.length + ' error(s), ' + warnings.length + ' warning(s)' + (online ? '' : '. Add --links to also test that every link opens.'));
  if (!errors.length) console.log('Profile looks complete.\nBefore you hand over, run the "Final checklist" in AGENTS.md (sources opened, conflicts listed, nothing invented).');
  process.exit(errors.length ? 1 : 0);
})();
