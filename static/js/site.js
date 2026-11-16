// Small progressive enhancements. The site works without any of this.
(function () {
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  // Local preview only: fill a demo account into the sign-in form.
  document.querySelectorAll('[data-demo]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.closest('.auth-card').querySelector('form');
      f.email.value = b.dataset.demo;
      f.password.value = b.dataset.pw;
      f.submit();
    });
  });
  // Home: photos change every few seconds.
  var shots = document.querySelectorAll('.reel img');
  if (shots.length > 1) {
    var cur = 0;
    setInterval(function () {
      var load = function (im) { if (im.dataset.src) { im.src = im.dataset.src; delete im.dataset.src; } };
      var nxt = (cur + 1) % shots.length;
      load(shots[nxt]);
      load(shots[(nxt + 1) % shots.length]);
      if (!shots[nxt].complete) return;  // still downloading: try again next tick
      shots[cur].classList.remove('on');
      cur = nxt;
      shots[cur].classList.add('on');
    }, 5000);
  }
  // Home: date of birth to division.
  var finder = document.getElementById('finder'), fdata = document.getElementById('finder-data');
  if (finder && fdata) {
    var data = JSON.parse(fdata.textContent), out = finder.querySelector('.finder-out'), year = +finder.dataset.year;
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); };
    var run = function () {
      var prog = finder.program.value;
      // League age: the player's age on April 30 of the season year.
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(finder.dob.value);
      if (!m || +m[1] < 1990) { out.innerHTML = ''; return; }
      var n = year - (+m[1]) - ((+m[2] > 4 || (+m[2] === 4 && +m[3] > 30)) ? 1 : 0);
      var head = '<p class="fd-age">Age ' + n + ' on April 30, ' + year + '</p>';
      var hits = data.divisions.filter(function (d) { return d.program === prog && n >= d.min && n <= d.max; });
      if (!hits.length) { out.innerHTML = head + '<p class="fd-none">No ' + prog + ' division for this age.</p>'; return; }
      // Every row has the same cells in the same columns, so ages, grades and fees line up.
      var grades = hits.some(function (d) { return d.range.indexOf(' · ') > -1; });
      out.innerHTML = head + '<div class="fd-list' + (grades ? '' : ' fd-nogrades') + '">' + hits.map(function (d) {
        var r = d.range.split(' · ');
        return '<div class="fd-res"><b>' + esc(d.name) + '</b><i class="fd-a">' + esc(r[0]) + '</i>' +
          (grades ? '<i class="fd-g">' + esc(r[1] || '') + '</i>' : '') +
          '<i class="fd-f">' + esc(d.fee || '') + '</i>' +
          '<i class="fd-n">' + (d.exp === n ? 'Age ' + n + ' needs playing experience' : '') + '</i>' +
          '<a class="btn btn-reg-' + prog + ' btn-sm" href="' + esc(data.register[prog]) + '" target="_blank" rel="noopener">Register</a>' +
          '<a class="btn btn-line btn-sm" href="' + esc(d.url) + '">Division details</a></div>';
      }).join('') + '</div>';
    };
    finder.addEventListener('input', run);
    finder.addEventListener('change', run);
    finder.addEventListener('submit', function (ev) { ev.preventDefault(); run(); });
  }
  // Admin alerts: the park and date boxes only matter for a park alert.
  var aud = document.querySelector('.alert-form select[name=aud]');
  if (aud) {
    var parkOnly = function () {
      document.querySelectorAll('.alert-form .park-only').forEach(function (el) { el.hidden = aud.value !== 'park'; });
    };
    aud.addEventListener('change', parkOnly);
    parkOnly();
  }
  // Success messages fade on their own; errors stay until dismissed.
  var ok = document.querySelector('.flash-ok');
  if (ok) setTimeout(function () { ok.style.transition = 'opacity .6s'; ok.style.opacity = 0; setTimeout(function () { ok.remove(); }, 700); }, 6000);
})();
