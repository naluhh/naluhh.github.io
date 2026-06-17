/* Fenn hero — animated chat thread (progressive enhancement) */
(function () {
  var phone = document.getElementById('heroPhone');
  if (!phone) return;
  var body = phone.querySelector('.chat-body');
  var track = phone.querySelector('.chat-track');
  if (!track || !body) return;
  var msgs = Array.prototype.slice.call(track.querySelectorAll('.msg'));
  if (!msgs.length) return;

  // Reduced-motion users keep the full, static thread.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // Arm: hide all messages (CSS only hides under .js + motion).
  track.classList.add('armed');

  function typingEl(isFenn) {
    var w = document.createElement('div');
    w.className = 'tbubble' + (isFenn ? ' fenn' : ' them');
    var dots = '<div class="dots"><span></span><span></span><span></span></div>';
    w.innerHTML = isFenn
      ? '<div class="bavatar"><img src="assets/bulle/bulle-logo.svg" alt="" /></div>' + dots
      : dots;
    return w;
  }

  // Top-anchored: scroll the thread up so the newest content stays in view.
  function scrollToLatest() {
    var over = track.scrollHeight - body.clientHeight;
    track.style.transform = over > 0 ? 'translateY(' + (-over) + 'px)' : 'translateY(0)';
  }

  var timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearAll() { timers.forEach(clearTimeout); timers = []; }
  function dropTyping() {
    Array.prototype.slice.call(track.querySelectorAll('.tbubble')).forEach(function (t) { t.remove(); });
  }

  function reset() {
    clearAll();
    dropTyping();
    msgs.forEach(function (m) { m.classList.remove('vis', 'show', 'seed'); });
    track.style.transform = 'translateY(0)';
  }

  function reveal(m) {
    m.classList.add('vis');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { m.classList.add('show'); scrollToLatest(); });
    });
  }

  var SEED = 2; // messages already on screen when the loop (re)starts — no blank area

  function play() {
    reset();
    var seed = Math.min(SEED, msgs.length);
    for (var s = 0; s < seed; s++) { msgs[s].classList.add('vis', 'show', 'seed'); }
    scrollToLatest();
    var i = seed;
    (function step() {
      if (i >= msgs.length) { later(play, 2000); return; }
      var m = msgs[i];
      var isFenn = m.classList.contains('fenn');
      var pre = parseInt(m.getAttribute('data-pre') || (isFenn ? '1200' : '650'), 10);
      var hold = parseInt(m.getAttribute('data-hold') || '1300', 10);
      var t = typingEl(isFenn);
      track.appendChild(t);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { t.classList.add('show'); scrollToLatest(); });
      });
      later(function () {
        t.remove();
        reveal(m);
        i++;
        later(step, hold);
      }, pre);
    })();
  }

  var running = false;
  var ioFired = false;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      ioFired = true;
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) { running = true; play(); }
        else if (!e.isIntersecting && running) { running = false; clearAll(); dropTyping(); }
      });
    }, { threshold: 0.2 });
    io.observe(phone);
    // Fallback: if the observer never calls back (it doesn't in some engines),
    // just play — better a running thread than a frozen empty area.
    setTimeout(function () {
      if (!ioFired && !running) { running = true; play(); }
    }, 1000);
  } else {
    running = true;
    play();
  }
})();
