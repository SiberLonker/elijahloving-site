/* Work With Me intake form.
   Backend: Formspree (free plan). When Elijah has a Formspree form ID, put it in data-formspree-id on the <form>
   in work-with-me/index.html (and change the form action to https://formspree.io/f/THE_ID so it also works without JavaScript).
   Until then, submitting opens the visitor's email app with everything filled in, addressed to info@elijahloving.com. */
(function () {
  'use strict';
  var form = document.getElementById('intake-form');
  if (!form) return;
  var statusBox = document.getElementById('form-status');
  var EMAIL = 'info@elijahloving.com';
  var id = (form.getAttribute('data-formspree-id') || '').trim();

  /* Pre-fill from links like /work-with-me/?project=ccs&call=1 */
  var q = new URLSearchParams(location.search);
  var map = { ccs: 'Monthly CCS', illustration: 'Illustration', design: 'Graphic Design', other: 'Other' };
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

  var labels = {
    first_name: 'First name', last_name: 'Last name', email: 'Email', phone: 'Phone', business: 'Business name',
    contact_method: 'How to contact me', project_type: 'Type of project', summary: 'Project summary',
    deadline: 'Deliverable date goal', budget: 'Budget goal', anything_else: 'Anything else', wants_call: 'Would like a call first', consent: 'Consent'
  };

  function show(msg, kind) {
    statusBox.className = 'form-status ' + (kind || '');
    statusBox.innerHTML = msg;
    statusBox.focus();
  }

  function mailtoFallback(data) {
    var lines = [];
    Object.keys(labels).forEach(function (k) {
      var v = data.get(k);
      if (v) lines.push(labels[k] + ': ' + v);
    });
    var name = ((data.get('first_name') || '') + ' ' + (data.get('last_name') || '')).trim();
    var subject = 'Project inquiry from ' + (name || 'elijahloving.com');
    var body = lines.join('\n\n');
    if (body.length > 1800) body = body.slice(0, 1800) + '\n\n(Shortened to fit in an email link. I will add the rest below.)';
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    show('Thank you! Your email app should open with everything filled in. Just press send. ' +
         'If nothing opens, please email me at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.', 'ok');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = new FormData(form);
    if (data.get('_gotcha')) return; /* spam bot */
    if (!id) { mailtoFallback(data); return; }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    show('Sending...', '');
    fetch('https://formspree.io/f/' + encodeURIComponent(id), { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        show('Thank you! Your project details are on their way to me, and I\'ll get back to you soon.', 'ok');
      })
      .catch(function () {
        show('Sorry, something went wrong sending the form. Please email me at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.', 'err');
      })
      .then(function () { btn.disabled = false; });
  });
})();
