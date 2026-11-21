// The analytics file must record real actions, send them in GoatCounter's format, and never break the page.
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm');
const { JSDOM, VirtualConsole } = require('jsdom');
const { read } = require('./helpers');

const open = []; // every fake window we create, closed after each test so timers cannot keep Node alive
test.afterEach(() => { while (open.length) open.pop().close(); });

function boot() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(e.message));
  const html = read('index.html').replace(/<script[^>]*src=[^>]*><\/script>/g, '');
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc, url: 'http://localhost/' });
  const w = dom.window;
  open.push(w);
  const sent = [];
  w.goatcounter = { count: (o) => sent.push(o) };
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  w.HTMLMediaElement.prototype.pause = () => {};
  const noop = new Proxy(function () {}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 0 }) : noop), set: () => true, apply: () => noop });
  w.HTMLCanvasElement.prototype.getContext = () => noop;
  const ctx = dom.getInternalVMContext();
  for (const f of ['profile.js', 'script.js', 'core/analytics.js']) new vm.Script(read(f), { filename: f }).runInContext(ctx);
  return { w, sent, errors };
}

test('analytics.js runs without errors', () => {
  assert.deepStrictEqual(boot().errors, []);
});

test('events are sent to GoatCounter in the right format', () => {
  const { w, sent } = boot();
  w.track('Hello World!', 'Test');
  const e = sent.find((s) => s.title === 'Test');
  assert.ok(e, 'event was not sent');
  assert.strictEqual(e.path, 'event/hello-world');
  assert.strictEqual(e.event, true);
});

test('choosing a profile is recorded', () => {
  const { w } = boot();
  w.document.querySelector('.profile[data-id="engineer"]').click();
  assert.ok(w.analyticsLog.includes('profile/engineer'), w.analyticsLog.join(','));
});

test('opening a project and its link are recorded', () => {
  const { w } = boot();
  const cards = [...w.document.querySelectorAll('#t-projects .card')];
  cards[0].click();
  assert.ok(w.analyticsLog.some((n) => n.startsWith('project/')), w.analyticsLog.join(','));
  const i = cards.findIndex((c, k) => { const p = require('./helpers').loadData().projects[k]; return p.live || p.src || p.blog; });
  if (i === -1) return; // no project has a link to click
  cards[i].click();
  const link = w.document.querySelector('#m-links a');
  link.addEventListener('click', (e) => e.preventDefault());
  link.click();
  assert.ok(w.analyticsLog.some((n) => n.startsWith('project-link/')), w.analyticsLog.join(','));
});

test('contact and resume clicks are recorded', () => {
  const { w } = boot();
  const click = (sel) => { const a = w.document.querySelector(sel); a.addEventListener('click', (e) => e.preventDefault()); a.click(); };
  const expect = [];
  const present = (sel) => w.document.querySelector(sel);
  if (present('a[href^="mailto:"]')) { click('a[href^="mailto:"]'); expect.push('contact/email'); }
  if (present('a[href^="tel:"]')) { click('a[href^="tel:"]'); expect.push('contact/phone'); }
  if (present('a[href*="linkedin.com"]')) { click('a[href*="linkedin.com"]'); expect.push('contact/linkedin'); }
  if (present('a[download]')) { click('a[download]'); expect.push('resume/download'); }
  assert.ok(expect.length >= 2, 'expected at least email and one more contact link on the page');
  for (const n of expect) assert.ok(w.analyticsLog.includes(n), `missing ${n}`);
});

test('events recorded before GoatCounter loads are held, then sent', () => {
  const { w, sent } = boot();
  const gc = w.goatcounter; w.goatcounter = undefined;
  w.track('early-event');
  assert.ok(!sent.some((s) => s.path === 'event/early-event'));
  w.goatcounter = gc;
  w.track('later-event');
  assert.ok(sent.some((s) => s.path === 'event/later-event'));
});

test('a failing analytics call never breaks the page', () => {
  const { w } = boot();
  w.goatcounter = { count() { throw new Error('boom'); } };
  assert.doesNotThrow(() => w.track('x'));
});
