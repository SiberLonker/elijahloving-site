/* Work With Me intake form, sent with Netlify Forms.
   Without JavaScript the form posts normally and Netlify shows /work-with-me/thanks/.
   With JavaScript we post the same fields (URL-encoded, to "/") so the visitor gets a quick
   confirmation and is sent to the same thank-you page. */
(function () {
  'use strict';
  var form = document.getElementById('intake-form');
  if (!form) return;
  var statusBox = document.getElementById('form-status');
  var EMAIL = 'info@elijahloving.com';
  var THANKS = form.getAttribute('action') || '/work-with-me/thanks/';

  /* Pre-fill from links like /work-with-me/?project=illustration&call=1 */
  var q = new URLSearchParams(location.search);
  var map = { illustration: 'Illustration', design: 'Graphic Design', other: 'Other' };
  var pick = map[(q.get('project') || '').toLowerCase()];
  if (pick) {
    var r = form.querySelector('input[name="project_type"][value="' + pick + '"]');
    if (r) r.checked = true;
  }
  if (q.get('call') === '1') { var c = document.getElementById('wants_call'); if (c) c.checked = true; }

  /* Phone becomes required when the visitor wants texts */
  var phone = document.getElementById('phone');
  form.querySelectorAll('input[name="contact_method"]').forEach(function (el) {
    el.addEventListener('change', function () {
      var v = form.querySelector('input[name="contact_method"]:checked');
      phone.required = !!v && v.value !== 'Email';
    });
  });

  function show(msg, kind) {
    statusBox.className = 'form-status ' + (kind || '');
    statusBox.innerHTML = msg;
    statusBox.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = new FormData(form);
    if (data.get('company_site')) return; /* spam bot filled the hidden field */
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    show('Sending...', '');
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        show('Thank you! Your project details are on their way to me.', 'ok');
        window.location.href = THANKS;
      })
      .catch(function () {
        btn.disabled = false;
        show('Sorry, something went wrong sending the form. Please try again, or email me at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.', 'err');
      });
  });
})();
