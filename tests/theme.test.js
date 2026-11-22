// The theme contract: every folder in themes/ must work for any kind of person, not just the sample.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const { root } = require('./helpers');

const themesDir = path.join(root, 'themes');
const themes = fs.readdirSync(themesDir).filter((n) => fs.existsSync(path.join(themesDir, n, 'theme.js')));
const PROFILES = { sample: 'profile.js', minimal: 'tests/fixtures/minimal-profile.js', teacher: 'tests/fixtures/teacher-profile.js' };
const build = (theme, profile, out, extra = {}) => execFileSync('node', ['build.js'], { cwd: root, stdio: 'pipe', env: { ...process.env, PORTFOLIO_THEME: theme, PORTFOLIO_PROFILE: profile, PORTFOLIO_OUT: out, ...extra } });

test('there is at least one theme and the default one exists', () => {
  assert.ok(themes.includes('netflix'));
});

for (const id of themes) {
  test(`theme "${id}" describes itself and lists files that exist`, () => {
    const meta = JSON.parse(fs.readFileSync(path.join(themesDir, id, 'theme.json'), 'utf8'));
    assert.strictEqual(meta.id, id);
    assert.ok(typeof meta.name === 'string' && meta.name.length >= 3, 'theme.json needs a name');
    assert.ok(typeof meta.description === 'string' && meta.description.length > 30, 'theme.json needs a description of at least a sentence');
    for (const k of ['mood', 'bestFor']) assert.ok(Array.isArray(meta[k]) && meta[k].length, 'theme.json needs a non-empty ' + k + ' list');
    const t = require(path.join(themesDir, id, 'theme.js'));
    assert.strictEqual(t.id, id);
    assert.strictEqual(typeof t.render, 'function');
    for (const f of t.files) assert.ok(fs.existsSync(path.join(themesDir, id, f)), f + ' is listed but missing');
    assert.deepStrictEqual([...meta.files].sort(), [...t.files].sort(), 'theme.json files must match theme.js files');
  });

  for (const [label, profile] of Object.entries(PROFILES)) {
    test(`theme "${id}" builds a complete, crawlable page for the ${label} profile`, () => {
      const out = fs.mkdtempSync(os.tmpdir() + '/theme-');
      build(id, profile, out);
      const html = fs.readFileSync(out + '/index.html', 'utf8');
      const data = require(path.join(root, profile));
      assert.ok(html.includes(data.site.name), 'the person\'s name must appear');
      assert.ok(!/<!--@|\{\{[A-Z_]+\}\}/.test(html), 'no template markers may be left over');
      assert.ok(html.includes('id="text-version"'), 'the plain-text version for crawlers is required');
      assert.ok(html.includes('application/ld+json'), 'structured data is required');
      assert.ok(html.includes('og:title'), 'share-card tags are required');
      assert.ok(html.includes(data.site.contact.email), 'the contact email must be readable without JavaScript');
      for (const e of (data.experience || [])) assert.ok(html.includes(e.company), e.company + ' must be in the static HTML');
      for (const x of (data.extraSections || [])) for (const it of x.items) assert.ok(html.includes(it.title), 'custom section item "' + it.title + '" must be in the static HTML');
      for (const f of ['llms.txt', 'robots.txt', 'sitemap.xml']) assert.ok(fs.existsSync(out + '/' + f), f + ' is missing');
      for (const f of require(path.join(themesDir, id, 'theme.js')).files) assert.ok(fs.existsSync(out + '/' + f), f + ' was not copied next to index.html');
    });
  }
}

test('an unknown theme gives a clear message listing the available ones', () => {
  const r = spawnSync('node', ['build.js'], { cwd: root, encoding: 'utf8', env: { ...process.env, PORTFOLIO_THEME: 'does-not-exist', PORTFOLIO_OUT: fs.mkdtempSync(os.tmpdir() + '/x-') } });
  assert.notStrictEqual(r.status, 0);
  assert.match(r.stderr, /Unknown theme "does-not-exist"\. Available themes: .*netflix/);
});

