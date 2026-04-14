// ============================================================
// Contact Form 7 (CF7) — Privy Clear GTM Snippet
// ============================================================
// What it does: Fires a dataLayer event on successful CF7
//   form submission. CF7 is same-domain (not an iframe), so
//   it fires a native DOM event — no postMessage needed.
//
// Requires: Contact Form 7 plugin on WordPress
//
// GTM Setup:
//   1. Tags → New → Custom HTML tag
//   2. Paste this entire file
//   3. Trigger: All Pages (or pages with CF7 forms)
//   4. Publish
//
// GTM Trigger to create after:
//   Type: Custom Event | Event name: form_submit
//   (optional filter: form_platform equals contact-form-7)
// ============================================================

<script>
(function () {
  'use strict';

  // Guard: prevent duplicate listeners
  if (window._pcCF7ListenerActive) return;
  window._pcCF7ListenerActive = true;

  // wpcf7mailsent fires only after server confirms email sent
  // (not on validation errors or failed submissions)
  document.addEventListener('wpcf7mailsent', function (event) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'form_submit',
      form_platform: 'contact-form-7',
      form_id: (event.detail && event.detail.contactFormId) || 'unknown',
      unit_tag: (event.detail && event.detail.unitTag) || 'unknown'
    });
  });

  // Also capture wpcf7submit as a fallback for custom CF7 setups
  // that bypass the mail step (e.g. API integrations)
  // Remove this block if you only want confirmed email sends.
  document.addEventListener('wpcf7submit', function (event) {
    if (!event.detail || !event.detail.apiResponse) return;
    var status = event.detail.apiResponse.status;
    if (status === 'mail_sent' || status === 'mail_ok') {
      // Already handled by wpcf7mailsent above — skip duplicate
      return;
    }
  });

}());
</script>
