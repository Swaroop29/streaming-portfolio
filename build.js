// Builds the site from profile.js with the chosen theme.   Run with:  npm run build
//   PORTFOLIO_PROFILE=path/to/profile.js   build a different profile (the tests do this)
//   PORTFOLIO_OUT=folder                   write somewhere else instead of the repository root
//   PORTFOLIO_THEME=id                     pick a theme (default: site.theme in profile.js, else "netflix")
const fs = require('fs');
const path = require('path');
const core = require('./core/core.js');

const OUT = process.env.PORTFOLIO_OUT || '.';
const d = core.load(process.env.PORTFOLIO_PROFILE || './profile.js');
const themeId = process.env.PORTFOLIO_THEME || d.site.theme || 'netflix';
const themeDir = path.join(__dirname, 'themes', themeId);
if (!/^[a-z0-9-]+$/.test(themeId) || !fs.existsSync(path.join(themeDir, 'theme.js'))) {
  const known = fs.readdirSync(path.join(__dirname, 'themes')).filter(n => fs.existsSync(path.join(__dirname, 'themes', n, 'theme.js')));
  throw new Error('Unknown theme "' + themeId + '". Available themes: ' + known.join(', '));
}
const theme = require(themeDir + '/theme.js');

fs.mkdirSync(OUT, { recursive: true });
const written = ['index.html'];
fs.writeFileSync(path.join(OUT, 'index.html'), theme.render(d));

// the theme's own files (styles, script) sit next to index.html so the page works on any static host
for (const f of theme.files) { fs.copyFileSync(path.join(themeDir, f), path.join(OUT, f)); written.push(f); }
if (d.site.analytics && d.site.analytics.goatcounter) { fs.copyFileSync(path.join(__dirname, 'core', 'analytics.js'), path.join(OUT, 'analytics.js')); written.push('analytics.js'); }

const seo = core.seoFiles(d);
for (const [name, text] of Object.entries(seo)) { fs.writeFileSync(path.join(OUT, name), text); written.push(name); }
console.log('built (' + themeId + ' theme): ' + written.join(', '));
