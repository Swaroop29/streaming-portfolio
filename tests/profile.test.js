// The checker (npm run check) and the build must work for real, different people, not just the sample.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const vm = require('vm');
const { execFileSync, spawnSync } = require('child_process');
const { JSDOM, VirtualConsole } = require('jsdom');
const { read, root } = require('./helpers');

const MINIMAL = 'tests/fixtures/minimal-profile.js';
// Two tests below only make sense while profile.js is still the template's sample. Once a real person fills it in they are skipped.
const IS_SAMPLE = /Alex Rivera/.test(read('profile.js'));
const run = (args) => spawnSync('node', ['check.js', ...args], { cwd: root, encoding: 'utf8' });

test('the checker flags leftover sample data in the shipped profile', { skip: !IS_SAMPLE && 'profile.js is no longer the sample' }, () => {
  const r = run([]);
  assert.strictEqual(r.status, 1, 'the sample profile must not pass the check');
  assert.match(r.stdout, /Sample data is still present/);
});

test('the checker passes a complete, different profile', () => {
  const r = run([MINIMAL]);
  assert.strictEqual(r.status, 0, r.stdout);
  assert.match(r.stdout, /0 error/);
});

test('the checker catches HTML, placeholders and bad values', () => {
  const m = require('./fixtures/minimal-profile.js');
  const bad = JSON.parse(JSON.stringify({ site: m.site, experience: m.experience, education: m.education, beyond: m.beyond, projects: m.projects, repos: m.repos, skills: m.skills }));
  bad.site.tagline = 'Hello &middot; there <b>bold</b>';
  bad.projects[0].result = 'TODO add result';
  bad.projects[1].color = 'chartreuse';
  bad.site.contact.email = 'not-an-email';
  bad.skills = bad.skills.slice(0, 3);
  const f = os.tmpdir() + '/bad-profile-' + process.pid + '.js';
  fs.writeFileSync(f, 'const base = require(' + JSON.stringify(root + '/profile.js') + '); module.exports = Object.assign({ PALETTE: base.PALETTE, gradient: base.gradient }, ' + JSON.stringify(bad) + ');');
  const r = run([f]);
  assert.strictEqual(r.status, 1);
  for (const needle of ['contains HTML', 'placeholder', 'chartreuse', 'email', 'Only 3 skills']) assert.ok(r.stdout.includes(needle), 'checker did not report: ' + needle + '\n' + r.stdout);
});

test('a minimal profile builds a working page with the optional sections removed', () => {
  const tmp = fs.mkdtempSync(os.tmpdir() + '/min-');
  execFileSync('node', ['build.js'], { cwd: root, stdio: 'ignore', env: { ...process.env, PORTFOLIO_PROFILE: MINIMAL, PORTFOLIO_OUT: tmp } });
  const html = fs.readFileSync(tmp + '/index.html', 'utf8');
  assert.ok(html.includes('Sam Okafor') && !html.includes('Alex Rivera'));
  assert.ok(!html.includes('id="beyond"'), 'empty "beyond" section should be removed');
  assert.ok(!html.includes('id="github"'), 'empty GitHub row should be removed');
  assert.ok(!html.includes('class="mail phones"'), 'no phone row without phones');
  assert.ok(!html.includes('analytics.js'), 'analytics is off by default');
  assert.ok(!/Download PDF|>Resume</.test(html), 'resume buttons hidden without links');

  // run the real page script against it with the minimal profile
  const errors = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', (e) => errors.push(e.message));
  const dom = new JSDOM(html.replace(/<script[^>]*src=[^>]*><\/script>/g, ''), { runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc, url: 'http://localhost/' });
  const w = dom.window;
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  w.HTMLMediaElement.prototype.play = () => Promise.resolve(); w.HTMLMediaElement.prototype.pause = () => {};
  const noop = new Proxy(function () {}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 0 }) : noop), set: () => true, apply: () => noop });
  w.HTMLCanvasElement.prototype.getContext = () => noop;
  const m = require('./fixtures/minimal-profile.js');
  const ctx = dom.getInternalVMContext();
  new vm.Script(['site', 'projects', 'skills', 'repos', 'beyond', 'education', 'experience'].map((k) => 'const ' + k + ' = ' + JSON.stringify(m[k]) + ';').join('\n')).runInContext(ctx);
  new vm.Script(read('script.js')).runInContext(ctx);
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(w.document.getElementById('t-projects').children.length, m.projects.length);
  assert.strictEqual(w.document.getElementById('t-skills').children.length, m.skills.length);
});

test('no personal data from the original author is left anywhere in the repo', { skip: !IS_SAMPLE && 'profile.js is no longer the sample' }, () => {
  const skip = new Set(['node_modules', '.git', 'test-results', 'playwright-report', 'package-lock.json', 'jingle.mp3']);
  const hits = [];
  (function walk(dir) {
    for (const n of fs.readdirSync(dir)) {
      if (skip.has(n)) continue;
      const p = dir + '/' + n;
      if (fs.statSync(p).isDirectory()) { walk(p); continue; }
      if (/\.(png|webp|mp3|jpg|ico)$/.test(n)) continue;
      const t = fs.readFileSync(p, 'utf8');
      if (/swaroop|patil/i.test(t) && !/tests\/profile\.test\.js$/.test(p)) hits.push(p);
    }
  })(root);
  assert.deepStrictEqual(hits, []);
});

const TEACHER = 'tests/fixtures/teacher-profile.js';

test('a non-engineering profile passes the checker', () => {
  const r = run([TEACHER]);
  assert.strictEqual(r.status, 0, r.stdout);
});

