// ============================================================
// GCLID + UTM Parameter Capture — Privy Clear GTM Snippet
// ============================================================
// What it does: Captures Google Click ID (GCLID), Facebook
//   Click ID (FBCLID), Microsoft Click ID (MSCLKID), and all
//   UTM parameters on landing. Stores them in localStorage
//   (90-day expiry) and sessionStorage so they survive page
//   navigation and can populate hidden form fields.
//
//   This is the backbone of your offline conversion workflow.
//   See kit PDF page 08 for how GCLID connects to Google Ads.
//
// GTM Setup:
//   1. Tags → New → Custom HTML tag
//   2. Paste this entire file
//   3. Trigger: All Pages
//   4. Publish
//
// JotForm / HubSpot hidden fields to add on your form:
//   gclid | utm_source | utm_medium | utm_campaign
//   utm_term | utm_content | fbclid
// ============================================================

<script>
(function () {
  'use strict';

  if (window._pcGCLIDCaptureActive) return;
  window._pcGCLIDCaptureActive = true;

  var STORAGE_KEY  = 'pc_tracking_params';
  var EXPIRY_KEY   = 'pc_tracking_expiry';
  var EXPIRY_DAYS  = 90;
  var TRACKED_PARAMS = [
    'gclid', 'utm_source', 'utm_medium',
    'utm_campaign', 'utm_term', 'utm_content',
    'fbclid', 'msclkid'
  ];

  // Hidden field name variations to check on the page
  var FIELD_MAP = {
    gclid:        ['gclid', 'GCLID', 'google_click_id'],
    fbclid:       ['fbclid', 'FBCLID'],
    msclkid:      ['msclkid', 'MSCLKID'],
    utm_source:   ['utm_source',   'UTM_Source',   'utmSource'],
    utm_medium:   ['utm_medium',   'UTM_Medium',   'utmMedium'],
    utm_campaign: ['utm_campaign', 'UTM_Campaign', 'utmCampaign'],
    utm_term:     ['utm_term',     'UTM_Term',     'utmTerm'],
    utm_content:  ['utm_content',  'UTM_Content',  'utmContent']
  };

  function getURLParam(name) {
    var regex   = new RegExp('[?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results
      ? decodeURIComponent(results[1].replace(/\+/g, ' '))
      : null;
  }

  function saveParams(params) {
    try {
      var expiry = new Date();
      expiry.setDate(expiry.getDate() + EXPIRY_DAYS);
      var json = JSON.stringify(params);
      localStorage.setItem(STORAGE_KEY, json);
      localStorage.setItem(EXPIRY_KEY,  expiry.toISOString());
      sessionStorage.setItem(STORAGE_KEY, json);
    } catch (e) {}
  }

  function loadParams() {
    try {
      var expiry = localStorage.getItem(EXPIRY_KEY);
      if (expiry && new Date(expiry) < new Date()) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EXPIRY_KEY);
        return null;
      }
      var json = sessionStorage.getItem(STORAGE_KEY)
              || localStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : null;
    } catch (e) { return null; }
  }

  function populateHiddenFields(params) {
    Object.keys(FIELD_MAP).forEach(function (paramName) {
      if (!params[paramName]) return;
      FIELD_MAP[paramName].forEach(function (fieldName) {
        var selector = 'input[name="' + fieldName + '"],'
                     + 'input[id="'   + fieldName + '"]';
        var fields = document.querySelectorAll(selector);
        Array.prototype.forEach.call(fields, function (field) {
          if (!field.value) field.value = params[paramName];
        });
      });
    });
  }

  // ── Capture ───────────────────────────────────────────────
  var params = {};
  var hasNew = false;

  TRACKED_PARAMS.forEach(function (name) {
    var val = getURLParam(name);
    if (val) { params[name] = val; hasNew = true; }
  });

  if (hasNew) {
    saveParams(params);
  } else {
    params = loadParams() || {};
  }

  // ── Push to dataLayer ─────────────────────────────────────
  if (Object.keys(params).length) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event:        'tracking_params_loaded',
      gclid:        params.gclid        || null,
      fbclid:       params.fbclid       || null,
      msclkid:      params.msclkid      || null,
      utm_source:   params.utm_source   || null,
      utm_medium:   params.utm_medium   || null,
      utm_campaign: params.utm_campaign || null,
      utm_term:     params.utm_term     || null,
      utm_content:  params.utm_content  || null
    });
  }

  // ── Populate hidden fields ────────────────────────────────
  populateHiddenFields(params);

  // Re-populate when new forms are injected into the DOM
  // (covers AJAX-loaded and iframe-revealed forms)
  if (window.MutationObserver && Object.keys(params).length) {
    var observer = new MutationObserver(function () {
      populateHiddenFields(params);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

}());
</script>
