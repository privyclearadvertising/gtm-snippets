# Privy Clear — GTM Snippets

**Advanced GTM code snippets for CRM form tracking, iframe 
listeners, click tracking, and offline conversion setup.**

Companion resource to the [Local Service Lead Tracking Kit](https://privyclear.com).  
Built and maintained by [Privy Clear](https://privyclear.com) — Hannah Fox & Sara Chambers.

---

## Who This Is For

You purchased the Privy Clear Local Service Lead Tracking Kit 
and either:
- Your form isn't firing in GTM, or
- You're using a CRM like HubSpot, ActiveCampaign, or 
  Gravity Forms that requires a custom implementation, or
- You want to capture GCLID/UTM parameters for offline 
  conversion matching (see kit PDF, page 08), or
- You want to improve Google Ads match rates with 
  Enhanced Conversions data

These snippets solve the most common tracking failures 
we see in real client accounts.

---

## The Problem

GTM's built-in form submit trigger listens for forms on your 
page. But many CRM and third-party forms are embedded inside 
an **iframe** — a separate browser context that GTM can't 
see into. The tag never fires. The conversion never records.

Different platforms solve this differently. That's what 
these files are for.

---

## All Files

| File | Platform / Purpose | Method |
|------|--------------------|--------|
| `universal-iframe-listener.js` | HubSpot, Typeform, JotForm, Calendly | postMessage |
| `hubspot-form-listener.js` | HubSpot only | postMessage |
| `activecampaign-listener.js` | ActiveCampaign inline + iframe | MutationObserver + postMessage |
| `contact-form-7-datalayer.js` | WordPress CF7 | DOM event |
| `gravity-forms-datalayer.js` | WordPress Gravity Forms | jQuery event |
| `salesforce-thankyou-url.md` | Salesforce, Zoho | URL redirect |
| `gclid-utm-capture.js` | All platforms | sessionStorage + dataLayer |
| `enhanced-conversions-push.js` | All same-domain forms | Form submit listener |
| `tel-link-click-tracker.js` | All platforms | Click listener |

---

## How to Implement in GTM (All Snippets)

1. In GTM, go to **Tags → New**
2. Tag type: **Custom HTML**
3. Paste the entire snippet file into the HTML field
4. Firing trigger: **All Pages**
5. Name the tag clearly (e.g. `Custom - HubSpot Form Listener`)
6. Click **Save**
7. Click **Preview** → submit a test form → confirm 
   `form_submit` appears in the dataLayer panel
8. If confirmed → **Publish**

---

## GTM Trigger to Create After Installing a Form Snippet

- **Trigger type:** Custom Event  
- **Event name:** `form_submit`  
- **Optional filter:** `form_platform` equals `hubspot` 
  (or whichever platform)

Apply this trigger to your:
- GA4 Event tag
- Google Ads Conversion tag
- Meta Pixel Lead event tag

---

## Important: Don't Stack Conflicting Tags

| DO | DON'T |
|----|-------|
| Use `universal-iframe-listener.js` for HubSpot | Use `universal-iframe-listener.js` AND `hubspot-form-listener.js` |
| Use one form listener per platform | Stack multiple listeners on the same platform |
| Test in GTM Preview before publishing | Publish without verifying in dataLayer |

---

## Platform Quick Reference

### HubSpot
Uses `postMessage`. Install `universal-iframe-listener.js` 
or `hubspot-form-listener.js`. Do **not** use GTM's native 
form trigger — it cannot reach inside the HubSpot iframe.

### Typeform
Uses `postMessage`. Covered by `universal-iframe-listener.js`.

### JotForm
Uses `postMessage` (stringified JSON). Covered by 
`universal-iframe-listener.js`. Also works with hidden 
field + URL parameter method (see kit PDF).

### Calendly
Uses `postMessage`. Covered by `universal-iframe-listener.js`. 
Fires when a meeting is successfully scheduled.

### ActiveCampaign
Handles both inline JS forms (MutationObserver watching 
for thank-you confirmation) and hosted iframe forms 
(postMessage). Install `activecampaign-listener.js`.

### Contact Form 7 (CF7)
Same-domain — no iframe. Install `contact-form-7-datalayer.js`. 
Fires only after server confirms email sent successfully.

### Gravity Forms
Same-domain — no iframe. Install `gravity-forms-datalayer.js`. 
Handles both AJAX and standard (page-reload) submissions.

### Salesforce Web-to-Lead / Zoho
Does **not** use postMessage. Uses page redirect. 
See `salesforce-thankyou-url.md` for full setup.

### Elementor Forms
Same-domain. GTM's native **Form Submission** trigger 
works in most cases — no custom snippet needed. If it 
doesn't fire, add a Custom HTML tag listening for 
`elementor/forms/submit_success` DOM event.

### WPForms
Same-domain. GTM's native form trigger works. If not, 
listen for `wpforms_ajax_form_submitted` JS event.

---

## GCLID + UTM Capture (`gclid-utm-capture.js`)

Critical for the offline conversion workflow in the kit.

Install on **All Pages**. It will:
- Capture GCLID, FBCLID, MSCLKID on landing from the URL
- Store them for 90 days in localStorage
- Auto-populate hidden form fields on every page
- Push all values to the dataLayer

Add these hidden fields to your JotForm or HubSpot form:
`gclid` | `utm_source` | `utm_medium` | `utm_campaign` | 
`utm_term` | `utm_content`

---

## Enhanced Conversions (`enhanced-conversions-push.js`)

Captures email and phone from any same-domain form submission 
and pushes as `user_data` to the dataLayer. Google Ads reads 
this for Enhanced Conversions — improving match rates 20–40%.

After installing, configure your **Google Ads Conversion tag** 
in GTM:
1. Open the tag → expand **Enhanced Conversions**
2. Enable → set method to **User-provided data from dataLayer**
3. Map `user_data.email` and `user_data.phone_number`

---

## Phone Click Tracking (`tel-link-click-tracker.js`)

Tracks clicks on `tel:` links for businesses without CallRail. 
Creates a `click_to_call` event with the phone number captured.

**Do not use this if you have CallRail installed.** CallRail 
replaces phone numbers dynamically and tracks at a deeper level.

---

## How to Test Any Snippet

1. GTM → **Preview** → enter your site URL → **Connect**
2. Submit your form or click your phone number
3. In Tag Assistant, find the event in the left panel
4. Click it → **Data Layer** tab → confirm all values populated
5. Confirm your GA4, Google Ads, and Meta tags show as **Fired**

---

## Included With Your Kit Purchase

Your Privy Clear Local Service Lead Tracking Kit includes a 
**free 30-minute support call** with Hannah or Sara. If a 
snippet isn't working after testing, that's exactly what 
the call is for.

📧 Hello@PrivyClear.com — subject line: "Support Call"  
🌐 [PrivyClear.com](https://privyclear.com)

---

*Maintained by Privy Clear. Last updated April 2026.*
