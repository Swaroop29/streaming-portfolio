const E = v => String(v == null ? "" : v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tp = document.getElementById('t-projects');
projects.forEach((p, i) => {
  const b = document.createElement('button');
  b.className = 'card'; b.setAttribute('aria-label', 'Open ' + p.t);
  b.innerHTML = '<div class="art" style="background:' + p.g + '"></div><div class="no">0' + (i + 1) + '</div>' +
    (p.badge ? '<div class="badge">' + E(p.badge) + '</div>' : '') +
    '<div class="label"><b>' + E(p.t) + '</b><span>' + E(p.sub) + '</span></div>' +
    '<div class="hov"><p>' + E(p.blurb) + '</p><div class="tg">' + (p.tags || []).map(t => '<i>' + E(t) + '</i>').join('') + '</div></div>';
  b.addEventListener('click', () => openModal(i));
  tp.appendChild(b);
});
const tr0 = document.getElementById('t-repos');
repos.forEach(r => {
  const a = document.createElement('a'); a.className = 'repo'; a.href = r.u; a.target = '_blank'; a.rel = 'noopener';
  a.innerHTML = '<b>' + E(r.n) + '</b><p>' + E(r.d) + '</p><div class="m"><i style="--c:' + E(r.c) + '">' + E(r.l) + '</i><span>&#9733; ' + E(r.s) + '</span></div>';
  tr0.appendChild(a);
});
const ts = document.getElementById('t-skills');
skills.forEach((k, i) => {
  const d = document.createElement('div');
  d.className = 'card'; d.style.cursor = 'default';
  d.innerHTML = '<div class="big">' + (i + 1) + '</div><div class="tile" style="background:' + k.g + '"><b>' + k.n + '</b><span>' + k.s + '</span></div>';
  ts.appendChild(d);
});

document.querySelectorAll('.track-wrap').forEach(w => {
  const tr = w.querySelector('.track');
  w.querySelector('.l').addEventListener('click', () => tr.scrollBy({ left: -tr.clientWidth * .8, behavior: 'smooth' }));
  w.querySelector('.r').addEventListener('click', () => tr.scrollBy({ left: tr.clientWidth * .8, behavior: 'smooth' }));
});


document.querySelectorAll('.ep').forEach(ep => {
  const toggle = () => ep.setAttribute('aria-expanded', ep.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  ep.addEventListener('click', toggle);
  ep.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});

document.querySelectorAll('.bey').forEach(c => {
  const flip = () => { const on = c.classList.toggle('flip'); c.setAttribute('aria-pressed', on); };
  c.addEventListener('click', e => { if (e.target.closest('a')) return; flip(); });
  c.addEventListener('keydown', e => { if (e.target.closest('a')) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
});

/* mailto links do not open from inside a sandboxed frame, so use Gmail compose there */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="mailto:"]');
  if (!a) return;
  let framed = false; try { framed = window.self !== window.top; } catch (x) { framed = true; }
  if (!framed) return;
  e.preventDefault();
  const u = new URL(a.getAttribute('href').replace(/&amp;/g, '&'));
  const q = new URLSearchParams(u.search);
  const g = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(u.pathname)
    + '&su=' + encodeURIComponent(q.get('subject') || '') + '&body=' + encodeURIComponent(q.get('body') || '');
  window.open(g, '_blank', 'noopener');
}, true);


/* keyboard shortcuts */
(function () {
  const kb = document.getElementById('kb');
  const open = () => { kb.hidden = false; document.getElementById('kb-close').focus(); };
  const close = () => { kb.hidden = true; };
  document.getElementById('kb-open').addEventListener('click', open);
  document.getElementById('kb-close').addEventListener('click', close);
  kb.addEventListener('click', e => { if (e.target === kb) close(); });
  document.getElementById('print-open').addEventListener('click', () => window.print());
  const go = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
  const map = { h: 'home', w: 'projects', e: 'episodes', s: 'skills', a: 'about', c: 'contact' };
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    if (e.key === 'Escape') { if (!kb.hidden) close(); return; }
    const picker = document.getElementById('picker'); if (picker && !picker.classList.contains('gone')) return;
    const k = e.key.toLowerCase();
    if (e.key === '?') { kb.hidden ? open() : close(); return; }
    if (map[k]) { go(map[k]); return; }
    if (k === 'p') { window.print(); }
  });
})();