test('sections with no content are removed everywhere, and custom sections appear in order', () => {
  const tmp = fs.mkdtempSync(os.tmpdir() + '/teacher-');
  execFileSync('node', ['build.js'], { cwd: root, stdio: 'ignore', env: { ...process.env, PORTFOLIO_PROFILE: TEACHER, PORTFOLIO_OUT: tmp } });
  const html = fs.readFileSync(tmp + '/index.html', 'utf8');
  for (const id of ['projects', 'github', 'skills', 'beyond']) {
    assert.ok(!html.includes('id="' + id + '"'), id + ' section should be removed when empty');
    assert.ok(!html.includes('href="#' + id + '"'), 'menu link to the empty ' + id + ' section should be removed');
  }
  assert.ok(!html.includes('class="stats"'), 'no hero stats box when there are no stats');
  assert.ok(!html.includes('class="recap"'), 'no recap box when there are no numbers');
  assert.ok(html.includes('ep-layout solo'), 'experience uses the full width without the recap box');
  assert.ok(html.includes('Teaching history'), 'section was renamed');
  assert.ok(html.includes('Head Teacher') && html.includes('Visitor'), 'profile picker was renamed');
  const order = ['episodes', 'courses', 'publications', 'about'].map((id) => html.indexOf('<section class="row" id="' + id + '"'));
  assert.ok(order.every((n) => n > 0) && [...order].sort((a, b) => a - b).join() === order.join(), 'sections are in the chosen order: ' + order);
  assert.ok(html.includes('Courses I teach') && html.includes('GCSE Mathematics') && html.includes('href="https://example.org/statistics"'));
  assert.ok(html.includes('href="#courses"'), 'custom sections get a menu link');
  assert.ok(!/Watch my work/.test(html) && html.includes('Explore my profile'), 'hero button adapts when there are no projects');
  assert.ok(!html.includes('<b>Built with</b>') && !html.includes('<b>Resources used</b>') && !html.includes('<b>The situation</b>'), 'empty fields do not leave empty labels');
  const llms = fs.readFileSync(tmp + '/llms.txt', 'utf8');
  assert.ok(llms.includes('## Courses I teach') && llms.includes('GCSE Mathematics'), 'custom sections are in llms.txt');
  assert.ok(!llms.includes('## Projects') && !llms.includes('## Skills'), 'empty sections are not listed in llms.txt');
  assert.ok(html.includes('GCSE Mathematics'), 'custom sections are in the static HTML so crawlers can read them');
});

test('the page script runs cleanly when there are no projects, skills or repos', () => {
  const tmp = fs.mkdtempSync(os.tmpdir() + '/teacher-js-');
  execFileSync('node', ['build.js'], { cwd: root, stdio: 'ignore', env: { ...process.env, PORTFOLIO_PROFILE: TEACHER, PORTFOLIO_OUT: tmp } });
  const html = fs.readFileSync(tmp + '/index.html', 'utf8');
  const errors = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', (e) => errors.push(e.message));
  const dom = new JSDOM(html.replace(/<script[^>]*src=[^>]*><\/script>/g, ''), { runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc, url: 'http://localhost/' });
  const w = dom.window;
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  w.HTMLMediaElement.prototype.play = () => Promise.resolve(); w.HTMLMediaElement.prototype.pause = () => {};
  const noop = new Proxy(function () {}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 0 }) : noop), set: () => true, apply: () => noop });
  w.HTMLCanvasElement.prototype.getContext = () => noop;
  const m = require('./fixtures/teacher-profile.js');
  const ctx = dom.getInternalVMContext();
  new vm.Script(['site', 'projects', 'skills', 'repos', 'beyond', 'education', 'experience'].map((k) => 'const ' + k + ' = ' + JSON.stringify(m[k]) + ';').join('\n')).runInContext(ctx);
  new vm.Script(read('script.js')).runInContext(ctx);
  assert.deepStrictEqual(errors, []);
  assert.ok(w.document.querySelectorAll('#wall .tile').length > 0, 'the opening wall is still built from the experience and name');
});

test('the checker validates custom sections', () => {
  const m = require('./fixtures/teacher-profile.js');
  const bad = JSON.parse(JSON.stringify(m));
  bad.extraSections = [{ id: 'projects', title: 'Clash', items: [{ title: 'x' }] }, { id: 'empty-one', title: 'Empty', items: [] }, { id: 'ok', title: 'Fine', items: [{ title: 'y', link: { url: 'http://insecure.example' } }] }];
  bad.site.sectionOrder = ['nonsense'];
  const f = os.tmpdir() + '/bad-sections-' + process.pid + '.js';
  fs.writeFileSync(f, 'const base = require(' + JSON.stringify(root + '/profile.js') + '); module.exports = Object.assign({ PALETTE: base.PALETTE, gradient: base.gradient }, ' + JSON.stringify(bad) + ');');
  const r = run([f]);
  assert.strictEqual(r.status, 1);
  for (const needle of ['already used by the page', 'no items', 'https link', 'not a section']) assert.ok(r.stdout.includes(needle), 'checker did not report: ' + needle + '\n' + r.stdout);
});

test('npm run package collects every file the page needs into one folder', () => {
  const out = fs.mkdtempSync(os.tmpdir() + '/pub-') + '/publish';
  execFileSync('node', ['package.js'], { cwd: root, stdio: 'ignore', env: { ...process.env, PORTFOLIO_PUBLISH: out } });
  for (const f of ['index.html', 'style.css', 'print.css', 'script.js', 'profile.js', 'llms.txt', 'robots.txt', 'sitemap.xml', 'assets/jingle.mp3', 'assets/avatar-guest.webp']) {
    assert.ok(fs.existsSync(out + '/' + f), f + ' is missing from the publish folder');
  }
  assert.ok(!fs.existsSync(out + '/build.js') && !fs.existsSync(out + '/node_modules'), 'build tools are not published');
});
