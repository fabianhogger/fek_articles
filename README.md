# fek-site

The public site for the ΦΕΚ article engine: one article per important gazette
act, each with a timeline that grows when a later ΦΕΚ amends or implements it,
plus a one-line-per-act daily digest.

The articles are written by the engine in
[`fabianhogger/fek`](https://github.com/fabianhogger/fek) (`fek-daily-tweet/src/engine/`).
This repository only renders them. Nothing here calls a model or the gazette.

```
src/content/articles/<slug>.md   one article: JSON frontmatter (data) + Markdown body (prose)
src/content/digest/<date>.md     one day's digest lines
src/content.config.ts            the schema — a malformed file fails the build
```

## Develop

```bash
npm ci
npm run dev          # http://localhost:4321 — search needs a build
npm run build        # astro build + pagefind index into dist/
npm run preview
```

## How content arrives

1. **Seed**, once, from your machine, into this checkout:
   ```bash
   cd ../fek/fek/fek-daily-tweet
   .venv/bin/python scripts/seed.py --from 2026-07-01 --to 2026-10-23 --store-dir ../../../fek_int
   ```
   Review `src/content/`, delete or fix what you don't want, commit, then upload the
   engine's state so the nightly run continues from it:
   ```bash
   aws s3 sync . s3://<ArticlesBucket>/ --exclude '*' --include 'src/content/*' --include '.engine/*'
   ```
2. **Nightly**, the publisher Lambda commits the night's changes as one commit —
   an `engine/<date>` pull request in `PUBLISH_MODE=pr`, straight to `main` in
   `direct`. Edits you make to an article on GitHub are copied back to the engine,
   so the next update builds on your version.

Only `status: "published"` articles appear on the site. `draft` (failed a
verification check — the reasons are in `verify_errors`) and `stub` (route-only
seed pass) are kept for review and excluded from the build.

## Deploy: Cloudflare Pages

Workers & Pages → Create → Pages → connect this repository.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `SITE_URL=https://<your domain>` |

Node comes from `.node-version`. Every push to `main` deploys; every engine pull
request gets a preview URL, which is the place to review a night's articles.
