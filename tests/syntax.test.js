// Catches the exact failure we had: a typo in a JS file that silently blanks the page.
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm');
const { read } = require('./helpers');

for (const file of ['profile.js', 'build.js', 'check.js', 'package.js', 'og.js', 'core/core.js', 'core/single.js', 'core/analytics.js', 'themes/netflix/theme.js', 'themes/netflix/script.js']) {
  test(`${file} is valid JavaScript`, () => {
    assert.doesNotThrow(() => new vm.Script(read(file), { filename: file }));
  });
}

test('profile.js runs and defines every section the page needs', () => {
  const { loadData } = require('./helpers');
  const d = loadData();
  assert.ok(d.site && d.site.name, 'site');
  for (const k of ['experience', 'education', 'beyond', 'projects', 'repos', 'skills']) assert.ok(Array.isArray(d[k]), k + ' must be an array');
  assert.ok(d.projects.length > 0, 'projects');
  assert.ok(d.skills.length > 0, 'skills');
});

for (const file of ['style.css', 'print.css']) {
  test(`${file} has balanced braces`, () => {
    const css = read(file).replace(/\/\*[\s\S]*?\*\//g, '');
    const open = (css.match(/\{/g) || []).length;
    const close = (css.match(/\}/g) || []).length;
    assert.strictEqual(open, close, `{ count ${open} vs } count ${close}`);
  });
}
