# MaxK Cyber Site

A modern Vite/React website for MaxK Cyber, positioned around launch-ready
security for fast-moving founders, agencies, and growth teams.

## Product Direction

The site is built as a product-led trust experience rather than a static
brochure. It includes:

- An interactive readiness scan with a shareable recommendation summary.
- A rotating market-signal gallery for current buyer and threat pressures.
- A Launch Validator that checks public URL, HTTPS, security contact, privacy,
  auth/data fit, proof URLs, and copyable validation summaries.
- A Trust Packet Studio that tailors evidence bundles, objection answers, and
  next steps for different buyer moments.
- A persistent Action Plan Builder with scenario-specific tasks, completion
  tracking, custom tasks, and Markdown copy/download.
- A guided launch-hardening flow that explains how an engagement works.
- Service cards focused on buyer confidence, launch hardening, and incident
  readiness.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run build
```

## GitHub Pages

The Vite base path is configured for:

```text
/siteweb/
```

The Pages workflow in `.github/workflows/pages.yml` installs dependencies, runs
tests, builds the site, uploads `dist`, and deploys with GitHub Pages actions.

If GitHub Pages is not already configured to use GitHub Actions, update the
repository setting:

```text
Settings > Pages > Source > GitHub Actions
```
