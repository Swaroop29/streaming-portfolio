// Collects only the files a web host needs into ./publish (and publish.zip if the `zip` tool exists).
// Drag the publish folder or publish.zip onto vercel.com/drop (or any static host). No build step is needed there.
// Run with:  npm run package            several files (best for a normal website)
//            npm run single             ONE self-contained index.html (best for previewing in a chat and for dragging onto a host)
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

execFileSync('node', ['build.js'], { stdio: 'inherit' });
const OUT = process.env.PORTFOLIO_PUBLISH || 'publish';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const SINGLE = process.argv.includes('--single');
const html = fs.readFileSync('index.html', 'utf8');
const files = SINGLE ? ['llms.txt', 'robots.txt', 'sitemap.xml'] : ['index.html', 'style.css', 'print.css', 'script.js', 'profile.js', 'llms.txt', 'robots.txt', 'sitemap.xml'];
if (!SINGLE && /src="analytics\.js"/.test(html)) files.push('analytics.js');
for (const f of files) if (fs.existsSync(f)) fs.copyFileSync(f, path.join(OUT, f));
if (SINGLE) {
  fs.writeFileSync(path.join(OUT, 'index.html'), require('./core/single.js').inline('.'));
  fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
  fs.copyFileSync('assets/og-image.png', path.join(OUT, 'assets', 'og-image.png'));   // the share card needs a normal file
} else fs.cpSync('assets', path.join(OUT, 'assets'), { recursive: true });

// every local file the page points to must be in the folder
const outHtml = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
const missing = [...outHtml.matchAll(/(?:src|href)="([^"#:?]+)"/g)].map(m => m[1])
  .filter(p => !p.startsWith('//') && !fs.existsSync(path.join(OUT, p)));
if (missing.length) { console.error('Missing from the publish folder: ' + missing.join(', ')); process.exit(1); }

let zipped = false;
if (spawnSync('zip', ['-v'], { stdio: 'ignore' }).status === 0) {
  fs.rmSync(OUT + '.zip', { force: true });
  zipped = spawnSync('zip', ['-rq', path.resolve(OUT + '.zip'), '.'], { cwd: OUT }).status === 0;
}
console.log('Ready to publish: ./' + OUT + '/' + (zipped ? ' and ./' + OUT + '.zip' : ' (zip it yourself if the host asks for a zip)'));
