/* Visitor analytics. Privacy-friendly: no cookies, no personal data, nothing that identifies a person.
   Sends named events to GoatCounter, which is already installed. Page views, country, device, browser,
   screen size and referrer are recorded by GoatCounter itself; this file adds what visitors DO. */
(function () {
  var queue = [];
  var log = (window.analyticsLog = []); // visible in the browser console and used by the tests

  function send(item) {
    try {
      window.goatcounter.count({ path: 'event/' + item.name, title: item.title || item.name, event: true });
    } catch (e) { /* analytics must never break the page */ }
  }
  function ready() { return window.goatcounter && typeof window.goatcounter.count === 'function'; }
  function flush() { while (queue.length && ready()) send(queue.shift()); }

  function track(name, title) {
    name = String(name).toLowerCase().replace(/[^a-z0-9/_\-.]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
    var item = { name: name, title: title || name };
    log.push(item.name);
    if (ready()) send(item); else queue.push(item);
  }
  window.track = track;

  // GoatCounter loads asynchronously, so hold events until it is ready.
  var tries = 0;
  var timer = setInterval(function () { flush(); if ((!queue.length && ready()) || ++tries > 40) clearInterval(timer); }, 500);

  var text = function (el) { return (el && (el.getAttribute('aria-label') || el.textContent) || '').replace(/\s+/g, ' ').trim(); };

  document.addEventListener('click', function (e) {
    var t = e.target;
    var profile = t.closest('.profile');
    if (profile) return track('profile/' + profile.dataset.id, 'Chose profile: ' + profile.dataset.id);
    if (t.closest('#replay')) return track('intro/replay', 'Replayed intro');

    var card = t.closest('#t-projects .card');
    if (card) return track('project/' + text(card.querySelector('.label b')), 'Opened project: ' + text(card.querySelector('.label b')));

    var mlink = t.closest('#m-links a, #modal a.xl');
    if (mlink) return track('project-link/' + text(mlink), 'Project link: ' + text(mlink));

    var repo = t.closest('#t-repos a');
    if (repo) return track('repo/' + text(repo.querySelector('b')), 'GitHub repo: ' + text(repo.querySelector('b')));

    var a = t.closest('a[href]');
    if (a) {
      var href = a.getAttribute('href');
      if (/^mailto:/.test(href)) return track('contact/email', 'Clicked email');
      if (/^tel:/.test(href)) return track('contact/phone', 'Clicked phone number');
      if (/linkedin\.com/.test(href)) return track('contact/linkedin', 'Clicked LinkedIn');
      if (/github\.com\/[^/]+\/?$/.test(href)) return track('contact/github', 'Clicked GitHub profile');
      if (a.dataset.track === 'resume') return track(a.hasAttribute('download') ? 'resume/download' : 'resume/view', a.hasAttribute('download') ? 'Downloaded resume' : 'Viewed resume');
      if (/^https?:/.test(href) && a.host !== location.host) return track('outbound/' + a.host, 'Outbound link: ' + a.host);
    }

    var bey = t.closest('.bey');
    if (bey) return track('card-flip/' + text(bey.querySelector('.bf.front b, .bf.front h3, .bf.front')).slice(0, 40), 'Flipped card');

    if (t.closest('#who')) return track('profile/switch', 'Opened profile picker again');
    if (t.closest('#kb-open')) return track('shortcuts/open', 'Opened keyboard shortcuts');
    if (t.closest('.ep')) return track('timeline/' + text(t.closest('.ep').querySelector('h3, b')).slice(0, 40), 'Opened an experience entry');
    if (t.closest('.track-wrap .l, .track-wrap .r')) return track('row/scroll', 'Used a row arrow');
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key.toLowerCase();
    if ('hwesacp?'.indexOf(k) > -1 && k.length === 1) track('shortcut/' + (k === '?' ? 'help' : k), 'Keyboard shortcut: ' + k);
  });

  // Which sections people actually reach, and how far down they scroll.
  if ('IntersectionObserver' in window) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !seen[en.target.id]) { seen[en.target.id] = 1; track('section/' + en.target.id, 'Viewed section: ' + en.target.id); }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('section[id]').forEach(function (el) { io.observe(el); });
  }
  var depths = { 25: 0, 50: 0, 75: 0, 100: 0 };
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    var pct = Math.round((window.scrollY / h) * 100);
    [25, 50, 75, 100].forEach(function (d) { if (pct >= d - (d === 100 ? 2 : 0) && !depths[d]) { depths[d] = 1; track('scroll/' + d + 'pct', 'Scrolled ' + d + '%'); } });
  }, { passive: true });

  // Rough time on page, counted only while the tab is visible.
  var secs = 0, marks = { 15: 1, 30: 1, 60: 1, 120: 1, 300: 1 };
  setInterval(function () {
    if (document.visibilityState !== 'visible') return;
    secs += 5;
    if (marks[secs]) track('time/' + secs + 's', 'Stayed ' + secs + ' seconds');
  }, 5000);

  // Real visitors' errors: shows problems that tests on our machines cannot see.
  window.addEventListener('error', function (e) { track('js-error/' + String(e.message || 'unknown').slice(0, 60), 'JavaScript error'); });
  window.addEventListener('unhandledrejection', function () { track('js-error/unhandled-promise', 'JavaScript error'); });

  // Where the visit came from and what kind of screen it is, in plain labels.
  var w = window.innerWidth;
  track('screen/' + (w < 600 ? 'phone' : w < 1100 ? 'tablet' : 'desktop'), 'Screen size class');
  var ref = document.referrer ? new URL(document.referrer).hostname : 'direct';
  if (ref !== location.hostname) track('referrer/' + ref, 'Came from: ' + ref);
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) track('setting/reduced-motion', 'Prefers reduced motion');
})();
