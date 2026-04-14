# Salesforce Web-to-Lead — GTM Tracking

## Why it's different
Salesforce Web-to-Lead forms do **not** fire a postMessage event.
Instead, they redirect the full page (or iframe) to a confirmation
URL after submission. This means the postMessage listener approach
will not work. Use URL-based GTM triggers instead.

---

## Method 1 — Thank-You Page URL Trigger (Recommended)

Set up Salesforce to redirect to a dedicated confirmation page
on your own domain after submission, e.g.:
`https://yourdomain.com/thank-you`

Then in GTM:

**Create a Trigger:**
- Trigger type: Page View
- Fire on: Some Page Views
- Condition: Page URL → contains → `/thank-you`

**Apply that trigger to your conversion tags:**
- GA4 Event tag (event name: `form_submit`)
- Google Ads Conversion tag
- Meta Pixel Lead event tag

---

## Method 2 — Salesforce retURL Parameter

In your Web-to-Lead form HTML, set the hidden `retURL` field
to your thank-you page:

```html
<input type="hidden" name="retURL"
  value="https://yourdomain.com/thank-you" />
```

GTM will fire on the page load of that URL automatically
using the trigger from Method 1.

---

## Zoho CRM Forms
Same approach — Zoho forms redirect on submission.
Set the "Redirect URL" in Zoho form settings to your thank-you
page and use the same GTM URL trigger above.

---

## Notes
- Make sure your thank-you page URL is unique enough to not
  trigger accidentally (avoid just `/thank-you` if you have
  multiple form types — use `/contact-thank-you`, `/quote-thank-you`)
- Test using GTM Preview mode — navigate to the thank-you URL
  directly and confirm the tags fire
