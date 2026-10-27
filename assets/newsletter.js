/* Silver Rail Children's Fund — newsletter sign-up popup
   Shows once per visitor after 40 s on the page. Submits into the fund's own
   Google Form in the hello@ Workspace (same private storage as every other
   form on this site). Nothing is stored on the website itself.

   SETUP (one time): create a Google Form in the hello@ Workspace with three
   questions — Email (short answer, required), First name (short answer),
   "I am a…" (multiple choice: Silver Rail parent / Neighbor / Business or
   organization). Open the form's "Get pre-filled link", fill dummy answers,
   copy the link, and paste the entry.NNN ids below. Until FORM_ACTION is set,
   the popup falls back to a pre-addressed email to hello@. */
(function () {
  var FORM_ACTION = '';            // e.g. https://docs.google.com/forms/d/e/XXXX/formResponse
  var F_EMAIL = '';                // e.g. entry.1234567890
  var F_NAME  = '';                // e.g. entry.2345678901
  var F_ROLE  = '';                // e.g. entry.3456789012
  var DELAY_MS = 40000;
  var KEY = 'srcf_news';           // localStorage: 'done' or dismissed timestamp
  var SNOOZE_DAYS = 14;

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  var seen = read(KEY);
  if (seen === 'done') return;
  if (seen && Date.now() - Number(seen) < SNOOZE_DAYS * 864e5) return;
  if (location.pathname.indexOf('/board-room') === 0) return;

  var css = '\
#srcf-nl{position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-end;justify-content:center;background:rgba(31,42,43,.45);padding:16px;opacity:0;transition:opacity .35s}\
#srcf-nl.on{opacity:1}\
#srcf-nl .box{position:relative;width:100%;max-width:440px;background:var(--paper,#fbf8f2);color:var(--ink,#1f2a2b);border-radius:18px;padding:28px 26px 22px;box-shadow:0 24px 60px rgba(31,42,43,.25);transform:translateY(24px);transition:transform .35s;font-family:Inter,system-ui,sans-serif}\
#srcf-nl.on .box{transform:none}\
@media(min-width:720px){#srcf-nl{align-items:center}}\
#srcf-nl h3{font-family:Fraunces,Georgia,serif;font-size:1.55rem;line-height:1.1;margin:0 0 8px;letter-spacing:-.01em}\
#srcf-nl p{margin:0 0 16px;font-size:.95rem;line-height:1.5;color:var(--ink-2,#4a5a5c)}\
#srcf-nl label{display:block;font-size:.8rem;font-weight:600;margin:0 0 4px}\
#srcf-nl input[type=email],#srcf-nl input[type=text]{width:100%;box-sizing:border-box;font:inherit;font-size:1rem;padding:11px 12px;border:1.5px solid var(--rule,#dfd6c4);border-radius:10px;background:#fff;margin-bottom:12px}\
#srcf-nl input:focus{outline:2px solid var(--pine,#5B3F93);outline-offset:1px;border-color:transparent}\
#srcf-nl .roles{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}\
#srcf-nl .roles label{font-weight:500;font-size:.82rem;margin:0;padding:7px 11px;border:1.5px solid var(--rule,#dfd6c4);border-radius:999px;cursor:pointer;background:#fff}\
#srcf-nl .roles input{position:absolute;opacity:0;width:0;height:0}\
#srcf-nl .roles input:checked+span{color:#fff}\
#srcf-nl .roles label:has(input:checked){background:var(--pine,#5B3F93);border-color:var(--pine,#5B3F93);color:#fff}\
#srcf-nl button.go{width:100%;font:inherit;font-weight:600;font-size:1rem;padding:13px;border:0;border-radius:10px;background:var(--gold,#f3c77b);color:var(--ink,#1f2a2b);cursor:pointer}\
#srcf-nl button.go:hover{background:var(--gold-2,#d8a74f)}\
#srcf-nl .x{position:absolute;top:10px;right:10px;width:36px;height:36px;border:0;background:transparent;font-size:1.5rem;line-height:1;cursor:pointer;color:var(--ink-2,#4a5a5c);border-radius:50%}\
#srcf-nl .x:hover{background:var(--paper-2,#f2ece0)}\
#srcf-nl small{display:block;margin-top:12px;font-size:.74rem;line-height:1.45;color:var(--ink-2,#4a5a5c)}\
#srcf-nl .hp{position:absolute;left:-9999px;opacity:0}\
#srcf-nl .eyebrow{font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--pine,#5B3F93);margin-bottom:8px}\
#srcf-nl .thanks h3{margin-bottom:6px}\
@media(prefers-reduced-motion:reduce){#srcf-nl,#srcf-nl .box{transition:none}}';

  var html = '\
<div class="box" role="dialog" aria-modal="true" aria-labelledby="srcf-nl-h">\
  <button class="x" type="button" aria-label="Close">&times;</button>\
  <form novalidate>\
    <div class="eyebrow">From the Silver Rail parents</div>\
    <h3 id="srcf-nl-h">Watch these kids be kids.</h3>\
    <p>A short note, once or twice a month: what the fund did, what it cost, and the next outing for Silver Rail kids. No asks you didn\'t sign up for.</p>\
    <label for="srcf-nl-e">Email</label>\
    <input id="srcf-nl-e" type="email" name="email" autocomplete="email" inputmode="email" required placeholder="you@example.com">\
    <label for="srcf-nl-n">First name <span style="font-weight:400;color:var(--ink-2,#4a5a5c)">(optional)</span></label>\
    <input id="srcf-nl-n" type="text" name="name" autocomplete="given-name">\
    <div class="roles" role="radiogroup" aria-label="I am a">\
      <label><input type="radio" name="role" value="Silver Rail parent"><span>Silver Rail parent</span></label>\
      <label><input type="radio" name="role" value="Neighbor"><span>Neighbor</span></label>\
      <label><input type="radio" name="role" value="Business or organization"><span>Business</span></label>\
    </div>\
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">\
    <button class="go" type="submit">Keep me posted</button>\
    <small>Your email goes into the fund\'s own private Google Workspace, opened only by the parents who run it. Never sold, never shared, one click to unsubscribe. <a href="/privacy.html">Privacy</a></small>\
  </form>\
</div>';

  var thanks = '\
<div class="box thanks" role="dialog" aria-modal="true" aria-labelledby="srcf-nl-t">\
  <button class="x" type="button" aria-label="Close">&times;</button>\
  <div class="eyebrow">You\'re in</div>\
  <h3 id="srcf-nl-t">Thank you.</h3>\
  <p>The first note comes after our first full month, with the ledger. Until then, the latest is always at <a href="/#sofar">what\'s happened so far</a>.</p>\
  <button class="go" type="button">Back to the site</button>\
</div>';

  function close(done) {
    store(KEY, done ? 'done' : String(Date.now()));
    var el = document.getElementById('srcf-nl');
    if (!el) return;
    el.classList.remove('on');
    setTimeout(function () { el.remove(); }, 350);
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(false); }

  function show() {
    if (document.getElementById('srcf-nl')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var wrap = document.createElement('div'); wrap.id = 'srcf-nl'; wrap.innerHTML = html;
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('on'); });
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(false); });
    wrap.querySelector('.x').addEventListener('click', function () { close(false); });
    document.addEventListener('keydown', onKey);
    setTimeout(function () { var i = wrap.querySelector('#srcf-nl-e'); if (i) i.focus(); }, 400);

    wrap.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target;
      if (f.website.value) return;                      // honeypot
      var email = f.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { f.email.focus(); f.email.setCustomValidity('Please enter a valid email'); f.email.reportValidity(); return; }
      var name = f.name.value.trim();
      var role = (f.querySelector('input[name=role]:checked') || {}).value || '';
      var btn = f.querySelector('.go'); btn.disabled = true; btn.textContent = 'Saving…';

      function done() {
        store(KEY, 'done');
        wrap.innerHTML = thanks;
        wrap.querySelector('.x').addEventListener('click', function () { close(true); });
        wrap.querySelector('.go').addEventListener('click', function () { close(true); });
      }

      if (FORM_ACTION && F_EMAIL) {
        var fd = new FormData();
        fd.append(F_EMAIL, email);
        if (F_NAME) fd.append(F_NAME, name);
        if (F_ROLE) fd.append(F_ROLE, role);
        fetch(FORM_ACTION, { method: 'POST', mode: 'no-cors', body: fd }).then(done, done);
      } else {
        // Interim: pre-addressed email to the fund's own inbox until the form is wired.
        var body = 'Please add me to the Silver Rail Children\'s Fund newsletter.\n\nEmail: ' + email + (name ? '\nName: ' + name : '') + (role ? '\nI am a: ' + role : '');
        location.href = 'mailto:hello@silverrailchildrensfund.org?subject=' + encodeURIComponent('Newsletter sign-up') + '&body=' + encodeURIComponent(body);
        done();
      }
    });
    f_clear();
    function f_clear() { var i = wrap.querySelector('#srcf-nl-e'); i.addEventListener('input', function () { i.setCustomValidity(''); }); }
  }

  var t = setTimeout(show, DELAY_MS);
  // Don't interrupt someone who is already filling in a form on the page.
  document.addEventListener('focusin', function (e) {
    if (e.target && e.target.closest && e.target.closest('form, iframe') && !e.target.closest('#srcf-nl')) { clearTimeout(t); t = setTimeout(show, DELAY_MS * 2); }
  });
})();
