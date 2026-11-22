// AGENTS.md is the product: it is what an AI reads to build someone's portfolio. Guard the rules we learned the hard way.
const test = require('node:test');
const assert = require('node:assert');
const { read } = require('./helpers');

const md = read('AGENTS.md');

test('AGENTS.md keeps the sections an AI needs', () => {
  for (const h of ['## Hard rules', '## Ask once before you build', '## Fetching the data', '## The hero numbers and work experience', '## Keep rows and cards flexible', '## Final checklist', '## Publishing']) {
    assert.ok(md.includes(h), 'missing section: ' + h);
  }
});

test('AGENTS.md tells the AI to open every kind of link and to flag conflicts', () => {
  for (const word of ['LinkedIn', '/details/experience/', 'YouTube', 'DOI', 'GitHub profile', 'one level deeper', 'disagree', 'which resume']) {
    assert.ok(new RegExp(word, 'i').test(md), 'AGENTS.md no longer mentions: ' + word);
  }
});

test('the final checklist covers the lessons from real use', () => {
  const list = md.slice(md.indexOf('## Final checklist'), md.indexOf('## Publishing'));
  for (const word of ['resume file', 'LinkedIn', 'conflict', 'hero stat', 'dropdown', 'phone', 'npm test']) {
    assert.ok(new RegExp(word, 'i').test(list), 'checklist is missing: ' + word);
  }
});

test('npm run check reminds the AI about the checklist when the profile is fine', () => {
  const { spawnSync } = require('child_process');
  const r = spawnSync('node', ['check.js', 'tests/fixtures/minimal-profile.js'], { cwd: require('./helpers').root, encoding: 'utf8' });
  assert.match(r.stdout, /Final checklist/);
});