test('npm run single makes one self-contained page that needs no other local file', () => {
  const out = fs.mkdtempSync(os.tmpdir() + '/single-') + '/publish';
  execFileSync('node', ['package.js', '--single'], { cwd: root, stdio: 'ignore', env: { ...process.env, PORTFOLIO_PUBLISH: out } });
  const html = fs.readFileSync(out + '/index.html', 'utf8');
  assert.ok(!/<link rel="stylesheet" href="[^"]*\.css"/.test(html) && !/<script src="[^"]*\.js"><\/script>/.test(html), 'styles and scripts must be inline');
  assert.ok(html.includes('data:image/webp;base64,'), 'avatars must be inline');
  assert.ok(html.includes('data:audio/mpeg;base64,'), 'the opening sound must be inline');
  assert.ok(!/(src|href)="(?!https?:|data:|#|mailto:|tel:)[^"]+"/.test(html.replace(/<script>[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')), 'no local file references may remain');
  assert.ok(fs.existsSync(out + '/llms.txt') && fs.existsSync(out + '/assets/og-image.png'));
  assert.ok(Buffer.byteLength(html) < 1_000_000, 'a single-file portfolio should stay under 1 MB');
});

test('the checker rejects a theme that does not exist', () => {
  const f = os.tmpdir() + '/bad-theme-' + process.pid + '.js';
  fs.writeFileSync(f, 'const m = require(' + JSON.stringify(root + '/tests/fixtures/teacher-profile.js') + '); m.site.theme = "nope"; module.exports = m;');
  const r = spawnSync('node', ['check.js', f], { cwd: root, encoding: 'utf8' });
  assert.strictEqual(r.status, 1);
  assert.match(r.stdout, /site\.theme "nope" does not exist\. Available themes: .*netflix/);
});

// Flexible rows: the toolkit title follows the real count, and an education stop only gets a dropdown when it has details.
function buildVariant(mutate) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'variant-'));
  const prof = path.join(dir, 'profile.js');
  fs.writeFileSync(prof, `const p = require(${JSON.stringify(path.join(root, 'tests/fixtures/minimal-profile.js'))});\n(${mutate.toString()})(p);\nmodule.exports = p;`);
  build('netflix', prof, dir);
  return fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
}

test('the toolkit title matches how many skills there really are', () => {
  const six = buildVariant((p) => { p.site.sections = { skills: { title: 'Top 10 in my toolkit' } }; });
  assert.match(six, /<h2>Top 6 in my toolkit/);
  assert.doesNotMatch(six, /Top 10/);
  const two = buildVariant((p) => { p.skills = p.skills.slice(0, 2); p.site.sections = { skills: { title: 'Top 10 in my toolkit' } }; });
  assert.match(two, /<h2>In my toolkit/);
  assert.doesNotMatch(two, /Top \d+ in my toolkit/);
});

test('an education stop has a dropdown only when it has details', () => {
  const html = buildVariant((p) => {
    p.education = [
      { level: 'Postgraduate', title: 'MSc One', school: 'Uni A', period: '2023 to 2024', extra: '', chips: [], details: [] },
      { level: 'Undergraduate', title: 'BSc Two', school: 'Uni B', period: '2019 to 2023', extra: '', chips: [], details: [{ label: 'Built', text: 'a thesis.' }] }
    ];
  });
  assert.strictEqual((html.match(/<h5>[^<]*<i class="chev"/g) || []).length, 1, 'only the stop with details gets an arrow');
  assert.strictEqual((html.match(/class="stop has-more"/g) || []).length, 1);
  assert.match(html, /Tap a stop to open it/);
  const none = buildVariant((p) => { p.education = [{ level: 'Undergraduate', title: 'BSc', school: 'Uni', period: '2020', extra: '', chips: [], details: [] }]; });
  assert.doesNotMatch(none, /<h5>[^<]*<i class="chev"/);
  assert.doesNotMatch(none, /Tap a stop to open it/);
});

test('every theme corrects a "Top N" skills title to the real number of skills', () => {
  for (const id of themes) {
    const out = fs.mkdtempSync(os.tmpdir() + '/top-');
    build(id, 'profile.js', out);
    const html = fs.readFileSync(out + '/index.html', 'utf8');
    const n = require(path.join(root, 'profile.js')).skills.length;
    assert.ok(html.includes('Top ' + n + ' in my toolkit') || !/Top 10 in my toolkit/.test(html), id + ' shows a wrong "Top N" title');
    assert.doesNotMatch(html, n === 10 ? /^$/ : /Top 10 in my toolkit/, id + ' still says Top 10');
  }
});

test('npm run themes lists every theme with its description', () => {
  const out = execFileSync('node', ['themes.js'], { cwd: root, encoding: 'utf8' });
  for (const id of themes) assert.ok(out.includes(id + '  ('), id + ' is not listed');
  assert.match(out, /best for:/);
});
