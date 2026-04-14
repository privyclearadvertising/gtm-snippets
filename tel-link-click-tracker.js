// ============================================================
// Tel: Link Click Tracker — Privy Clear GTM Snippet
// ============================================================
// What it does: Fires a dataLayer event when a visitor clicks
//   any tel: phone link on the page. Use this if you don't
//   have CallRail. Works for click-to-call tracking in Google
//   Ads, GA4, and Meta.
//
// GTM Setup:
//   1. Tags → New → Custom HTML tag
//   2. Paste this entire file
//   3. Trigger: All Pages
//   4. Publish
//
// GTM Trigger to create after:
//   Type: Custom Event | Event name: click_to_call
//
// Apply that trigger to:
//   → GA4 Event tag (event name: click_to_call)
//   → Google Ads Phone Call Conversion tag
//   → Meta Pixel Lead event tag
//
// Note: If you have CallRail installed, do NOT use this.
//   CallRail replaces phone numbers dynamically and handles
//   call tracking at a deeper level.
// ============================================================

<script>
(function () {
  'use strict';

  if (window._pcTelTrackerActive) return;
  window._pcTelTrackerActive = true;

  function handleTelClick(event) {
    var target = event.target;

    // Walk up the DOM tree in case click landed on a child element
    // (e.g., an icon or span inside the <a> tag)
    while (target && target !== document) {
      if (target.tagName === 'A' &&
          target.href &&
          target.href.toLowerCase().indexOf('tel:') === 0) {

        // Extract the phone number from the href
        var phoneNumber = target.href.replace(/^tel:/i, '').trim()
                                     || target.textContent.trim()
                                     || 'unknown';

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event:        'click_to_call',
          phone_number: phoneNumber,
          link_text:    target.textContent.trim() || phoneNumber,
          page_path:    window.location.pathname
        });

        break;
      }
      target = target.parentElement;
    }
  }

  // useCapture: true ensures we catch the click before
  // the browser opens the phone dialer
  document.addEventListener('click', handleTelClick, true);

}());
</script>
