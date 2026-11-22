// Content checks: every card has what the page needs, and every link is well formed.
const test = require('node:test');
const assert = require('node:assert');
const { read, loadData, isHttps } = require('./helpers');

const { projects, repos, skills } = loadData();
// Only these are required (same as npm run check). problem, result, stack, role, tags, arch are optional.
const REQUIRED = ['t', 'sub', 'g', 'built', 'blurb'];

test('every project has the fields the modal reads', () => {
  for (const p of projects) {
    for (const k of REQUIRED) assert.ok(p[k] !== undefined && p[k] !== '', `"${p.t}" is missing "${k}"`);
    if (p.tags !== undefined) assert.ok(Array.isArray(p.tags), `"${p.t}" tags must be a list`);
    if (p.arch !== undefined) assert.ok(Array.isArray(p.arch), `"${p.t}" arch must be a list`);
  }
});

test('project titles are unique', () => {
  const t = projects.map((p) => p.t);
  assert.strictEqual(new Set(t).size, t.length);
});

test('all project links are valid https URLs', () => {
  for (const p of projects) {
    for (const k of ['live', 'src', 'blog']) if (p[k]) assert.ok(isHttps(p[k]), `${p.t}.${k}: ${p[k]}`);
    for (const x of p.extra || []) {
      assert.ok(x.l && x.u, `${p.t}: extra link needs l and u`);
      assert.ok(isHttps(x.u), `${p.t}: bad extra link ${x.u}`);
    }
  }
});

test('every repo card is complete and points at GitHub', () => {
  for (const r of repos) {
    for (const k of ['n', 'd', 'l', 'c', 'u']) assert.ok(r[k], `repo "${r.n}" missing "${k}"`);
    assert.strictEqual(typeof r.s, 'number', `repo "${r.n}" stars must be a number`);
    assert.ok(/^https:\/\/github\.com\//.test(r.u), `repo "${r.n}" url ${r.u}`);
  }
  const u = repos.map((r) => r.u);
  assert.strictEqual(new Set(u).size, u.length, 'duplicate repo');
});

test('every skill has a name and a group', () => {
  for (const s of skills) assert.ok(s.n && s.s && s.g, `bad skill ${JSON.stringify(s)}`);
});

test('headline project count on the page matches the data', () => {
  const m = read('index.html').match(/\[(\d+) titles\]/);
  assert.ok(m, 'could not find "[N titles]" in index.html');
  assert.strictEqual(Number(m[1]), projects.length);
});