/* education timeline reveal */
(function () {
  const e = document.getElementById('edu'); if (!e) return;
  if (!('IntersectionObserver' in window)) { e.classList.add('go'); return; }
  const io = new IntersectionObserver(en => { if (en[0].isIntersecting) { e.classList.add('go'); io.disconnect(); } }, { threshold: .35 });
  io.observe(e);
})();

/* education stops */
(function () {
  const stops = document.querySelectorAll('.tl .stop');
  const tog = el => { const o = !el.classList.contains('open'); el.classList.toggle('open', o); el.setAttribute('aria-expanded', o); };
  stops.forEach(el => {
    el.addEventListener('click', () => tog(el));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tog(el); } });
  });
  const e = document.getElementById('edu');
  if (e) new MutationObserver(() => { if (e.classList.contains('go') && !e.dataset.peek) { e.dataset.peek = 1; setTimeout(() => { if (stops[1] && !document.querySelector('.tl .stop.open')) tog(stops[1]); }, 2600); } }).observe(e, { attributes: true, attributeFilter: ['class'] });
})();

/* copy buttons */
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.copy'); if (!b) return;
  e.stopPropagation();
  const v = b.dataset.copy, done = () => { const o = b.textContent; b.textContent = 'Copied!'; setTimeout(() => { b.textContent = 'Copy ID'; }, 1600); };
  const old = () => { const t = document.createElement('textarea'); t.value = v; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (x) {} t.remove(); done(); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, old); else old();
}, true);
const modal = document.getElementById('modal');
let lastFocus = null;
function openModal(i) {
  const p = projects[i]; lastFocus = document.activeElement;
  document.getElementById('m-hero').style.background = p.g;
  const lv = document.getElementById('m-live'), sc = document.getElementById('m-src');
  lv.style.display = p.live ? '' : 'none'; sc.style.display = p.src ? '' : 'none'; if (p.live) lv.href = p.live; if (p.src) sc.href = p.src;
  const bl = document.getElementById('m-blog'); bl.style.display = p.blog ? '' : 'none'; if (p.blog) bl.href = p.blog;
  const ml = document.getElementById('m-links');
  ml.querySelectorAll('.xl').forEach(n => n.remove());
  (p.extra || []).forEach(x => { const a = document.createElement('a'); a.className = 'b info xl'; a.target = '_blank'; a.rel = 'noopener'; a.href = x.u; a.textContent = x.l; ml.appendChild(a); });
  ml.style.display = (p.live || p.src || p.blog || (p.extra && p.extra.length)) ? '' : 'none';
  document.getElementById('m-title').textContent = p.t;
  const L = Object.assign({ problem: 'The problem', built: 'What I built', arch: 'Architecture', diff: "What I'd do differently", result: 'Result', stack: 'Built with', role: 'My role' }, site.labels || {});
  const show = (id, on) => { const el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; };
  const setText = (id, label, v) => { const el = document.getElementById(id); el.textContent = v ? (label ? label + ': ' : '') + v : ''; el.style.display = v ? '' : 'none'; };
  setText('m-problem', L.problem, p.problem); setText('m-built', L.built, p.built);
  [['result', p.result], ['stack', p.stack], ['role', p.role]].forEach(([k, v]) => {
    document.getElementById('m-' + k + '-l').textContent = L[k]; document.getElementById('m-' + k).textContent = v || '';
    show('m-' + k + '-l', v); show('m-' + k, v);
  });
  document.getElementById('m-diff-l').textContent = L.diff; document.getElementById('m-diff').textContent = p.diff || '';
  show('m-diff-l', p.diff); show('m-diff', p.diff);
  document.getElementById('m-arch-l').textContent = L.arch;
  document.getElementById('m-arch').innerHTML = (p.arch || []).map(a => '<span>' + E(a) + '</span>').join('<em>&rarr;</em>');
  show('m-arch-l', (p.arch || []).length); show('m-arch', (p.arch || []).length);
  modal.classList.add('open'); document.getElementById('m-x').focus();
}
function closeModal() { modal.classList.remove('open'); if (lastFocus) lastFocus.focus(); }
document.getElementById('m-x').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

