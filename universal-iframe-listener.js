// ============================================================
// Universal Iframe Form Listener — Privy Clear GTM Snippet
// ============================================================
// What it does: Handles form submit events from HubSpot,
//   Typeform, JotForm, and Calendly in a single GTM tag.
//
// GTM Setup:
//   1. Tags → New → Custom HTML tag
//   2. Paste this entire file
//   3. Trigger: All Pages
//   4. Publish
//
// IMPORTANT: Use this OR the platform-specific files — not both.
//   Using both will cause duplicate dataLayer events.
//
// GTM Trigger to create after:
//   Type: Custom Event | Event name: form_submit
// ============================================================

<script>
(function () {
  'use strict';

  // Guard: prevent duplicate listeners
  if (window._pcUniversalListenerActive) return;
  window._pcUniversalListenerActive = true;

  window.addEventListener('message', function (event) {
    if (!event || !event.data) return;

    var d = event.data;
    window.dataLayer = window.dataLayer || [];

    // ── HubSpot ──────────────────────────────────────────
    // Fires after successful form submission and validation
    if (typeof d === 'object' &&
        d.type === 'hsFormCallback' &&
        d.eventName === 'onFormSubmitted') {
      window.dataLayer.push({
        event: 'form_submit',
        form_platform: 'hubspot',
        form_id: d.id || 'unknown',
        portal_id: d.portalId || 'unknown'
      });
      return;
    }

    // ── Typeform ─────────────────────────────────────────
    // Fires when respondent completes and submits the form
    if (typeof d === 'object' && d.type === 'form-submit') {
      window.dataLayer.push({
        event: 'form_submit',
        form_platform: 'typeform',
        form_id: d.formId || 'unknown'
      });
      return;
    }

    // ── JotForm ──────────────────────────────────────────
    // JotForm sends postMessage as a stringified JSON string
    var parsed = d;
    if (typeof d === 'string') {
      try { parsed = JSON.parse(d); } catch (e) { return; }
    }
    if (parsed && typeof parsed === 'object' &&
        parsed.action === 'submission-completed') {
      window.dataLayer.push({
        event: 'form_submit',
        form_platform: 'jotform',
        form_id: parsed.formID || 'unknown'
      });
      return;
    }

    // ── Calendly ─────────────────────────────────────────
    // Fires when a meeting is successfully scheduled
    if (typeof d === 'object' && d.event === 'calendly.event_scheduled') {
      window.dataLayer.push({
        event: 'form_submit',
        form_platform: 'calendly',
        event_type: (d.payload &&
                     d.payload.event_type &&
                     d.payload.event_type.name) || 'unknown'
      });
      return;
    }

  });

}());
</script>
