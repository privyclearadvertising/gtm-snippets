// ============================================================
// Enhanced Conversions Data Push — Privy Clear GTM Snippet
// ============================================================
// What it does: Captures email and phone number from any form
//   submission on the page and pushes them to the dataLayer
//   as 'user_data'. Google Ads reads this and hashes it for
//   Enhanced Conversions — improving match rates 20–40%.
//
//   No PII leaves your GTM container in plain text.
//   Google does all hashing server-side.
//
// GTM Setup:
//   1. Tags → New → Custom HTML tag
//   2. Paste this entire file
//   3. Trigger: All Pages
//   4. In your Google Ads Conversion tag:
//      → Enable Enhanced Conversions
//      → Set to read from dataLayer → user_data
//   5. Publish
//
// Works with: Contact Form 7, Gravity Forms, Elementor,
//   WPForms, and any same-domain HTML form.
//   For HubSpot/Typeform use alongside the iframe listener.
// ============================================================

<script>
(function () {
  'use strict';

  if (window._pcEnhancedConvActive) return;
  window._pcEnhancedConvActive = true;

  // Normalize phone to digits only, then E.164-ish format
  function normalizePhone(raw) {
    if (!raw) return null;
    var digits = raw.replace(/\D/g, '');
    if (!digits || digits.length < 7) return null;
    // Prepend +1 for US numbers if 10 digits and no country code
    if (digits.length === 10) return '+1' + digits;
    if (digits.length === 11 && digits[0] === '1') return '+' + digits;
    return '+' + digits;
  }

  function normalizeEmail(raw) {
    if (!raw) return null;
    var trimmed = raw.trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : null;
  }

  function extractFromForm(form) {
    var email = null;
    var phone = null;

    // Try input[type=email] first, then name/id heuristics
    var emailField = form.querySelector('input[type="email"]')
      || form.querySelector('input[name*="email"], input[id*="email"]')
      || form.querySelector('input[name*="mail"], input[id*="mail"]');

    // Try input[type=tel] first, then name/id heuristics
    var phoneField = form.querySelector('input[type="tel"]')
      || form.querySelector('input[name*="phone"], input[id*="phone"]')
      || form.querySelector('input[name*="mobile"], input[id*="mobile"]')
      || form.querySelector('input[name*="tel"], input[id*="tel"]');

    if (emailField) email = normalizeEmail(emailField.value);
    if (phoneField) phone = normalizePhone(phoneField.value);

    return { email: email, phone: phone };
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || form.tagName !== 'FORM') return;

    var data = extractFromForm(form);
    if (!data.email && !data.phone) return;

    window.dataLayer = window.dataLayer || [];

    // user_data key is exactly what Google Ads Enhanced
    // Conversions expects — do not rename this object
    var userData = {};
    if (data.email) userData.email = data.email;
    if (data.phone) userData.phone_number = data.phone;

    window.dataLayer.push({
      event:     'enhanced_conversion_data',
      user_data: userData
    });

  }, true); // useCapture: true catches all forms including nested ones

}());
</script>
