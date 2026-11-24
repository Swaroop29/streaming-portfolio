// Writes one image prompt per project (and one for the hero) from the person's own content, for the Neon Coast theme.
// Paste each prompt into an image tool (ChatGPT, Midjourney, Firefly and so on), save the result in assets/, then set
// site.heroImage and each project's image in profile.js. Usage: npm run image-prompts
const path = require('path');
const core = require('./core/core.js');
const theme = require('./themes/neon-coast/theme.js');
const d = core.load(process.env.PORTFOLIO_PROFILE || 'profile.js');
const STYLE = 'Painterly retro 1980s Miami coast illustration at golden-hour sunset: hot pink, orange and teal sky, art-deco buildings with neon trim, palm trees, wet reflective road. Cinematic, richly detailed, slightly grainy, no text, no logos, no watermarks, no recognisable real people or brands.';
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const lines = [];
const role = d.site.role.toLowerCase();
const heroMotif = theme.MOTIF_TEXT[theme.kindFor({ t: d.site.role, blurb: d.site.tagline, stack: d.skills.map(s => s.n).join(' ') }, d.site.role)];
lines.push('HERO  save as assets/hero.jpg  then set site.heroImage: "assets/hero.jpg"',
  'Wide 16:9 (1920x1080). A sweeping sunset waterfront street with a retro sports car in the foreground, with a subtle nod to a ' + role + ' (' + heroMotif + ') in the scene. Keep the left third calm and darker so a headline can sit on it. ' + STYLE, '');
d.projects.forEach(p => {
  const motif = theme.MOTIF_TEXT[theme.kindFor(p, d.site.role)];
  lines.push('PROJECT ' + p.t + '  save as assets/' + slug(p.t) + '.jpg  then set image: "assets/' + slug(p.t) + '.jpg"',
    '5:3 (1000x600). A scene that shows what this project is about: ' + (p.blurb || p.built || p.t) + ' Key object: ' + motif + '. ' + STYLE, '');
});
console.log(lines.join('\n'));
console.log('Keep each file under 250 KB (JPEG, quality about 80) so the page stays fast.');
