// ============================================================
// ActiveCampaign Form Listener — Privy Clear GTM Snippet
// ============================================================
// What it does: Fires a dataLayer event on successful
//   ActiveCampaign form submission. Handles two embed types:
//
//   TYPE 1 — Inline/JS forms (most common):
//     AC renders forms with class "_form". Tracks submission
//     by watching for the thank-you confirmation element.
//
//   TYPE 2 — Hosted/iframe forms:
//     Listens for postMessage events from the AC iframe.
//
// GTM Setup:
//   1. Tags → New → Custom HTML tag
//   2. Paste this entire file
//   3. Trigger: All Pages
//   4. Publish
//
// GTM Trigger to create after:
//   Type: Custom Event | Event name: form_submit
//   Optional filter: form_platform equals activecampaign
// ============================================================

<script>
(function () {
  'use strict';

  if (window._pcACListenerActive) return;
  window._pcACListenerActive = true;

  window.dataLayer = window.dataLayer || [];

  // ── TYPE 1: Inline JS Forms ───────────────────────────────
  // AC inline forms show a div with class '_form-thank-you'
  // on successful submission. Watch for it appearing in the DOM.
  if (window.MutationObserver) {
    var firedForms = {};

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(
          mutation.addedNodes,
          function (node) {
            if (node.nodeType !== 1) return;

            // Check if the added node IS the thank-you div
            // or CONTAINS it (covers both insertion patterns)
            var thankYou = (node.classList && node.classList.contains('_form-thank-you'))
              ? node
              : node.querySelector && node.querySelector('._form-thank-you');

            if (!thankYou) return;

            // Find the parent form to get an ID
            var form = thankYou.closest('._form') || thankYou.closest('form');
            var formId = (form && (form.id || form.getAttribute('data-form-id')))
                       || 'unknown';

            // Deduplicate — only fire once per form per page load
            if (firedForms[formId]) return;
            firedForms[formId] = true;

            window.dataLayer.push({
              event:         'form_submit',
              form_platform: 'activecampaign',
              form_id:       formId,
              embed_type:    'inline'
            });
          }
        );
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ── TYPE 2: Hosted Iframe Forms ───────────────────────────
  // AC hosted forms send a postMessage on submission.
  // Event name varies by AC version — check all known variants.
  window.addEventListener('message', function (event) {
    if (!event || !event.data) return;

    var d = event.data;

    // Variant A: newer AC hosted forms
    if (typeof d === 'object' && d.type === 'ac_form_submitted') {
      window.dataLayer.push({
        event:         'form_submit',
        form_platform: 'activecampaign',
        form_id:       d.formId || d.form_id || 'unknown',
        embed_type:    'iframe'
      });
      return;
    }

    // Variant B: some AC versions send a string
    if (typeof d === 'string') {
      try {
        var parsed = JSON.parse(d);
        if (parsed && parsed.type === 'ac_form_submitted') {
          window.dataLayer.push({
            event:         'form_submit',
            form_platform: 'activecampaign',
            form_id:       parsed.formId || 'unknown',
            embed_type:    'iframe'
          });
        }
      } catch (e) {}
    }
  });

}());
</script>
