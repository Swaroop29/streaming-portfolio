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
