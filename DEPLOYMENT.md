# Deploy to Cloudflare Workers

This site uses **Workers Static Assets**: Cloudflare serves the HTML, CSS, images, and PDF directly. No Worker JavaScript, database, or application secrets are needed. The first successful deployment creates the Worker named `magenhabayit`, as configured in `wrangler.jsonc`.

## Recommended: Cloudflare Git deployment

Connect this GitHub repository in Cloudflare's Worker creation screen and enter:

| Field | Value |
| --- | --- |
| Project name | `magenhabayit` |
| Production branch | `main` |
| Root directory (if shown) | Repository root |
| Build command | `python3 tools/package_site.py` |
| Deploy command | `npx --yes wrangler@4.149.0 deploy` |
| Preview builds | Off |
| Protect with Cloudflare Access | Off for the public website |

Leave the preview command unused with preview builds off. Cloudflare's integration handles deployment authentication; no GitHub Actions secrets are needed for this approach. The repository workflow is manual-only to avoid deploying each push twice. Future pushes to `main` deploy through Cloudflare Workers Builds.

## Optional: manual GitHub Actions fallback

Only configure this if you want to deploy manually from GitHub instead of Cloudflare's build integration:

1. Create a Cloudflare API token with **Account → Workers Scripts → Edit**, restricted to the account that owns the Worker.
2. Add GitHub Actions **Secret** `CLOUDFLARE_API_TOKEN` and **Variable** `CLOUDFLARE_ACCOUNT_ID` under repository **Settings → Secrets and variables → Actions**.
3. Run **Actions → Manual deployment to Cloudflare Workers** on `main`.

The workflow does not trigger on pushes or pull requests. `CLOUDFLARE_PAGES_PROJECT` is not used. Keep tokens only in GitHub Secrets, never in source files or chat. Restrict repository write access because workflow changes can use deployment credentials.

Any existing Pages project is not automatically migrated or deleted. If `magenhabayit.org` points to Pages, remove that custom-domain association before attaching it to the Worker. Preserve the old deployment until the Worker has been verified.

If Cloudflare asks you to select a `workers.dev` subdomain for the account, complete that one-time setup in **Workers & Pages**. Choose a different Worker name in `wrangler.jsonc` before deployment if an existing unrelated Worker already uses `magenhabayit`.

The optional workflow runs manually on `main`. Production runs are serialized. Protect repository write access and `main` for both deployment methods.

## Attach magenhabayit.org

1. After deployment, open **Workers & Pages → magenhabayit → Settings → Domains & Routes**.
2. Choose **Add → Custom Domain**, enter `magenhabayit.org`, and follow Cloudflare's activation steps. Choose a Custom Domain, rather than a route pattern such as `magenhabayit.org/*`.
3. If an existing web DNS record conflicts, review it before replacing it. Preserve MX and email-related TXT records. Confirm you intend to replace any existing website.
4. Wait for the domain and certificate to activate. Verify `https://magenhabayit.org/` and `https://magenhabayit.org/donate`.
5. Optionally attach `www.magenhabayit.org` as another Custom Domain. A Cloudflare Redirect Rule can redirect it to the apex domain, preserving the path and query string.
6. Enable **Always Use HTTPS** for the zone if appropriate for its existing services. Enable HSTS only after verifying HTTPS works.

The domain is managed separately in the dashboard; CI does not modify DNS. Subsequent deployments update the same Worker and retain its dashboard-managed Custom Domain. No domain registrar password or DNS API token is needed in GitHub.

## Packaging and local validation

From the repository root:

```sh
python tools/package_site.py
npx --yes wrangler@4.149.0 deploy --dry-run --config wrangler.jsonc
npx --yes wrangler@4.149.0 dev --local --config wrangler.jsonc
```

The script creates `dist/site` for Wrangler and `dist/magenhabayit-site.zip` as a downloadable copy. Only the nine explicitly listed public files are included. Git metadata, internal documentation, deployment configuration, and workflow files are excluded.

The workflow runs the packaging command and a pinned Wrangler deployment CLI. There is no npm application dependency installation or build step.

## Verify the published site

- Both pages load over HTTPS, including the founder statement and Michigan service area.
- Navigation works on desktop and mobile; `/donate` serves the donation page and `.html` links normalize automatically.
- QR and PDF load. Confirm the supplied Zelle link and QR identify the intended account in the organization's banking app; decoding cannot establish account ownership.
- `_headers` applies Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy to static responses.
- Existing domain email still works after any DNS changes.

No deployment, account change, or DNS change has been performed from this environment. The Cloudflare Git integration deploys using its own account authentication. The optional manual GitHub Actions fallback requires its separate account ID and Workers token.
