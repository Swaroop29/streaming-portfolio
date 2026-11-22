// Shelves: open a card in a pop-up. Without this script every card already shows all of its text.
(function () {
  var pop = document.getElementById('pop');
  if (!pop || typeof pop.showModal !== 'function') { document.documentElement.className = ''; return; }
  var body = pop.querySelector('.body');
  function open(card) {
    var thumb = card.querySelector('.thumb');
    body.innerHTML = '<div class="pop-thumb" style="background:' + (thumb ? thumb.style.background : '') + '"></div><h3 id="pop-title"></h3><div class="pop-detail"></div>';
    body.querySelector('h3').textContent = card.querySelector('h3').textContent;
    body.querySelector('.pop-detail').innerHTML = card.querySelector('.detail').innerHTML;
    pop.showModal();
    pop.querySelector('.x').focus();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.card');
    if (a && !e.target.closest('a') && a.querySelector('.detail').textContent.trim()) open(a);
    if (e.target === pop || (e.target.closest && e.target.closest('.x'))) pop.close();
  });
  document.addEventListener('keydown', function (e) {
    var a = e.target.closest && e.target.closest('.card');
    if (a && (e.key === 'Enter' || e.key === ' ') && a.querySelector('.detail').textContent.trim()) { e.preventDefault(); open(a); }
  });
  // Highlight the section in view in the side menu.
  var links = [].slice.call(document.querySelectorAll('.rail .links a'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + en.target.id); }); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    [].slice.call(document.querySelectorAll('header.hero, .shelf')).forEach(function (s) { io.observe(s); });
  }
})();
