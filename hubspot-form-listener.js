// ============================================================
// HubSpot Iframe Form Listener — Privy Clear GTM Snippet
// ============================================================
// What it does: Fires a dataLayer event when any HubSpot
//   embedded form is successfully submitted.
//
// GTM Setup:
//   1. Tags → New → Custom HTML tag
//   2. Paste this entire file
//   3. Trigger: All Pages
//   4. Publish
//
// GTM Trigger to create after:
//   Type: Custom Event
//   Event name: form_submit
//   (optional filter: form_platform equals hubspot)
// ============================================================

<script>
(function () {
  'use strict';

  // Guard: prevent duplicate listeners if tag fires more than once
  if (window._pcHubspotListenerActive) return;
  window._pcHubspotListenerActive = true;

  window.addEventListener('message', function (event) {
    // Safety check — ensure data exists and is an object
    if (!event || !event.data || typeof event.data !== 'object') return;

    // Only process HubSpot callbacks
    if (event.data.type !== 'hsFormCallback') return;

    // Use onFormSubmitted (not onFormSubmit) — fires only after
    // successful validation and server confirmation, not on failed attempts
    if (event.data.eventName === 'onFormSubmitted') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'form_submit',
        form_platform: 'hubspot',
        form_id: event.data.id || 'unknown',
        portal_id: event.data.portalId || 'unknown'
      });
    }
  });

}());
</script>
