// KAFE !N preview site: mobile menu, time-of-day greeting, menu chips, pickup toggle.
(function () {
  var body = document.body;
  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mnav');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    body.classList.toggle('nav-open', open);
    mnav.hidden = !open;
  }
  if (burger && mnav) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }
  document.querySelectorAll('.js-ar').forEach(function (b) {
    b.addEventListener('click', function () { toast('النسخة العربية جاية مع الموقع الكامل · Arabic comes with the full site'); });
  });

  // Time-of-day greeting (Cairo time)
  var g = document.querySelector('.js-greet');
  if (g) {
    var h = parseInt(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Africa/Cairo' }).format(new Date()), 10);
    g.textContent = h < 5 ? 'Up late, Korba?' : h < 12 ? 'Good morning, Korba.' : h < 17 ? 'Good afternoon, Korba.' : 'Good evening, Korba.';
  }

  // Menu chips: jump to a section and follow the scroll
  var jump = document.querySelector('.js-jump');
  if (jump) {
    var chips = Array.prototype.slice.call(jump.querySelectorAll('.chip'));
    var mark = function (id) {
      chips.forEach(function (c) {
        var on = c.getAttribute('href') === '#' + id;
        c.classList.toggle('on', on);
        if (on) { c.setAttribute('aria-current', 'true'); } else { c.removeAttribute('aria-current'); }
      });
    };
    var lock = 0;
    jump.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      lock = Date.now() + 1200;
      mark(c.getAttribute('href').slice(1));
      c.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
    var secs = chips.map(function (c) { return document.querySelector(c.getAttribute('href')); }).filter(Boolean);
    var spy = function () {
      if (Date.now() < lock) return;
      var cur = secs[0];
      secs.forEach(function (sec) { if (sec.getBoundingClientRect().top <= 180) cur = sec; });
      if (cur) mark(cur.id);
    };
    window.addEventListener('scroll', spy, { passive: true });
  }

  // Pickup / delivery toggle
  var note = document.querySelector('.js-mode-note');
  document.querySelectorAll('.js-mode').forEach(function (b, _, all) {
    b.addEventListener('click', function () {
      all.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      if (note) note.textContent = b.dataset.mode === 'pickup'
        ? 'Pickup from the counter, ready when you arrive.'
        : 'Delivery links go here once you choose an app. For now, pick up from either branch.';
    });
  });
})();
