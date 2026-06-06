/* Fenn marketing site — interactions (progressive enhancement) */
(function () {
  var docEl = document.documentElement;
  // CSS only hides .reveal / dims showcase copy under .js — so if this script
  // never runs, everything stays visible.
  docEl.classList.add('js');

  // Reveal instantly, with transitions disabled. Used for the no-/broken-IO
  // fallback so content can never get stuck behind an unfired observer or an
  // engine that doesn't commit opacity transitions.
  function revealAllInstant() {
    var all = document.querySelectorAll('.reveal');
    for (var i = 0; i < all.length; i++) {
      all[i].style.transition = 'none';
      all[i].classList.add('in');
    }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // ---- rotating crew word ----
    var words = [
      ['pickleball crew', 'var(--u-10)'],
      ['school mom', 'var(--u-14)'],
      ['soccer team', 'var(--u-07)'],
      ['book club', 'var(--u-13)'],
      ['running club', 'var(--u-03)'],
      ['ski trip', 'var(--u-11)'],
      ['climbing crew', 'var(--u-08)']
    ];
    var i = 0;
    var rot = document.getElementById('rotW');
    if (rot) {
      setInterval(function () {
        rot.style.opacity = '0';
        rot.style.transform = 'translateY(-6px)';
        setTimeout(function () {
          i = (i + 1) % words.length;
          rot.textContent = words[i][0];
          rot.style.color = words[i][1];
          rot.style.opacity = '1';
          rot.style.transform = 'translateY(0)';
        }, 360);
      }, 2300);
    }

    var ioOk = ('IntersectionObserver' in window);

    // ---- scroll reveals (enhancement; degrades to fully visible) ----
    var revs = document.querySelectorAll('.reveal');
    if (ioOk && revs.length) {
      var revGotCallback = false;
      var ro = new IntersectionObserver(function (entries) {
        revGotCallback = true; // a working observer always fires an initial callback
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revs.forEach(function (el) { ro.observe(el); });
      // If the observer never calls back (IO unsupported in practice), reveal all.
      setTimeout(function () {
        if (!revGotCallback) revealAllInstant();
      }, 1200);
    } else {
      revealAllInstant();
    }

    // ---- showcase sticky phone swap (enhancement) ----
    var steps = Array.prototype.slice.call(document.querySelectorAll('.sc-step'));
    var imgs = Array.prototype.slice.call(document.querySelectorAll('.sc-phone img'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.sc-dots i'));
    var stage = document.querySelector('.sc-stage');

    function setActive(idx) {
      steps.forEach(function (s, n) { s.classList.toggle('active', n === idx); });
      imgs.forEach(function (im, n) { im.classList.toggle('show', n === idx); });
      dots.forEach(function (d, n) { d.classList.toggle('on', n === idx); });
    }

    function showcaseFallback() {
      if (stage) stage.classList.add('sc-fallback'); // CSS makes all step copy readable, no transition
      setActive(0);
    }

    if (steps.length && ioOk) {
      setActive(0);
      var scGotCallback = false;
      var so = new IntersectionObserver(function (entries) {
        scGotCallback = true;
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var idx = steps.indexOf(e.target);
            if (idx > -1) setActive(idx);
          }
        });
      }, { threshold: 0.55, rootMargin: '-20% 0px -20% 0px' });
      steps.forEach(function (s) { so.observe(s); });
      // If the step observer never calls back, make every step's copy readable.
      setTimeout(function () {
        if (!scGotCallback) showcaseFallback();
      }, 1200);
    } else if (steps.length) {
      showcaseFallback();
    }
  });
})();
