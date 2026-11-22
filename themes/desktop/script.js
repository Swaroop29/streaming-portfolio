// Desktop: open, drag, resize and close windows; a small terminal. Without this script every window is a readable section.
(function () {
  try {
    var root = document.documentElement, z = 10, placed = 0;
    var data = JSON.parse(document.getElementById('desk-data').textContent);
    var wins = {};
    [].forEach.call(document.querySelectorAll('.win'), function (w) { wins[w.id] = w; });
    var area = document.querySelector('.windows');
    var phone = function () { return window.matchMedia('(max-width: 760px)').matches; };

    function front(w) {
      [].forEach.call(document.querySelectorAll('.win.on'), function (x) { x.classList.remove('on'); });
      w.classList.add('on'); w.style.zIndex = ++z;
    }
    function base() { var ic = document.querySelector('.icons'); return Math.round(ic.getBoundingClientRect().right - area.getBoundingClientRect().left) + 16; }
    function place(w) {
      var r = area.getBoundingClientRect(), x = base() + (placed % 6) * 34, y = 24 + (placed % 6) * 34;
      placed++;
      w.style.left = Math.max(8, Math.min(x, r.width - w.offsetWidth - 8)) + 'px';
      w.style.top = Math.max(8, Math.min(y, r.height - 120)) + 'px';
      w.dataset.placed = '1';
    }
    function open(id) {
      var w = wins[id]; if (!w) return;
      if (!w.classList.contains('open')) { w.classList.add('open'); if (!phone() && !w.dataset.placed) place(w); }
      front(w);
      if (id === 'terminal') { var i = w.querySelector('input'); if (i) i.focus(); }
      else { w.setAttribute('tabindex', '-1'); w.focus({ preventScroll: true }); }
    }
    function close(w) { w.classList.remove('open', 'on', 'max'); var ic = document.querySelector('.icon[data-open="' + w.id + '"]'); if (ic) ic.focus(); }

    // Icons and window buttons
    document.addEventListener('click', function (e) {
      var ic = e.target.closest('.icon[data-open]');
      if (ic) { e.preventDefault(); open(ic.getAttribute('data-open')); return; }
      var w = e.target.closest('.win');
      if (!w) return;
      if (e.target.closest('.close')) close(w);
      else if (e.target.closest('.grow')) { w.classList.toggle('max'); front(w); }
      else front(w);
    });
    document.addEventListener('keydown', function (e) {
      var w = e.target.closest && e.target.closest('.win');
      if (e.key === 'Escape' && w) close(w);
    });

    // Dragging by the title bar (mouse, touch and pen)
    var drag = null;
    document.addEventListener('pointerdown', function (e) {
      var bar = e.target.closest('.bar');
      if (!bar || e.target.closest('button') || phone()) return;
      var w = bar.parentNode; if (w.classList.contains('max')) return;
      front(w);
      drag = { w: w, dx: e.clientX - w.offsetLeft, dy: e.clientY - w.offsetTop };
      bar.setPointerCapture(e.pointerId); e.preventDefault();
    });
    document.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var r = area.getBoundingClientRect();
      drag.w.style.left = Math.max(60 - drag.w.offsetWidth, Math.min(e.clientX - drag.dx, r.width - 60)) + 'px';
      drag.w.style.top = Math.max(0, Math.min(e.clientY - drag.dy, r.height - 40)) + 'px';
    });
    document.addEventListener('pointerup', function () { drag = null; });

    // Terminal
    var tw = wins.terminal, out = tw.querySelector('.out'), input = tw.querySelector('input'), history = [], hi = 0;
    function say(t, cls) { var p = document.createElement('p'); if (cls) p.className = cls; p.textContent = t; out.appendChild(p); tw.querySelector('.pane').scrollTop = 1e6; }
    var ids = Object.keys(data.titles);
    function run(cmd) {
      var parts = cmd.trim().split(/\s+/), c = (parts[0] || '').toLowerCase(), arg = (parts[1] || '').toLowerCase();
      if (!c) return;
      if (c === 'help') { say('help, ls, open <name>, cat <name>, whoami, clear'); say('names: ' + ids.join(', ')); }
      else if (c === 'ls') say(ids.map(function (id) { return id + '/  (' + data.titles[id] + ')'; }).join('\n'));
      else if (c === 'whoami') { say(data.name + ', ' + data.role); say(data.tagline); }
      else if (c === 'clear') out.textContent = '';
      else if (c === 'open') { if (wins[arg] && arg !== 'terminal') { open(arg); tw.classList.add('on'); input.focus(); say('opened ' + arg); } else say('open: no window called "' + (arg || '') + '". Try ls.', 'err'); }
      else if (c === 'cat' || ids.indexOf(c) > -1) {
        var id = c === 'cat' ? arg : c, L = data.lines[id];
        if (L && L.length) L.forEach(function (l) { say('- ' + l); }); else say('cat: nothing to show for "' + (id || '') + '". Try ls.', 'err');
      } else say('command not found: ' + c + '. Type help.', 'err');
    }
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var v = input.value; say('$ ' + v, 'cmd'); if (v.trim()) { history.push(v); hi = history.length; } run(v); input.value = ''; }
      else if (e.key === 'ArrowUp' && history.length) { hi = Math.max(0, hi - 1); input.value = history[hi]; e.preventDefault(); }
      else if (e.key === 'ArrowDown' && history.length) { hi = Math.min(history.length, hi + 1); input.value = history[hi] || ''; e.preventDefault(); }
    });
    say('Type help to see what this terminal can do.');

    // Clock
    var clock = document.querySelector('.clock');
    function tick() { if (clock) clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    tick(); setInterval(tick, 30000);

    // Start: the welcome window, and the first folder on bigger screens
    var hash = location.hash.slice(1);
    open('welcome');
    if (hash && wins[hash] && hash !== 'welcome') open(hash);
    else if (!phone()) { var first = document.querySelectorAll('.icon[data-open]')[1]; if (first && first.getAttribute('data-open') !== 'terminal') open(first.getAttribute('data-open')); }
    var wl = wins.welcome; if (wl) { wl.style.left = base() + 'px'; wl.style.top = '24px'; wl.dataset.placed = '1'; placed = 1; front(wl); }
    if (!phone()) { var f = document.querySelector('.win.open:not(#welcome)'); if (f) front(f); }
  } catch (err) { document.documentElement.className = ''; if (window.console) console.warn('Desktop theme fell back to plain sections:', err); }
})();
