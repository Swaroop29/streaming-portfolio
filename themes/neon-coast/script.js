// Neon Coast: hero arrival, project filter, project dialog. The page is complete without this script.
(function () {
  try {
    var root = document.documentElement, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) { root.classList.add('anim'); requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('go'); }); }); }

    var chips = document.querySelector('.chips');
    if (chips) chips.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      [].forEach.call(chips.querySelectorAll('button'), function (x) { x.classList.toggle('on', x === b); });
      var f = b.getAttribute('data-f');
      [].forEach.call(document.querySelectorAll('.file'), function (li) { li.hidden = !!f && li.getAttribute('data-b') !== f; });
    });

    var dlg = document.getElementById('dlg');
    if (dlg && typeof dlg.showModal === 'function') {
      var t = document.getElementById('dlg-t'), body = dlg.querySelector('.dlg-body');
      document.addEventListener('click', function (e) {
        var sum = e.target.closest('.file summary'); if (!sum) return;
        e.preventDefault(); var li = sum.closest('.file'), d = sum.parentNode;
        t.textContent = sum.querySelector('strong').textContent; body.innerHTML = d.querySelector('.in').innerHTML;
        dlg.style.setProperty('--c2', li.style.getPropertyValue('--c2')); dlg.showModal(); body.scrollTop = 0;
      });
      dlg.querySelector('.dlg-x').addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    }

    var menu = document.querySelector('.menu');
    if (menu) document.addEventListener('click', function (e) { if (menu.open && (!e.target.closest('.menu') || e.target.closest('.menu a'))) menu.open = false; });
  } catch (err) { if (window.console) console.warn('Neon Coast script skipped:', err); }
})();
