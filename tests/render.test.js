// Smoke test: load the real page in a fake browser and check the cards actually render.
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm');
const { JSDOM, VirtualConsole } = require('jsdom');
const { read, loadData } = require('./helpers');

const open = []; // every fake window we create, closed after each test so timers cannot keep Node alive
test.afterEach(() => { while (open.length) open.pop().close(); });

function boot() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(e.message));
  const html = read('index.html').replace(/<script[^>]*src=[^>]*><\/script>/g, ''); // we inject our own below
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc, url: 'http://localhost/' });
  const w = dom.window;
  open.push(w);
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  w.HTMLMediaElement.prototype.pause = () => {};
  // jsdom has no canvas; give the page a harmless fake 2D context.
  const noop = new Proxy(function () {}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 0 }) : noop), set: () => true, apply: () => noop });
  w.HTMLCanvasElement.prototype.getContext = () => noop;
  // Run both files in the page's own global scope, like separate <script> tags do.
  const ctx = dom.getInternalVMContext();
  try {
    new vm.Script(read('profile.js'), { filename: 'profile.js' }).runInContext(ctx);
    new vm.Script(read('script.js'), { filename: 'script.js' }).runInContext(ctx);
  } catch (e) { errors.push(String(e)); }
  return { w, errors };
}

test('page scripts run with no errors', () => {
  const { errors } = boot();
  assert.deepStrictEqual(errors, []);
});

test('one card is rendered per project, repo and skill', () => {
  const { w } = boot();
  const d = loadData();
  const n = (id) => { const e = w.document.getElementById(id); return e ? e.children.length : 0; }; // a section with no items is removed from the page
  assert.strictEqual(n('t-projects'), d.projects.length, 'project cards');
  assert.strictEqual(n('t-repos'), d.repos.length, 'repo cards');
  assert.strictEqual(n('t-skills'), d.skills.length, 'skill cards');
});

test('opening a project fills the modal, including extra links when there are any', () => {
  const { w } = boot();
  const d = loadData();
  w.document.getElementById('t-projects').children[0].click();
  assert.strictEqual(w.document.getElementById('m-title').textContent, d.projects[0].t);
  const i = d.projects.findIndex((p) => p.extra && p.extra.length);
  if (i === -1) return;
  w.document.getElementById('t-projects').children[i].click();
  const links = [...w.document.getElementById('m-links').querySelectorAll('a')].map((a) => a.href);
  for (const x of d.projects[i].extra) assert.ok(links.includes(x.u), `modal is missing link ${x.u}`);
});
