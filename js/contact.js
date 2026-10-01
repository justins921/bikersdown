// Contact form: client-side validation + FormSubmit AJAX delivery.
// Without JS the form still posts to FormSubmit's normal (non-AJAX) endpoint.
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var ENDPOINT = 'https://formsubmit.co/ajax/dockperz@gmail.com';
  var status = document.getElementById('formStatus');
  var btn = document.getElementById('submitBtn');
  var fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    topic: document.getElementById('topic'),
    message: document.getElementById('message')
  };

  // Deep links like /contact?topic=Memorial preselect the topic.
  var wanted = new URLSearchParams(window.location.search).get('topic');
  if (wanted) {
    for (var i = 0; i < fields.topic.options.length; i++) {
      if (fields.topic.options[i].value.toLowerCase() === wanted.toLowerCase()) {
        fields.topic.selectedIndex = i;
        break;
      }
    }
  }

  function showStatus(type, msg) {
    status.className = 'form-status ' + type;
    status.textContent = msg;
  }

  function markInvalid(el, invalid) {
    if (invalid) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  }

  Object.keys(fields).forEach(function (k) {
    fields[k].addEventListener('input', function () { markInvalid(fields[k], false); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = fields.name.value.trim();
    var email = fields.email.value.trim();
    var message = fields.message.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    markInvalid(fields.name, !name);
    markInvalid(fields.email, !email || !emailOk);
    markInvalid(fields.message, !message);

    if (!name || !email || !message) {
      showStatus('error', 'Please fill in your name, email, and message.');
      (!name ? fields.name : !email ? fields.email : fields.message).focus();
      return;
    }
    if (!emailOk) {
      showStatus('error', 'That email address doesn’t look quite right.');
      fields.email.focus();
      return;
    }
    // Honeypot: real people never see this field. Pretend success for bots.
    if (form.elements._honey.value) {
      showStatus('success', 'Thanks — your message is on its way.');
      form.reset();
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.className = 'form-status';

    var topic = fields.topic.value;
    var data = {
      name: name,
      email: email,
      phone: fields.phone.value.trim(),
      topic: topic || 'Not specified',
      call_back: (form.querySelector('input[name="call_back"]:checked') || {}).value || 'Not specified',
      message: message,
      _subject: 'New message from the Bikers Down website' + (topic ? ' — ' + topic : ''),
      _template: 'table',
      _captcha: 'false'
    };

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          // FormSubmit can answer 200 with success:"false", so check both.
          if (!res.ok || String(body.success) === 'false') throw new Error(body.message || 'send failed');
        });
      })
      .then(function () {
        showStatus('success', 'Thanks, ' + name.split(' ')[0] + ' — your message is on its way to Scott.');
        form.reset();
      })
      .catch(function () {
        showStatus('error', 'Something went wrong sending your message. Please try again in a moment, or call 920-651-9370.');
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Send Message';
      });
  });
})();
