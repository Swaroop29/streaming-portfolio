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
  assert.match(r.stdout, /site\.theme "nope" does not exist\. Available themes: netflix/);
});
