/* Fenn party page — host signup form */
(function () {
  var form = document.getElementById('hostForm');
  if (!form) return;

  var API = 'https://www.askfenn.to/api/host-signup';

  function setError(el) { el.style.boxShadow = 'inset 0 0 0 2px var(--notify)'; }
  function clearError(el) { el.style.boxShadow = ''; }

  function validate() {
    var required = ['name', 'email', 'phone', 'city'];
    var ok = true;
    required.forEach(function (n) {
      var el = form.elements[n];
      if (!el) return;
      if (!el.value.trim()) { ok = false; setError(el); }
      else clearError(el);
    });
    var email = form.elements['email'];
    if (email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
      ok = false; setError(email);
    }
    return ok;
  }

  ['name', 'email', 'phone', 'city'].forEach(function (n) {
    var el = form.elements[n];
    if (el) el.addEventListener('input', function () { clearError(el); });
  });

  var btn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var data = {
      name:  form.elements['name'].value.trim(),
      email: form.elements['email'].value.trim(),
      phone: form.elements['phone'].value.trim(),
      city:  form.elements['city'].value.trim(),
      vibe:  form.elements['vibe'].value,
    };

    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, json: j }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error(r.json.error || 'Something went wrong.');
        var name = data.name.split(' ')[0];
        var heading = document.getElementById('successName');
        if (heading && name) heading.textContent = "You're on the list, " + name + '!';
        form.classList.add('done');
      })
      .catch(function (err) {
        if (btn) { btn.disabled = false; btn.textContent = 'Request my host deal'; }
        alert(err.message || 'Something went wrong. Please try again.');
      });
  });
})();
