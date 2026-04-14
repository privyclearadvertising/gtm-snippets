// ============================================================
// Gravity Forms — Privy Clear GTM Snippet
// ============================================================
// What it does: Fires a dataLayer event when a Gravity Forms
//   form is successfully submitted (AJAX and standard).
//
// Requires: Gravity Forms plugin on WordPress.
//   jQuery is always available when Gravity Forms is active.
//
// GTM Setup:
//   1. Tags → New → Custom HTML tag
//   2. Paste this entire file
//   3. Trigger: All Pages (or pages with Gravity Forms)
//   4. Publish
//
// GTM Trigger to create after:
//   Type: Custom Event | Event name: form_submit
//   (optional filter: form_platform equals gravity-forms)
// ============================================================

<script>
(function () {
  'use strict';

  // Guard: prevent duplicate listeners
  if (window._pcGFListenerActive) return;
  window._pcGFListenerActive = true;

  // Wait for jQuery and Gravity Forms to be ready
  function attachGFListeners() {
    if (typeof window.jQuery === 'undefined') {
      // jQuery not yet loaded — retry in 300ms
      setTimeout(attachGFListeners, 300);
      return;
    }

    var $ = window.jQuery;

    // ── Method 1: AJAX forms (most common) ────────────────
    // gform_confirmation_loaded fires after the AJAX confirmation
    // message is shown — only fires on successful submission
    $(document).on('gform_confirmation_loaded', function (event, formId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'form_submit',
        form_platform: 'gravity-forms',
        form_id: formId ? String(formId) : 'unknown'
      });
    });

    // ── Method 2: Non-AJAX / page-reload forms ────────────
    // gform_post_render fires on every render — check for
    // confirmation page indicator to confirm successful submit
    $(document).on('gform_post_render', function (event, formId) {
      // If a confirmation div is present, form was submitted
      if ($('.gform_confirmation_wrapper').length > 0) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'form_submit',
          form_platform: 'gravity-forms',
          form_id: formId ? String(formId) : 'unknown'
        });
      }
    });
  }

  attachGFListeners();

}());
</script>
