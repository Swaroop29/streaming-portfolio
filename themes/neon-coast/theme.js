// The "Neon Coast" theme: a big-budget game-launch page. Sunset hero with a name that assembles from slices, a cover-art collage of projects, story and chapter bands. Works without JavaScript.
// Works without JavaScript. Same theme contract as every theme.
const core = require('../../core/core.js');
const { esc } = core;


// ---------- drawn scenes (original vector art; used when a project has no image of its own) ----------
const rnd = (a, b, k) => (Math.sin(a * 12.9898 + b * 78.233 + k * 3.7) + 1) / 2;
function palm(x, y, h, lean, fill) {
  const tx = x + lean, ty = y - h;
  let out = '<path d="M' + x + ' ' + y + ' Q' + (x + lean * 0.15) + ' ' + (y - h * 0.62) + ' ' + tx + ' ' + ty + '" stroke="' + fill + '" stroke-width="' + Math.max(3, h / 26) + '" fill="none" stroke-linecap="round"/>';
  for (let k = 0; k < 8; k++) {
    const a = -178 + k * 25.5, sc = h / 120;
    out += '<path d="M0 0 Q38 -26 96 14 Q46 -6 0 5Z" fill="' + fill + '" transform="translate(' + tx + ' ' + ty + ') rotate(' + a + ') scale(' + sc.toFixed(2) + ')"/>';
  }
  return out;
}
function windows(x, y, w, h, cols, rows, seed, on, off) {
  let o = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    o += '<rect x="' + (x + 6 + c * ((w - 12) / cols)).toFixed(1) + '" y="' + (y + 8 + r * ((h - 16) / rows)).toFixed(1) + '" width="' + (((w - 12) / cols) - 4).toFixed(1) + '" height="' + (((h - 16) / rows) - 5).toFixed(1) + '" fill="' + (rnd(c, r, seed) > .42 ? on : off) + '"/>';
  }
  return o;
}
function heroScene() {
  let s = '<svg class="art" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>' +
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#160a33"/><stop offset=".3" stop-color="#5c1a78"/><stop offset=".52" stop-color="#e0407f"/><stop offset=".68" stop-color="#ff8a4c"/><stop offset=".78" stop-color="#ffd08a"/></linearGradient>' +
    '<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2467f"/><stop offset=".3" stop-color="#4a1a63"/><stop offset="1" stop-color="#150a2b"/></linearGradient>' +
    '<linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset="1" stop-color="#ff9a4c"/></linearGradient>' +
    '<linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4ad8c8"/><stop offset="1" stop-color="#1b6e86"/></linearGradient>' +
    '<mask id="stripes"><rect width="1600" height="900" fill="#fff"/>' + [0, 1, 2, 3, 4, 5].map(i => '<rect x="380" y="' + (560 + i * 20) + '" width="360" height="' + (3 + i * 2) + '" fill="#000"/>').join('') + '</mask></defs>' +
    '<rect width="1600" height="620" fill="url(#sky)"/>' +
    [[120, 70], [420, 40], [900, 90], [1200, 50], [1450, 110], [260, 150]].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2" fill="#ffe9f4" opacity=".7"/>').join('') +
    '<path d="M90 150 q40 -25 80 0" stroke="#2a1040" stroke-width="3" fill="none"/><path d="M200 110 q30 -20 60 0" stroke="#2a1040" stroke-width="3" fill="none"/>' +
    '<circle cx="560" cy="590" r="150" fill="url(#sun)" mask="url(#stripes)"/>' +
    '<rect y="620" width="1600" height="280" fill="url(#sea)"/>' +
    [0, 1, 2, 3, 4, 5, 6].map(i => '<rect x="' + (470 + i * 8) + '" y="' + (632 + i * 22) + '" width="' + (180 - i * 16) + '" height="6" rx="3" fill="#ffc27a" opacity="' + (0.7 - i * .08).toFixed(2) + '"/>').join('');
  // distant skyline
  for (let i = 0; i < 16; i++) { const w = 34 + rnd(i, 1, 2) * 30, h = 60 + rnd(i, 2, 2) * 190, x = 640 + i * 38; s += '<rect x="' + x + '" y="' + (620 - h) + '" width="' + w + '" height="' + h + '" fill="#3a1556"/>' + windows(x, 620 - h, w, h, 3, Math.floor(h / 24), i, '#ffcf7a', '#4b2068'); }
  // deco hotels on the right
  const hotels = [[1010, 330, 210, 290, '#ffe9f2', '#35f2e4'], [1230, 270, 170, 350, '#fff0dc', '#ff4fa8'], [1410, 360, 200, 260, '#ffe2ee', '#35f2e4']];
  hotels.forEach((b, k) => {
    const [x, y, w, h, wall, neon] = b;
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (h) + '" fill="' + wall + '" opacity=".92"/>';
    for (let r = 0; r < 5; r++) s += '<rect x="' + (x + 12) + '" y="' + (y + 40 + r * 52) + '" width="' + (w - 24) + '" height="26" fill="#2b1043" opacity=".85"/>' + windows(x + 12, y + 40 + r * 52, w - 24, 26, 5, 1, k * 9 + r, '#ffcf7a', '#6c3d93');
    s += '<rect x="' + (x - 6) + '" y="' + (y + 20) + '" width="' + (w + 12) + '" height="8" rx="4" fill="' + neon + '"/><rect x="' + (x - 6) + '" y="' + (y + 300) + '" width="' + (w + 12) + '" height="8" rx="4" fill="' + neon + '"/>';
    s += '<rect x="' + (x - 6) + '" y="' + (y + 20) + '" width="' + (w + 12) + '" height="8" rx="4" fill="none" stroke="' + neon + '" stroke-width="10" opacity=".25"/>';
  });
  s += '<rect x="1010" y="610" width="600" height="14" fill="#7a3a7c"/>';
  // awnings
  for (let i = 0; i < 6; i++) s += '<path d="M' + (1020 + i * 96) + ' 600 h86 l-12 -34 h-62z" fill="' + (i % 2 ? '#ff4fa8' : '#fff0dc') + '"/>';
  // palms
  s += palm(700, 720, 340, -30, '#120726') + palm(930, 700, 420, 40, '#120726') + palm(1020, 760, 360, -20, '#120726') + palm(60, 760, 330, 40, '#0e0620') + palm(1560, 760, 380, -60, '#0e0620') + palm(330, 740, 220, 30, '#1a0a30');
  // road and reflection
  s += '<rect y="760" width="1600" height="140" fill="#1a0b30"/><rect y="760" width="1600" height="6" fill="#ff7bb0" opacity=".55"/><rect x="0" y="830" width="1600" height="3" fill="#ffd36b" opacity=".35"/>';
  // car
  s += '<g transform="translate(1000 700)"><ellipse cx="260" cy="190" rx="300" ry="26" fill="#05020d" opacity=".6"/>' +
    '<path d="M0 150 C10 110 60 80 130 70 L200 28 C230 12 330 8 400 28 L470 70 C520 80 540 110 540 150 L540 178 L0 178Z" fill="url(#body)"/>' +
    '<path d="M214 46 C250 30 330 28 390 44 L440 74 L160 74Z" fill="#12082a" opacity=".85"/><rect x="16" y="96" width="70" height="26" rx="6" fill="#ff2d4f"/><rect x="454" y="96" width="70" height="26" rx="6" fill="#ff2d4f"/>' +
    '<rect x="16" y="96" width="70" height="26" rx="6" fill="none" stroke="#ff2d4f" stroke-width="14" opacity=".3"/><rect x="454" y="96" width="70" height="26" rx="6" fill="none" stroke="#ff2d4f" stroke-width="14" opacity=".3"/>' +
    '<rect x="150" y="132" width="240" height="14" rx="4" fill="#0a0518"/><circle cx="90" cy="178" r="34" fill="#0a0518"/><circle cx="450" cy="178" r="34" fill="#0a0518"/><circle cx="90" cy="178" r="16" fill="#8de9e0"/><circle cx="450" cy="178" r="16" fill="#8de9e0"/></g>';
  return s + '</svg>';
}
// Each project gets a picture that matches what it is about, chosen from its own words.
const MOTIFS = [
  ['ai', /\b(ai|ml|llm|gpt|agent|agents|neural|nlp|mcp|machine learning|knowledge graph|graph|embedding|rag|model|models|inference)\b/gi],
  ['money', /\b(bill|billing|invoice|invoices|pay|payment|payments|fintech|lend|loan|loans|bank|banking|finance|financial|trade|trading|stock|ledger|commerce|checkout|price|pricing|deal|deals|audit)\b/gi],
  ['data', /\b(dashboard|dashboards|analytics|analysis|analyse|data|metric|metrics|report|reporting|bi|visuali[sz]ation|chart|charts|d3|insight|insights|monitoring)\b/gi],
  ['security', /\b(security|secure|auth|oauth|encrypt|encryption|cyber|privacy|vulnerability|incident|tls|certificate|compliance|fraud)\b/gi],
  ['map', /\b(geo|map|maps|gis|location|route|routes|travel|logistics|cartopy|geopandas|city|navigation)\b/gi],
  ['energy', /\b(energy|hydrogen|green|solar|wind|climate|sustainable|sustainability|power|environment|carbon|battery|grid)\b/gi],
  ['game', /\b(game|games|gaming|unity|unreal|3d|vr|ar|pixel|arcade|graphics|engine)\b/gi],
  ['research', /\b(research|paper|papers|thesis|study|science|scientific|msc|phd|lab|experiment|bio|health|medical|clinical|survey|literature)\b/gi],
  ['phone', /\b(mobile|ios|android|flutter|swift|kotlin|chat|social|messaging|notification|notifications)\b/gi],
  ['cloud', /\b(aws|azure|gcp|cloud|kubernetes|k8s|docker|infrastructure|infra|devops|terraform|scale|scaling|migration|migrate|deploy|deployment|pipeline|scheduler|distributed|backend|microservice|microservices|api|database|dynamodb|postgres|postgresql|kafka|queue|latency|uptime|region|regions)\b/gi],
  ['web', /\b(web|website|frontend|front-end|react|vue|ui|ux|portfolio|css|html|browser|landing|page)\b/gi]
];
function kindFor(p) {
  const text = [p.t, p.t, p.sub, p.blurb, p.stack, p.badge, p.problem, p.built, p.result].filter(Boolean).join(' ');
  let best = 'code', top = 0;
  MOTIFS.forEach(([k, re]) => { const n = (text.match(re) || []).length; if (n > top) { top = n; best = k; } });
  return best;
}
const FG = {
  ai: () => '<rect x="128" y="34" width="144" height="112" rx="10" fill="#d9cfc2"/><rect x="140" y="46" width="120" height="84" rx="6" fill="#0c2a30"/>' + '<g stroke="#4af0e0" stroke-width="2" opacity=".8"><path d="M170 72 L206 62 L238 92 L190 108 L226 118 M170 72 L190 108 M206 62 L190 108 M238 92 L226 118"/></g>' + [[170, 72], [206, 62], [238, 92], [190, 108], [226, 118]].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#4af0e0"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="none" stroke="#4af0e0" opacity=".35"/>').join('') + '<rect x="176" y="146" width="48" height="12" fill="#bdb2a6"/><rect x="150" y="158" width="100" height="8" rx="3" fill="#cfc4b6"/>',
  data: () => '<rect x="118" y="34" width="164" height="112" rx="10" fill="#d9cfc2"/><rect x="130" y="46" width="140" height="84" rx="6" fill="#0c2a30"/>' + [30, 52, 40, 66, 48, 72].map((h, k) => '<rect x="' + (140 + k * 20) + '" y="' + (122 - h) + '" width="13" height="' + h + '" fill="' + (k % 2 ? '#ff6f9c' : '#4af0e0') + '"/>').join('') + '<path d="M140 100 L160 84 L180 92 L200 70 L220 78 L252 56" stroke="#ffd36b" stroke-width="3" fill="none"/><rect x="176" y="146" width="48" height="12" fill="#bdb2a6"/><rect x="148" y="158" width="104" height="8" rx="3" fill="#cfc4b6"/>',
  money: () => [[96, 164, 4], [138, 164, 6], [180, 164, 3]].map(([x, y, n]) => Array.from({ length: n }, (_, k) => '<ellipse cx="' + x + '" cy="' + (y - k * 9) + '" rx="26" ry="9" fill="#e9b52e"/><ellipse cx="' + x + '" cy="' + (y - k * 9 - 4) + '" rx="26" ry="9" fill="#ffd36b"/>').join('')).join('') + '<g transform="rotate(-6 290 100)"><rect x="236" y="30" width="110" height="134" rx="6" fill="#fff3e4"/><rect x="250" y="46" width="60" height="8" fill="#c8b8a6"/>' + [0, 1, 2, 3, 4].map(k => '<rect x="250" y="' + (66 + k * 16) + '" width="' + (80 - k * 6) + '" height="6" fill="#d9cdbd"/>').join('') + '<text x="262" y="156" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="30" fill="#e0407f">$</text></g>',
  cloud: () => '<path d="M120 78 C110 56 140 40 160 52 C170 30 214 30 220 56 C246 52 262 76 244 92 L130 92 C122 90 120 84 120 78Z" fill="#fff3e4"/><path d="M120 78 C110 56 140 40 160 52 C170 30 214 30 220 56 C246 52 262 76 244 92 L130 92 C122 90 120 84 120 78Z" fill="none" stroke="#4af0e0" stroke-width="3" opacity=".7"/>' + [90, 150, 210].map(x => '<rect x="' + x + '" y="106" width="52" height="64" rx="4" fill="#2a1a45" stroke="#4a3070" stroke-width="2"/>' + [0, 1, 2, 3].map(k => '<rect x="' + (x + 8) + '" y="' + (114 + k * 14) + '" width="36" height="8" rx="2" fill="#1a1030"/><circle cx="' + (x + 38) + '" cy="' + (118 + k * 14) + '" r="2.5" fill="' + (k % 2 ? '#4af0e0' : '#ff6f9c') + '"/>').join('')).join(''),
  web: () => '<rect x="104" y="36" width="192" height="130" rx="8" fill="#f5efe6"/><rect x="104" y="36" width="192" height="22" rx="8" fill="#2a1a45"/><circle cx="118" cy="47" r="4" fill="#ff6f9c"/><circle cx="132" cy="47" r="4" fill="#ffd36b"/><circle cx="146" cy="47" r="4" fill="#4af0e0"/><rect x="118" y="70" width="90" height="12" fill="#2a1a45"/><rect x="118" y="90" width="120" height="6" fill="#bfae9a"/><rect x="118" y="102" width="100" height="6" fill="#bfae9a"/><rect x="118" y="120" width="52" height="30" fill="#ff6f9c"/><rect x="176" y="120" width="52" height="30" fill="#4af0e0"/><rect x="234" y="120" width="48" height="30" fill="#ffd36b"/>',
  phone: () => '<rect x="156" y="22" width="88" height="148" rx="16" fill="#1a0f2e" stroke="#fff3e4" stroke-width="3"/><rect x="164" y="40" width="72" height="116" rx="6" fill="#4a2a78"/><rect x="170" y="52" width="40" height="16" rx="8" fill="#ff6f9c"/><rect x="190" y="76" width="40" height="16" rx="8" fill="#4af0e0"/><rect x="170" y="100" width="48" height="16" rx="8" fill="#ff6f9c"/><rect x="190" y="124" width="40" height="16" rx="8" fill="#4af0e0"/><rect x="186" y="28" width="28" height="5" rx="2.5" fill="#fff3e4" opacity=".7"/>',
  security: () => '<path d="M200 26 L262 48 C262 100 240 136 200 160 C160 136 138 100 138 48Z" fill="#2a1a45" stroke="#4af0e0" stroke-width="4"/><path d="M200 38 L250 56 C250 98 232 126 200 146 C168 126 150 98 150 56Z" fill="#ff6f9c" opacity=".85"/><rect x="182" y="82" width="36" height="30" rx="4" fill="#fff3e4"/><path d="M188 82 v-10 a12 12 0 0 1 24 0 v10" fill="none" stroke="#fff3e4" stroke-width="5"/><circle cx="200" cy="96" r="4" fill="#2a1a45"/>',
  map: () => '<path d="M104 44 L168 36 L232 48 L296 38 L296 160 L232 170 L168 158 L104 168Z" fill="#f2e4c8"/><path d="M168 36 V158 M232 48 V170" stroke="#cdb78f" stroke-width="2"/><path d="M118 140 C150 100 190 130 220 90 S270 70 284 60" stroke="#e0407f" stroke-width="4" stroke-dasharray="8 6" fill="none"/><circle cx="118" cy="140" r="6" fill="#4af0e0"/><path d="M284 40 a14 14 0 1 1 0.1 0 L284 78Z" fill="#ff3d5a"/><circle cx="284" cy="54" r="5" fill="#fff3e4"/>',
  game: () => '<rect x="100" y="64" width="200" height="96" rx="44" fill="#2a1a45" stroke="#6a4a9a" stroke-width="3"/><rect x="138" y="94" width="14" height="40" rx="3" fill="#fff3e4"/><rect x="125" y="107" width="40" height="14" rx="3" fill="#fff3e4"/><circle cx="246" cy="98" r="10" fill="#ff6f9c"/><circle cx="270" cy="116" r="10" fill="#4af0e0"/><circle cx="222" cy="116" r="10" fill="#ffd36b"/><circle cx="246" cy="134" r="10" fill="#9a7bff"/><rect x="180" y="104" width="16" height="8" rx="3" fill="#6a4a9a"/><rect x="204" y="104" width="16" height="8" rx="3" fill="#6a4a9a"/>',
  research: () => '<rect x="98" y="150" width="130" height="16" fill="#e0407f"/><rect x="108" y="134" width="116" height="16" fill="#4af0e0"/><rect x="94" y="118" width="124" height="16" fill="#ffd36b"/><rect x="104" y="102" width="108" height="16" fill="#9a7bff"/><path d="M270 44 h28 v36 l32 64 c4 10 -2 20 -14 20 h-64 c-12 0 -18 -10 -14 -20 l32 -64z" fill="#fff3e4" opacity=".9"/><path d="M252 134 h64 l12 24 c3 8 -2 12 -10 12 h-68 c-8 0 -13 -4 -10 -12z" fill="#4af0e0"/><circle cx="276" cy="120" r="4" fill="#fff3e4"/><circle cx="292" cy="108" r="3" fill="#fff3e4"/>',
  code: () => '<rect x="112" y="46" width="176" height="104" rx="8" fill="#2a2338" stroke="#d9cfc2" stroke-width="5"/><rect x="122" y="56" width="156" height="84" fill="#0c2a30"/>' + [[130, 70, 50, '#ff6f9c'], [186, 70, 36, '#4af0e0'], [138, 84, 70, '#ffd36b'], [214, 84, 40, '#9a7bff'], [138, 98, 36, '#4af0e0'], [180, 98, 60, '#ff6f9c'], [130, 112, 80, '#ffd36b'], [138, 126, 44, '#4af0e0']].map(l => '<rect x="' + l[0] + '" y="' + l[1] + '" width="' + l[2] + '" height="6" rx="3" fill="' + l[3] + '"/>').join('') + '<path d="M96 150 H304 L318 166 H82Z" fill="#cfc4b6"/><rect x="180" y="156" width="40" height="4" rx="2" fill="#a89c8c"/>'
};
const HUES = [['#2a0e5c', '#ff5f8a'], ['#2a0e5c', '#7a2a9a'], ['#4a1a72', '#ff9a5a'], ['#2f1a6a', '#ff7fa8']];
function cardScene(p, i) {
  const h = HUES[i % HUES.length], kind = kindFor(p), id = 'g' + i;
  let back = '<rect width="400" height="240" fill="url(#' + id + ')"/><circle cx="' + (300 - (i % 3) * 90) + '" cy="96" r="44" fill="#ffd08a" opacity=".9"/>';
  for (let k = 0; k < 16; k++) { const w = 20 + rnd(k, i, 1) * 16, ht = 40 + rnd(k, i, 2) * 80, x = k * 26 - 4; back += '<rect x="' + x + '" y="' + (176 - ht) + '" width="' + w + '" height="' + ht + '" fill="#2b1250" opacity=".85"/>' + windows(x, 176 - ht, w, ht, 2, Math.floor(ht / 18), k + i, '#ffcf7a', '#3d1c69'); }
  back += '<rect y="176" width="400" height="64" fill="#1a0b30"/><rect y="176" width="400" height="3" fill="#ff7bb0" opacity=".5"/>' + palm(30, 190, 120, 18, '#120726') + palm(374, 192, 110, -18, '#120726');
  return '<svg class="art" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-scene="' + kind + '"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + h[0] + '"/><stop offset="1" stop-color="' + h[1] + '"/></linearGradient></defs>' + back + (FG[kind] || FG.code)() + '</svg>';
}