const PN = site.profileNames || {};
const profiles = {
  recruiter: { n: PN.recruiter || 'Recruiter', i: 'R', c: '#e5231b', tag: site.profileTaglines.recruiter },
  manager:   { n: PN.manager || 'Manager',   i: 'M', c: '#2b6be5', tag: site.profileTaglines.manager },
  engineer:  { n: PN.engineer || 'Engineer',  i: 'E', c: '#12a37f', tag: site.profileTaglines.engineer },
  guest:     { n: PN.guest || 'Guest',     i: 'G', c: '#d9a21b', tag: site.profileTaglines.guest }
};
function pick(id) {
  const p = profiles[id];
  document.body.style.overflow = '';
  document.getElementById('tag').textContent = p.tag;
  document.getElementById('who-n').textContent = p.n;
  const src = document.querySelector('.profile[data-id="' + id + '"] img').src; document.querySelector('#who-i img').src = src; whoTint(id);
  document.getElementById('picker').classList.add('gone');
  window.scrollTo(0, 0);
}
document.querySelectorAll('.profile').forEach(b => b.addEventListener('click', () => pick(b.dataset.id)));
document.getElementById('who').addEventListener('click', () => { document.getElementById('picker').classList.remove('gone'); document.body.style.overflow = 'hidden'; });
const TINT = { recruiter: '#e5231b', manager: '#2563eb', engineer: '#12a37a', guest: '#e8b923' };
function whoTint(id) { document.getElementById('who-i').style.background = TINT[id] || '#1b1b1f'; }
document.querySelector('#who-i img').src = document.querySelector('.profile[data-id="guest"] img').src;
whoTint('guest');


// 3D tilt that follows the pointer
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.profile').forEach(b => {
    const av = b.querySelector('.av');
    b.addEventListener('pointermove', e => {
      const r = av.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      av.style.setProperty('--ry', (x * 16).toFixed(1) + 'deg');
      av.style.setProperty('--rx', (-y * 14).toFixed(1) + 'deg');
    });
    b.addEventListener('pointerleave', () => { av.style.setProperty('--rx', '0deg'); av.style.setProperty('--ry', '0deg'); });
  });
}

document.body.style.overflow = 'hidden';
// poster wall
(function () {
  const wall = document.getElementById('wall');
  const grads = ['linear-gradient(160deg,#7a1410,#e5231b)','linear-gradient(160deg,#14307a,#2b6be5)','linear-gradient(160deg,#0b4d3d,#12a37f)','linear-gradient(160deg,#4a1a7a,#9b5be5)','linear-gradient(160deg,#7a4a08,#e8a21b)','linear-gradient(160deg,#6a1040,#e5489b)','linear-gradient(160deg,#0f4a66,#1fb5e0)','linear-gradient(160deg,#2a2a33,#6b6b7a)'];
  let items = (site.ticker || []).filter(Boolean);
  if (!items.length) items = projects.map(p => [p.t, 'FEATURED']).concat(skills.map(k => [k.n, 'SKILL']), experience.map(c => [c.company, 'EXPERIENCE']));
  if (!items.length) items = [[site.name, 'NOW STREAMING'], [site.role, 'ROLE']];
  for (let r = 0; r < 7; r++) {
    const row = document.createElement('div');
    row.className = 'wrow' + (r % 2 ? ' rev' : '') + (r % 3 === 0 ? ' slow' : '');
    let html = '';
    for (let rep = 0; rep < 2; rep++) {
      for (let i = 0; i < items.length; i++) {
        const it = items[(i + r * 5) % items.length];
        html += '<div class="tile" data-n="' + (((i + r * 3) % 9) + 1) + '" style="background:' + grads[(i * 3 + r * 2) % grads.length] + '"><small>' + E(it[1]) + '</small><b>' + E(it[0]) + '</b></div>';
      }
    }
    row.innerHTML = html;
    wall.appendChild(row);
  }
})();

