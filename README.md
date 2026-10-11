# Magen Habayit

A responsive, two-page nonprofit website built with plain HTML and CSS. No build step, JavaScript, external fonts, or application dependencies are required.

## Plan and design

- `index.html`: About us, mission, the 50/50 assistance program, repair examples, Isaac’s founder statement, the supplied family testimonial, and donation calls to action.
- `donate.html`: Zelle link and QR, recipient confirmation, original downloadable PDF, payment guidance, and future payment options.
- `styles.css`: Shared navy, warm gold, cream, and sage palette; serif headings and system-font body text; mobile layouts, visible keyboard focus, and skip navigation.
- `assets/home.svg`: Original home illustration. The design uses familiar nonprofit conventions without copying another organization's branding, artwork, text, or layout.

## Run locally

From `/workspace/MagenHabayitWebsite`:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Serve this directory with any static web host for deployment. Configure HTTPS and a redirect from HTTP at the host. There are no secrets or payment credentials to configure for this version.

## Zelle

The link in `donate.html` was decoded from the supplied PDF's QR code. The PNG preserves that same code. The encoded payment name is `MAGEN HABAYIT`, with token `magenhabayit`. The link is on `https://enroll.zellepay.com/qr-codes`.

Decoding identifies the supplied destination; it does not verify ownership of the account or bank compatibility. Before publishing, the organization should test both the QR and link on its supported banking apps, confirm the intended recipient, and authorize use of the testimonial. No payment was sent during development.

## Adding payment providers

Replace the “More ways to give” placeholder only after the organization creates and verifies its official hosted donation page. Add a normal HTTPS anchor to that destination, using `target="_blank" rel="noopener noreferrer"` if opening a new tab. Use the provider's name as the label and explain that it opens externally. Never put secret API keys into HTML. Do not collect payment details or claim payment success on this static website. Automatic receipts or payment confirmation require a separate provider integration with verified server-side webhooks.

## Payment-link security

Hosted payment links keep banking and card details with the provider and reduce the website's payment-data exposure. They still require care:

- Verify the exact HTTPS destination and account before publishing; avoid URL shorteners or destinations supplied through query parameters.
- Protect hosting, domain registrar, repository, and provider accounts with MFA and limited access. A compromised site can replace both a link and QR code.
- Tell donors to confirm the recipient in their banking app. Zelle transfers may be difficult to reverse; do not imply purchase protection.
- Keep the QR image and link consistent and recheck them whenever changing payment information.
- Use HTTPS. Set security headers at the hosting platform, ideally `Content-Security-Policy: default-src 'self'; img-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: no-referrer`. Enable HSTS after verifying HTTPS for the domain.
- This version has no forms, cookies, analytics, or third-party embeds. Review privacy obligations if adding them later.

No tax-deductibility, registration, impact totals, contact details, or payment providers have been invented. Add verified organization contact and tax/receipt information before a public launch where appropriate.

## Cloudflare Workers deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for upload and domain setup. Run `python tools/package_site.py` to generate a curated deployment ZIP. Cloudflare Workers Static Assets security headers, canonical URLs for `magenhabayit.org`, robots.txt, and a sitemap are included.

Cloudflare Workers Builds is the primary automatic deployment method. `.github/workflows/deploy.yml` is a manual-only fallback. See DEPLOYMENT.md for dashboard commands and optional GitHub credentials.

## Application forms

`/receive-aid` links to the family Google Form. `/contract-with-us` links to the contractor responder form, rather than its editor. Both pages open hosted forms in a new tab; no application information is collected on this website. The form owner must publish forms and enable the intended responder access.
