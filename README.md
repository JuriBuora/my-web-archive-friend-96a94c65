# Juri Buora Cybersecurity Learning Site

Public React/Vite site for [juribuora.com](https://juribuora.com/). It presents my cybersecurity learning log as a fast static site while keeping the original writing in the Jekyll source repo: [JuriBuora.github.io](https://github.com/JuriBuora/JuriBuora.github.io).

## What this project demonstrates

- React + Vite + TypeScript static-site build
- Route-level code splitting for faster first load
- Markdown post rendering with syntax highlighting
- Static JSON snapshots generated from the upstream Jekyll repo
- Sitemap and route shell generation for GitHub Pages
- GitHub Actions deployment to GitHub Pages
- Unit tests for route and date behavior

## How the content flow works

1. I write posts in `JuriBuora/JuriBuora.github.io`.
2. `scripts/sync-jekyll-content.mjs` reads the public GitHub tree and raw Markdown files.
3. The script writes a generated manifest and per-post JSON snapshots under `public/generated/`.
4. The React app reads those local snapshots, so the browser does not depend on the GitHub API.
5. GitHub Actions rebuilds the site on pushes and on a schedule.

## Local development

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run lint
npm run test
npm run build
npm audit
```

## Deployment

Deploys run through `.github/workflows/deploy.yml` and publish the generated `dist/` artifact to GitHub Pages.

The custom domain is configured through `public/CNAME`.

## Notes for reviewers

This is not meant to be a complex backend application. The point is to show that I can maintain a real public site, automate content ingestion, keep dependencies clean, test small pieces of behavior, and explain how the publishing flow works end to end.
