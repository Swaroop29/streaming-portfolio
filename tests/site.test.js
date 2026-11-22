// File checks: nothing the page points at is missing, and scripts load in the right order.
const test = require('node:test');
const assert = require('node:assert');
const { read, exists } = require('./helpers');

const html = read('index.html');

test('every local src/href in index.html exists', () => {
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1])
    .filter((u) => u && !/^(https?:|\/\/|mailto:|tel:|#|data:)/.test(u));
  assert.ok(refs.length > 0);
  for (const r of refs) assert.ok(exists(r), `missing file: ${r}`);
});

test('every assets/ file mentioned in scripts or data exists', () => {
  const text = read('script.js') + read('profile.js') + read('style.css');
  for (const m of text.matchAll(/assets\/[\w.\-]+/g)) assert.ok(exists(m[0]), `missing file: ${m[0]}`);
});

test('profile.js loads before script.js', () => {
  const d = html.indexOf('src="profile.js"');
  const s = html.indexOf('src="script.js"');
  assert.ok(d > -1 && s > -1, 'both scripts must be included');
  assert.ok(d < s, 'profile.js must come first');
});

test('analytics.js, when enabled, loads after the page script', () => {
  const a = html.indexOf('src="analytics.js"');
  if (a === -1) return; // analytics is optional (site.analytics.goatcounter)
  assert.ok(a > html.indexOf('src="script.js"'), 'analytics.js must come after script.js');
});

test('every id the script looks up exists in the page', () => {
  const ids = [...read('script.js').matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1]);
  const { projects, repos, skills } = require('./helpers').loadData();
  const optional = { 't-projects': projects, 't-repos': repos, 't-skills': skills }; // removed from the page when the list is empty
  const missing = [...new Set(ids)].filter((id) => !new RegExp(`id="${id}"`).test(html) && !(optional[id] && !optional[id].length));
  assert.deepStrictEqual(missing, []);
});

test('no merge-conflict markers or leftover debugger statements', () => {
  for (const f of ['index.html', 'script.js', 'profile.js', 'style.css']) {
    const t = read(f);
    assert.ok(!/^(<{7}|>{7}) /m.test(t), `${f} has conflict markers`);
    assert.ok(!/\bdebugger\b/.test(t), `${f} has a debugger statement`);
  }
});

// Link previews (LinkedIn, Slack, WhatsApp...) read these tags. Without them the link shows nothing.
test('share tags are present and the preview image exists', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const html = read('index.html');
  for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card']) {
    assert.ok(html.includes(tag), `missing ${tag}`);
  }
  assert.ok(/<meta name="description" content="[^"]{40,}"/.test(html), 'missing meta description');
  const img = html.match(/property="og:image" content="([^"]+)"/)[1];
  assert.ok(img.startsWith('https://'), 'og:image must be an absolute https URL');
  const file = path.join(__dirname, '..', 'assets', 'og-image.png');
  assert.ok(fs.existsSync(file), 'assets/og-image.png is missing');
  assert.ok(img.endsWith('/assets/og-image.png'));
  const png = fs.readFileSync(file);
  assert.strictEqual(png.readUInt32BE(16), 1200);
  assert.strictEqual(png.readUInt32BE(20), 630);
});