// opening animation (matches the app-launch sequence: first letter alone, then the word wipes out from it)
(function () {
  const intro = document.getElementById('intro');
  const reveal = intro.querySelector('.reveal');
  const name = intro.querySelector('.i-name');
  // ---- ribbon pieces: polygons in the letter's ink box (0..1 x, 0..1 y); tone D dark, M mid, B bright
  const D = '#8a040b', M = '#bd0710', B = '#ff1b25', X = '#a30610';
  const PIECES = {
    S: [[B, [[-.1, -.1], [1.1, -.1], [1.1, .30], [-.1, .44]]], [M, [[-.1, .42], [1.1, .28], [1.1, .60], [-.1, .74]]], [D, [[-.1, .72], [1.1, .58], [1.1, 1.1], [-.1, 1.1]]], [X, [[-.1, .42], [.30, .385], [-.1, .60]]]],
    W: [[D, [[-.1, -.1], [.27, -.1], [.36, 1.1], [-.1, 1.1]]], [B, [[.25, -.1], [.52, -.1], [.50, 1.1], [.34, 1.1]]], [M, [[.50, -.1], [.76, -.1], [.68, 1.1], [.48, 1.1]]], [B, [[.74, -.1], [1.1, -.1], [1.1, 1.1], [.66, 1.1]]], [X, [[.34, 1.1], [.50, 1.1], [.42, .72]]]],
    A: [[D, [[-.1, -.1], [.50, -.1], [.50, 1.1], [-.1, 1.1]]], [B, [[.48, -.1], [1.1, -.1], [1.1, 1.1], [.48, 1.1]]], [M, [[.22, -.1], [.78, -.1], [.50, .36]]], [X, [[-.1, .56], [1.1, .56], [1.1, .74], [-.1, .74]]]],
    R: [[D, [[-.1, -.1], [.38, -.1], [.38, 1.1], [-.1, 1.1]]], [B, [[.36, -.1], [1.1, -.1], [1.1, .52], [.36, .58]]], [M, [[.36, .56], [1.1, .50], [1.1, 1.1], [.36, 1.1]]], [X, [[.36, .30], [.62, .30], [.36, .56]]]],
    O: [[D, [[-.1, -.1], [.52, -.1], [.46, 1.1], [-.1, 1.1]]], [M, [[.50, -.1], [1.1, -.1], [1.1, 1.1], [.44, 1.1]]], [B, [[.12, -.1], [.88, -.1], [.78, .26], [.22, .26]]], [X, [[.12, 1.1], [.88, 1.1], [.78, .74], [.22, .74]]]],
    P: [[D, [[-.1, -.1], [.38, -.1], [.38, 1.1], [-.1, 1.1]]], [B, [[.36, -.1], [1.1, -.1], [1.1, .70], [.36, .76]]], [X, [[.36, .50], [.66, .50], [.36, .78]]]]
  };
  function buildRibbon() {
    const cv = document.createElement('canvas').getContext('2d');
    [...name.children].forEach(sp => {
      const b = sp.firstElementChild, ch = b.dataset.c;
      b.querySelectorAll('i.pc, i.sh').forEach(n => n.remove());
      const cs = getComputedStyle(b);
      const fs = 100;
      cv.font = '700 ' + fs + 'px ' + cs.fontFamily;
      const m = cv.measureText(ch);
      const lh = 1.05 * fs;
      const fa = m.fontBoundingBoxAscent || fs * .9, fd = m.fontBoundingBoxDescent || fs * .25;
      const base = (lh - (fa + fd)) / 2 + fa;
      const L = -m.actualBoundingBoxLeft, Rr = m.actualBoundingBoxRight;
      const T = base - m.actualBoundingBoxAscent, Bt = base + m.actualBoundingBoxDescent;
      (PIECES[ch] || []).forEach(pc => {
        const poly = pc[1].map(q => ((L + q[0] * (Rr - L)) / fs).toFixed(4) + 'em ' + ((T + q[1] * (Bt - T)) / fs).toFixed(4) + 'em').join(',');
        const el = document.createElement('i');
        el.className = 'pc'; el.setAttribute('aria-hidden', 'true');
        el.style.color = pc[0]; el.style.clipPath = 'polygon(' + poly + ')'; el.textContent = ch;
        b.appendChild(el);
      });
      const sh = document.createElement('i'); sh.className = 'sh'; sh.setAttribute('aria-hidden', 'true'); sh.textContent = ch; b.appendChild(sh);
    });
  }
  buildRibbon();
  if (document.fonts && document.fonts.load) document.fonts.load('700 100px Oswald').then(buildRibbon).catch(() => {});

  let runs = [], token = 0, timer;
  const jingle = new Audio('assets/jingle.mp3');
  jingle.preload = 'auto'; jingle.volume = .8;
  function sound() { try { jingle.currentTime = 0; const r = jingle.play(); if (r && r.catch) r.catch(() => {}); } catch (e) {} }
  function hush() { try { const v = jingle.volume; const f = setInterval(() => { jingle.volume = Math.max(0, jingle.volume - .15); if (jingle.volume <= 0) { clearInterval(f); jingle.pause(); jingle.volume = .8; } }, 30); } catch (e) {} }
  function stopRuns() { runs.forEach(a => a.cancel && a.cancel()); runs = []; }
  function end() { stopRuns(); clearTimeout(timer); intro.classList.remove('play', 'skipping'); intro.style.opacity = ''; }
  async function play() {
    const my = ++token;
    stopRuns(); clearTimeout(timer);
    intro.classList.remove('skipping', 'play'); void intro.offsetWidth; intro.classList.add('play');
    reveal.style.visibility = 'hidden'; reveal.style.width = '';
    try { await Promise.race([document.fonts.load('700 100px Oswald'), new Promise(r => setTimeout(r, 500))]); } catch (e) {}
    if (my !== token) return;
    const full = name.scrollWidth;
    const first = name.firstElementChild.getBoundingClientRect().width;
    reveal.style.width = first + 'px';
    reveal.style.visibility = 'visible';
    sound();
    if (!reveal.animate) { reveal.style.width = ''; timer = setTimeout(end, 2300); return; }
    runs.push(reveal.animate([{ width: first + 'px', offset: 0 }, { width: first + 'px', offset: .16 }, { width: full + 'px', offset: 1 }], { duration: 1150, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' }));
    name.style.setProperty('--W', full + 'px');
    const letters = [...name.children];
    letters.forEach((sp, i) => {
      const frac = (sp.offsetLeft - name.offsetLeft + sp.offsetWidth * .2) / full;
      const delay = i === 0 ? 120 : Math.max(0, 1150 * (.1 + .8 * frac) - 200);
      sp.style.setProperty('--fd', delay + 'ms');
      sp.style.setProperty('--off', -(sp.offsetLeft - name.offsetLeft) + 'px');
    });
    runs.push(intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, delay: 2200, fill: 'forwards' }));
    timer = setTimeout(() => { if (my === token) end(); }, 2700);
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { end(); }
  else { play(); }
  intro.addEventListener('click', () => { hush(); token++; stopRuns(); clearTimeout(timer); intro.classList.add('skipping'); timer = setTimeout(end, 300); });
  document.getElementById('replay').addEventListener('click', play);
})();

// highlight the current section in the phone tab bar
(function () {
  const links = [...document.querySelectorAll('#tabbar a')];
  const secs = links.map(l => document.getElementById(l.dataset.s));
  function spy() {
    let cur = 0;
    secs.forEach((el, i) => { if (el && el.getBoundingClientRect().top < innerHeight * .45) cur = i; });
    links.forEach((l, i) => l.classList.toggle('on', i === cur));
  }
  addEventListener('scroll', spy, { passive: true }); spy();
})();
const navEl = document.getElementById('top');
const onScroll = () => navEl.classList.toggle('solid', window.scrollY > 40);
window.addEventListener('scroll', onScroll); onScroll();