function render(d) {
  const { site, PALETTE, experience, education, beyond, projects, repos, skills, extraSections, LABELS } = d;
  const c = site.contact;
  const link = (u, t) => '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(t) + '</a>';
  const row = (k, v) => v ? '<p><b>' + esc(k) + '</b> ' + esc(v) + '</p>' : '';
  const det = (summary, sub, body) => '<details class="item"><summary><span class="t">' + esc(summary) + '</span>' + (sub ? '<span class="s">' + esc(sub) + '</span>' : '') + '</summary><div class="in">' + body + '</div></details>';
  const plain = []; // plain-text lines for the terminal, per section id
  const lines = {};

  const projectsBody = projects.map(p => {
    const links = [p.live && ['Live demo', p.live], p.src && ['Source', p.src], p.blog && ['Write-up', p.blog]].concat((p.extra || []).map(x => [x.l, x.u])).filter(Boolean).map(([n, u]) => link(u, n)).join(' · ');
    return det(p.t, p.blurb || p.sub, '<p class="meta">' + esc(p.sub) + (p.badge ? ' · ' + esc(p.badge) : '') + '</p>' + row(LABELS.problem || 'The problem', p.problem) + row(LABELS.built || 'What I built', p.built) + row(LABELS.result || 'Result', p.result) +
      row(LABELS.stack || 'Built with', p.stack) + row(LABELS.role || 'My role', p.role) + row(LABELS.arch || 'Architecture', (p.arch || []).join(' → ')) + row(LABELS.diff || "What I'd do differently", p.diff) + (links ? '<p class="links">' + links + '</p>' : ''));
  }).join('');
  lines.projects = projects.map(p => p.t + ': ' + (p.blurb || p.built));

  const experienceBody = experience.map(co => '<h3>' + esc(co.company) + '</h3><p class="meta">' + esc(co.role) + ' · ' + esc(co.period) + (co.place ? ' · ' + esc(co.place) : '') + '</p>' +
    co.episodes.map(e => det(e.title, e.tag || e.label, '<p>' + esc(e.blurb) + '</p>' + row(LABELS.situation, e.situation) + ((e.did || []).length ? '<ul>' + e.did.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + (e.stack ? '<p class="meta">' + esc(LABELS.stack) + ': ' + esc(e.stack) + '</p>' : '')).replace('<details', '<details')).join('')).join('');
  lines.episodes = experience.map(co => co.role + ', ' + co.company + ' (' + co.period + ')');

  const educationBody = education.map(e => '<h3>' + esc(e.title) + '</h3><p class="meta">' + esc(e.school) + ' · ' + esc(e.period) + (e.extra ? ' · ' + esc(e.extra) : '') + '</p>' +
    ((e.chips || []).length ? '<p>' + e.chips.map(x => '<span class="chip">' + esc(x) + '</span>').join(' ') + '</p>' : '') + ((e.details || []).length ? '<ul>' + e.details.map(x => '<li><b>' + esc(x.label) + ':</b> ' + esc(x.text) + '</li>').join('') + '</ul>' : '')).join('');
  lines.education = education.map(e => e.title + ', ' + e.school + ' (' + e.period + ')');

  const githubBody = '<ul class="list">' + repos.map(r => '<li>' + link(r.u, r.n) + ' <span class="meta">' + esc(r.l) + (r.s ? ', ' + esc(r.s) + ' stars' : '') + '</span><br>' + esc(r.d) + '</li>').join('') + '</ul>';
  lines.github = repos.map(r => r.n + ' (' + r.l + '): ' + r.d);
  const skillsBody = '<ul class="tags">' + skills.map(s => '<li>' + esc(s.n) + '<small>' + esc(s.s) + '</small></li>').join('') + '</ul>';
  lines.skills = skills.map(s => s.n + ' (' + s.s + ')');
  const beyondBody = beyond.map(b => det(b.title, b.category, '<p>' + esc(b.blurb) + '</p>' + (b.backText ? '<p>' + esc(b.backText) + '</p>' : '') + (b.link && b.link.url ? '<p class="links">' + link(b.link.url, b.link.label || b.link.url) + '</p>' : ''))).join('');
  lines.beyond = beyond.map(b => b.title + ': ' + b.blurb);
  const extraBody = x => '<ul class="list">' + (x.items || []).map(it => '<li>' + (it.link && it.link.url ? link(it.link.url, it.title) : '<b>' + esc(it.title) + '</b>') + (it.tag || it.meta ? ' <span class="meta">' + [it.tag, it.meta].filter(Boolean).map(esc).join(', ') + '</span>' : '') + (it.text ? '<br>' + esc(it.text) : '') + '</li>').join('') + '</ul>';
  const aboutBody = (site.about.paragraphs || []).map(p => '<p>' + esc(p) + '</p>').join('') + ((site.about.facts || []).length ? '<dl class="facts">' + site.about.facts.map(f => '<dt>' + esc(f.label) + '</dt><dd>' + (f.url ? link(f.url, f.value) : esc(f.value)) + '</dd>').join('') + '</dl>' : '');
  lines.about = (site.about.paragraphs || []).slice();

  const DEFAULT_ORDER = ['projects', 'episodes', 'education', 'github', 'skills', 'beyond', 'about'];
  const SEC = {
    projects: { title: 'Projects', body: projectsBody }, episodes: { title: 'Experience', body: experienceBody }, education: { title: 'Education', body: educationBody },
    github: { title: 'On GitHub', body: repos.length ? githubBody : '' }, skills: { title: skills.length >= 3 ? 'Top ' + skills.length + ' skills' : 'Skills', body: skills.length ? skillsBody : '' },
    beyond: { title: 'Beyond work', body: beyondBody }, about: { title: 'About', body: aboutBody }
  };
  extraSections.forEach(x => { SEC[x.id] = { title: x.title, body: (x.items || []).length ? extraBody(x) : '' }; lines[x.id] = (x.items || []).map(it => it.title + (it.meta ? ' (' + it.meta + ')' : '')); });
  Object.keys(site.sections || {}).forEach(id => { if (SEC[id]) { if (site.sections[id].title) SEC[id].title = site.sections[id].title; if (site.sections[id].nav) SEC[id].nav = site.sections[id].nav; } });
  SEC.skills.title = core.fixTop(SEC.skills.title, skills.length).replace(/ in my toolkit$/i, ' skills');
  const chosen = site.sectionOrder || [];
  const ORDER = chosen.filter(id => SEC[id]).concat(DEFAULT_ORDER.concat(extraSections.map(x => x.id)).filter(id => !chosen.includes(id)));
  const present = ORDER.filter(id => SEC[id] && SEC[id].body);
  const names = Object.keys(PALETTE || {});
  const col = (i) => { const p = (PALETTE || {})[names[i % names.length]] || ['#333', '#777']; return '--c1:' + p[0] + ';--c2:' + p[1]; };

  const resume = site.resume.download || site.resume.view;
  const zones = present.concat(['contact']);
  const title = id => id === 'contact' ? (c.heading || 'Contact') : SEC[id].title;
  const navTitle = id => (site.sections && site.sections[id] && site.sections[id].nav) || title(id);
  const initials = site.name.split(/\s+/).map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase();
  const nameParts = site.name.split(/\s+/); const first = nameParts[0], rest = nameParts.slice(1).join(' ');

  // Projects as illustrated "files"
  const pjBody = p => {
    const links = [p.live && ['Live demo', p.live], p.src && ['Source', p.src], p.blog && ['Write-up', p.blog]].concat((p.extra || []).map(x => [x.l, x.u])).filter(Boolean).map(([n, u]) => link(u, n)).join(' · ');
    return '<p class="meta">' + esc(p.sub) + (p.badge ? ' · ' + esc(p.badge) : '') + '</p>' + row(LABELS.problem || 'The problem', p.problem) + row(LABELS.built || 'What I built', p.built) + row(LABELS.result || 'Result', p.result) + row(LABELS.stack || 'Built with', p.stack) + row(LABELS.role || 'My role', p.role) + row(LABELS.arch || 'Architecture', (p.arch || []).join(' → ')) + row(LABELS.diff || "What I'd do differently", p.diff) + (links ? '<p class="links">' + links + '</p>' : '');
  };
  const badges = Array.from(new Set(projects.map(p => p.badge).filter(Boolean)));
  const chips = badges.length >= 2 && badges.length <= 6 ? '<div class="chips js-only" role="group" aria-label="Filter"><button type="button" class="on" data-f="">All</button>' + badges.map(b => '<button type="button" data-f="' + esc(b) + '">' + esc(b) + '</button>').join('') + '</div>' : '';
  const cards = '<ul class="files">' + projects.map((p, i) => '<li class="file" data-b="' + esc(p.badge || '') + '" style="' + col(i + 1) + '"><details class="pj"><summary><span class="pic">' + (p.image ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">' : cardScene(p, i)) + '</span><span class="cap"><span class="k">' + esc(p.badge || p.sub || 'Project') + '</span><strong>' + esc(p.t) + '</strong><em>' + esc(p.stack || p.blurb || '') + '</em><span class="open">Open brief <i aria-hidden="true">+</i></span></span></summary><div class="in">' + pjBody(p) + '</div></details></li>').join('') + '</ul>';

  // Career as numbered rows with a verb tile, plus a stats card
  const tileWord = e => { const t = (e.tag || e.label || '').trim(); return (t && t.length <= 11 ? t : (e.title || '').split(/\s+/)[0]).toUpperCase(); };
  const tileHue = i => ['#1aa7c4,#0f7894', '#c4305e,#8a1d46', '#7b3fd0,#52279c', '#2f6be0,#1f48a8', '#d89a1a,#a8730e', '#17a77a,#0f7a58'][i % 6].split(',');
  let n = 0;
  const career = experience.map(co => '<div class="co"><div class="co-h"><h3>' + esc(co.company) + '</h3><p class="meta">' + [co.role, co.period, co.place].filter(Boolean).map(esc).join(' · ') + '</p></div><ol class="eps">' +
    co.episodes.map(e => { const h = tileHue(n++); const more = (e.situation || (e.did || []).length || e.stack);
      return '<li><details class="ep"' + (more ? '' : ' data-flat') + '><summary><span class="no">' + n + '</span><span class="tile" style="--a:' + h[0] + ';--b:' + h[1] + '">' + esc(tileWord(e)) + '</span><span class="tx"><strong>' + esc(e.title) + '</strong><span>' + esc(e.blurb) + '</span></span><span class="tg">' + esc(e.tag || e.label || '') + '</span>' + (more ? '<i class="chev" aria-hidden="true"></i>' : '') + '</summary>' +
        (more ? '<div class="in">' + row(LABELS.situation, e.situation) + ((e.did || []).length ? '<ul>' + e.did.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + (e.stack ? '<p class="meta">' + esc(LABELS.stack) + ': ' + esc(e.stack) + '</p>' : '') + '</div>' : '') + '</details></li>'; }).join('') + '</ol></div>').join('');
  const openBadge = (site.badges || []).find(b => /open to|available|hiring/i.test(b));
  const side = site.heroStats.length ? '<aside class="stat-card"><p class="eyebrow">Career stats</p><h3>In numbers</h3>' + site.heroStats.slice(0, 3).map(s => '<div><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></div>').join('') + (openBadge ? '<p class="open-now">' + esc(openBadge) + '</p>' : '') + '</aside>' : '';
  const careerBody = '<div class="career' + (side ? ' with-side' : '') + '"><div>' + career + '</div>' + side + '</div>';

  const skillsGrid = '<ul class="skillgrid">' + skills.map((s, i) => '<li style="' + col(i) + '"><strong>' + esc(s.n) + '</strong><span>' + esc(s.s) + '</span></li>').join('') + '</ul>';
  const contactBody = '<p class="big">' + esc(c.text || 'Let us build something.') + '</p><p><a class="btn pink" href="mailto:' + esc(c.email) + '">Email ' + esc(c.email) + '</a></p><p class="links">' + c.links.map(l => link(l.url, l.label)).join(' · ') + (resume ? (c.links.length ? ' · ' : '') + link(resume, 'Résumé') : '') + '</p>' +
    (c.phones.length ? '<p class="meta">' + c.phones.map(p => '<a href="tel:' + esc(p.number.replace(/[^+\d]/g, '')) + '">' + esc(p.label + ' ' + p.number) + '</a>').join(' · ') + '</p>' : '');

  const section = id => {
    const st = ' style="' + col(Math.max(0, zones.indexOf(id)) + 1) + '"', h = t => '<h2 id="h-' + esc(id) + '">' + esc(t) + '</h2>';
    const head2 = '<section class="band' + (id === 'about' ? ' profile' : '') + (id === 'contact' ? ' finale' : '') + '" id="' + esc(id) + '"' + st + ' aria-labelledby="h-' + esc(id) + '">';
    if (id === 'projects') return head2 + '<div class="wrap"><div class="band-h">' + h(title(id)) + chips + '</div>' + cards + '</div></section>';
    if (id === 'episodes') return head2 + '<div class="wrap">' + h(title(id)) + careerBody + '</div></section>';
    if (id === 'skills') return head2 + '<div class="wrap">' + h(title(id)) + skillsGrid + '</div></section>';
    if (id === 'contact') return head2 + '<div class="wrap">' + h(title(id)) + '<div class="body">' + contactBody + '</div></div></section>';
    return head2 + '<div class="wrap">' + h(title(id)) + '<div class="body">' + SEC[id].body + '</div></div></section>';
  };
  const links = zones.filter(id => id !== 'contact').map(id => '<a href="#' + esc(id) + '">' + esc(navTitle(id)) + '</a>').join('');
  const stats = site.heroStats.length ? '<div class="ticker"><ul>' + site.heroStats.map(s => '<li><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></li>').join('') + '</ul></div>' : '';
  const heroBtns = '<p class="btns"><a class="btn pink" href="#' + (present.includes('projects') ? 'projects' : zones[0]) + '"><i aria-hidden="true">&#9654;</i> Explore ' + esc((present.includes('projects') ? title('projects') : title(zones[0])).toLowerCase()) + '</a>' + (resume ? '<a class="btn ghost" href="' + esc(resume) + '">Download résumé</a>' : '') + '</p>';
  const textVersion = core.textVersion(d, { projects: SEC.projects.title, skills: SEC.skills.title });

  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' + core.headMeta(d, 'Portfolio') + '\n' +
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Cdefs%3E%3ClinearGradient id=%27g%27 x1=%270%27 y1=%270%27 x2=%270%27 y2=%271%27%3E%3Cstop offset=%270%27 stop-color=%27%23ff2e88%27/%3E%3Cstop offset=%271%27 stop-color=%27%23ff9a3c%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%2764%27 height=%2764%27 rx=%2714%27 fill=%27url(%23g)%27/%3E%3Ctext x=%2732%27 y=%2745%27 font-size=%2732%27 font-family=%27Arial,sans-serif%27 font-weight=%27900%27 font-style=%27italic%27 text-anchor=%27middle%27 fill=%27%2312061f%27%3E' + esc(initials) + '%3C/text%3E%3C/svg%3E">\n' +
    '<script>document.documentElement.className="js"</script>\n<link rel="stylesheet" href="style.css">\n' + core.jsonLd(d) + '\n</head>\n<body>\n<a class="skip" href="#main">Skip to content</a>\n' +
    '<nav class="top" aria-label="Sections"><a class="brand" href="#top"><i aria-hidden="true">' + esc(initials) + '</i><span>' + esc(site.name) + '</span></a><div class="links">' + links + '</div><details class="menu"><summary>Menu</summary><div>' + links + '</div></details><a class="btn ghost small" href="#contact">' + esc(title('contact')) + '</a></nav>\n' +
    '<header class="hero" id="top">' + heroScene() + '<div class="scrim" aria-hidden="true"></div>\n  <div class="inner"><p class="eyebrow">' + esc(site.role) + '</p><h1 aria-label="' + esc(site.name) + '"><span class="f">' + esc(first) + '</span>' + (rest ? ' <span class="l">' + esc(rest) + '</span>' : '') + '</h1><p class="lede">' + esc(site.tagline) + '</p>' + heroBtns + '</div></header>\n' + stats +
    '<main id="main">\n' + zones.map(section).join('\n') + '\n</main>\n<footer><div class="wrap"><p>' + esc(site.name) + ' · ' + esc(site.role) + (site.footerNote ? ' · ' + esc(site.footerNote) : '') + '</p>\n' + textVersion + '\n</div></footer>\n' +
    '<dialog id="dlg" aria-labelledby="dlg-t"><div class="dlg-bar"><h2 id="dlg-t"></h2><button type="button" class="dlg-x">Close</button></div><div class="dlg-body"></div></dialog>\n' +
    '<script src="script.js"></script>\n' + core.analyticsTags(d) + '\n</body>\n</html>\n';
}

module.exports = { id: 'neon-coast', files: ['style.css', 'script.js'], render, kindFor };
