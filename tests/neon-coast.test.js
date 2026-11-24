// Neon Coast draws each project's picture from what the project is about.
const test = require('node:test');
const assert = require('node:assert');
const theme = require('../themes/neon-coast/theme.js');

test('the picture matches the project: billing, dashboards, AI, cloud and a safe default', () => {
  assert.strictEqual(theme.kindFor({ t: 'Billing Service', blurb: 'One service that owns invoices' }), 'money');
  assert.strictEqual(theme.kindFor({ t: 'Release Dashboard', stack: 'React, metrics' }), 'data');
  assert.strictEqual(theme.kindFor({ t: 'Company Brain', stack: 'knowledge graph, MCP' }), 'ai');
  assert.strictEqual(theme.kindFor({ t: 'Task Scheduler', stack: 'Go, etcd, Docker' }), 'cloud');
  assert.strictEqual(theme.kindFor({ t: 'Zzz' }), 'code');
});

test('non-tech careers get their own scenes, not a laptop', () => {
  assert.strictEqual(theme.kindFor({ t: 'Contract review for a merger', blurb: 'Litigation support' }, 'Solicitor'), 'law');
  assert.strictEqual(theme.kindFor({ t: 'Patient care pathway redesign' }, 'Nurse'), 'health');
  assert.strictEqual(theme.kindFor({ t: 'Year 9 curriculum rewrite' }, 'Teacher'), 'teach');
  assert.strictEqual(theme.kindFor({ t: 'Autumn menu launch', blurb: 'Restaurant tasting menu' }, 'Chef'), 'food');
  assert.strictEqual(theme.kindFor({ t: 'Zzz' }, 'Accountant'), 'work');
  assert.strictEqual(theme.kindFor({ t: 'Zzz' }, 'Backend Engineer'), 'code');
});

test('the checker warns when an image-led design has no pictures set', () => {
  const { spawnSync } = require('node:child_process'), fs = require('node:fs'), os = require('node:os'), path = require('node:path');
  const root = path.join(__dirname, '..');
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'nc-')), 'p.js');
  fs.writeFileSync(f, 'const m = require(' + JSON.stringify(path.join(root, 'tests/fixtures/teacher-profile.js')) + '); m.site.theme = "neon-coast"; module.exports = m;');
  const out = spawnSync('node', ['check.js', f], { cwd: root, encoding: 'utf8' }).stdout;
  assert.match(out, /looks best with real pictures/);
  fs.writeFileSync(f, 'const m = require(' + JSON.stringify(path.join(root, 'tests/fixtures/teacher-profile.js')) + '); m.site.theme = "neon-coast"; m.site.heroImage = "assets/hero.jpg"; module.exports = m;');
  assert.doesNotMatch(spawnSync('node', ['check.js', f], { cwd: root, encoding: 'utf8' }).stdout, /looks best with real pictures/);
});
