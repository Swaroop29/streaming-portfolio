// The print view lives in its own file; make sure it is wired up and stays in step with the page.
const test = require('node:test');
const assert = require('node:assert');
const { read } = require('./helpers');

const html = read('index.html');
const print = read('print.css');

test('print.css is linked for printing only', () => {
  assert.ok(/<link[^>]+href="print\.css"[^>]+media="print"/.test(html), 'index.html must link print.css with media="print"');
});

test('contact details printed in the header match the real ones on the page', () => {
  const email = html.match(/class="mail">([^<@\s]+@[^<\s]+)</)[1];
  const printVar = (html.match(/--print-contact:"([^"]*)"/) || [])[1];
  assert.ok(printVar, 'index.html is missing the --print-contact value (run npm run build)');
  assert.ok(printVar.includes(email), `printed contact line is missing ${email}`);
  assert.ok(print.includes('var(--print-contact)'), 'print.css must use --print-contact');
  const phones = [...html.matchAll(/href="tel:([+\d]+)"/g)].map((m) => m[1].replace(/\D/g, ''));
  assert.strictEqual(phones.length, require('./helpers').loadData().site.contact.phones.length);
  const printDigits = printVar.replace(/\D/g, '');
  for (const p of phones) assert.ok(printDigits.includes(p.slice(-10)), `printed contact line is missing phone ${p}`);
});

test('print view does not rely on dark backgrounds', () => {
  assert.ok(/html, body \{[^}]*background: #fff/.test(print));
  assert.ok(/color: #111/.test(print));
});

test('there is no separate "Continue as guest" button any more', () => {
  assert.ok(!html.includes('id="skip"'));
  assert.ok(!/Continue as guest/i.test(html));
});

test('print.css takes the footer line from the profile', () => {
  assert.ok(print.includes('var(--print-footer)'));
  assert.ok(/--print-footer:"[^"]+"/.test(html), 'index.html is missing --print-footer (run npm run build)');
});
