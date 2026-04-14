# Privy Clear — GTM Snippets

**Advanced GTM code snippets for CRM form tracking, iframe 
listeners, and form integrations.**

Companion resource to the [Local Service Lead Tracking Kit](https://privyclear.com).  
Built and maintained by [Privy Clear](https://privyclear.com) — Hannah Fox & Sara Chambers.

---

## Who This Is For

You purchased the Privy Clear Local Service Lead Tracking Kit 
and your form isn't firing in GTM — or you're using a CRM 
like HubSpot, Gravity Forms, or Contact Form 7 that requires 
a custom implementation.

These snippets solve the most common form tracking failures 
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

## Files in This Repo

| File | Platform | Method |
|------|----------|--------|
| `universal-iframe-listener.js` | HubSpot, Typeform, JotForm, Calendly | postMessage listener |
| `hubspot-form-listener.js` | HubSpot only | postMessage listener |
| `contact-form-7-datalayer.js` | WordPress CF7 | DOM event listener |
| `gravity-forms-datalayer.js` | WordPress Gravity Forms | jQuery event listener |
| `salesforce-thankyou-url.md` | Salesforce, Zoho | Thank-you URL trigger |

**Use `universal-iframe-listener.js` OR `hubspot-form-listener.js` 
— not both. Using both will fire duplicate events.**

---

## How to Implement in GTM (All Snippets)

1. In GTM, go to **Tags → New**
2. Tag type: **Custom HTML**
3. Paste the entire snippet file contents into the HTML field
4. Firing trigger: **All Pages**
5. Name the tag clearly (e.g. `Custom - HubSpot Form Listener`)
6. Click **Save**
7. Click **Preview**, submit a test form, confirm the 
   `form_submit` event appears in the dataLayer panel
8. If confirmed → **Publish**

---

## GTM Trigger to Create After Installing

Once a snippet is installed, create a trigger so your 
conversion tags know when to fire:

- **Trigger type:** Custom Event  
- **Event name:** `form_submit`  
- **Optional filter:** `form_platform` equals `hubspot` 
  (or whichever platform you're using)

Apply this trigger to your:
- GA4 Event tag
- Google Ads Conversion tag
- Meta Pixel Lead event tag

---

## How to Test

1. In GTM, click **Preview** → enter your site URL → **Connect**
2. Submit your form on the live site
3. In the Tag Assistant panel, look for `form_submit` in the 
   Events list on the left
4. Click it → check the **Data Layer** tab → confirm 
   `form_platform` and `form_id` are populated
5. Check that your GA4, Google Ads, and Meta tags all show 
   as **Fired** for that event

---

## Platform Quick Reference

### HubSpot
Uses `postMessage`. Install `universal-iframe-listener.js` 
or `hubspot-form-listener.js`. Do **not** use GTM's native 
form trigger — it cannot reach inside the HubSpot iframe.

### Typeform
Uses `postMessage`. Covered by `universal-iframe-listener.js`.

### JotForm
Uses `postMessage` with stringified JSON. Covered by 
`universal-iframe-listener.js`. Note: JotForm also works 
well with hidden field + URL parameter method (see kit PDF).

### Calendly
Uses `postMessage`. Covered by `universal-iframe-listener.js`. 
Fires when a meeting is successfully scheduled — useful for 
tracking booked appointments as conversions.

### Contact Form 7 (CF7)
Same-domain — no iframe. Install `contact-form-7-datalayer.js`. 
Fires only after server confirms email sent successfully.

### Gravity Forms
Same-domain — no iframe. Install `gravity-forms-datalayer.js`. 
Handles both AJAX and standard (page-reload) form submissions.

### Salesforce Web-to-Lead / Zoho
Does **not** use postMessage. Uses page redirect instead. 
See `salesforce-thankyou-url.md` for setup instructions.

### Elementor Forms
Same-domain. Use GTM's native **Form Submission** trigger 
with trigger condition: `CSS Selector` matches `.elementor-form`. 
No custom snippet needed.

### WPForms
Same-domain. GTM's native form trigger works in most cases. 
If not, listen for the `wpforms_ajax_form_submitted` JS event 
using a Custom HTML tag.

---

## Included With Your Kit Purchase

Your Privy Clear Local Service Lead Tracking Kit includes a 
**free 30-minute support call** with Hannah or Sara. If a 
snippet isn't working after testing, that's exactly what 
the call is for.

📧 Hello@PrivyClear.com — subject line
