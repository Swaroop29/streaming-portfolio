// Everything on the page must also be readable without JavaScript, and the generated files must be current.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const { read, loadData } = require('./helpers');

const d = loadData();
const html = read('index.html');
const doc = new JSDOM(html).window.document;

test('the plain-text version lists every project, repo and skill', () => {
  const text = doc.getElementById('text-version').textContent;
  assert.ok(text, 'text version section exists');
  for (const p of d.projects) for (const k of ['t', 'built', 'stack']) assert.ok(text.includes(p[k]), `project ${k}: ${p.t}`);
  for (const r of d.repos) assert.ok(text.includes(r.n), 'repo: ' + r.n);
  for (const s of d.skills) assert.ok(text.includes(s.n), 'skill: ' + s.n);
});

test('experience, education and contact are in the static HTML, not built by script', () => {
  const body = doc.body.textContent;
  for (const c of d.experience) { assert.ok(body.includes(c.company), c.company); for (const e of c.episodes) assert.ok(body.includes(e.title), e.title); }
  for (const e of d.education) assert.ok(body.includes(e.school), e.school);
  assert.ok(body.includes(d.site.contact.email));
});

test('llms.txt covers the whole profile', () => {
  const md = read('llms.txt');
  for (const p of d.projects) assert.ok(md.includes('### ' + p.t), 'project: ' + p.t);
  for (const r of d.repos) assert.ok(md.includes(r.n), 'repo: ' + r.n);
  for (const s of d.skills) assert.ok(md.includes(s.n), 'skill: ' + s.n);
  for (const c of d.experience) assert.ok(md.includes(c.company), 'company: ' + c.company);
  assert.ok(md.includes(d.site.contact.email));
});

test('generated files are up to date (run: npm run build)', () => {
  const files = ['index.html', 'llms.txt', 'robots.txt', 'sitemap.xml'];
  const before = Object.fromEntries(files.map((f) => [f, read(f)]));
  const tmp = fs.mkdtempSync(require('os').tmpdir() + '/build-');
  require('child_process').execFileSync('node', ['build.js'], { stdio: 'ignore', env: { ...process.env, PORTFOLIO_OUT: tmp } });
  for (const f of files) assert.strictEqual(fs.readFileSync(tmp + '/' + f, 'utf8'), before[f], f + ' is stale. Run: npm run build');
});

test('robots.txt allows everyone and points to the sitemap; sitemap lists the site', () => {
  const robots = read('robots.txt');
  const url = d.site.url.replace(/\/+$/, '');
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.doesNotMatch(robots, /Disallow:\s*\//);
  assert.ok(robots.includes('Sitemap: ' + url + '/sitemap.xml'));
  assert.ok(read('sitemap.xml').includes('<loc>' + url + '/</loc>'));
});

test('structured data describes the person and parses as JSON', () => {
  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  assert.strictEqual(ld['@type'], 'Person');
  assert.strictEqual(ld.name, d.site.name);
  assert.ok(ld.sameAs.length >= 1);
});
