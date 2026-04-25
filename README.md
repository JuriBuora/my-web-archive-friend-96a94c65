# juribuora.com — From Zero to Cybersecurity

Public learning log built with **React + Vite + TypeScript + Tailwind**, hosted on **GitHub Pages** at <https://juribuora.com>.

The source content lives in a separate Jekyll repo: <https://github.com/JuriBuora/JuriBuora.github.io>.

This repo now mirrors that content at build time:

- the homepage and filters use a generated local manifest
- each post page loads a same-origin static JSON snapshot
- GitHub Pages redeploys on `main` pushes and also refreshes itself every 30 minutes

That means the browser no longer depends on the public GitHub API, while new posts from the Jekyll repo still flow over automatically.

## Publishing flow

1. Add a new markdown post in `JuriBuora/JuriBuora.github.io` under `Blog/_posts/` or `Labs/_posts/`.
2. Commit and push to the `my-blog` branch there.
3. `juribuora.com` picks it up on the next scheduled refresh, or the next manual deploy of this repo.

The mirrored site does not need a manual edit to `posts.ts` or any other content list.

## Local development

```bash
npm install
npm run dev
```

Before `dev` and `build`, the repo runs:

```bash
npm run sync:jekyll
```

That script refreshes the generated snapshot from the upstream Jekyll repo. If GitHub is temporarily unavailable, it falls back to the last generated snapshot already stored in this repo.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which:

1. installs dependencies with `npm ci`
2. regenerates the mirrored snapshot during `prebuild`
3. builds the site
4. publishes `dist/` to GitHub Pages

The same workflow also runs every 30 minutes so upstream Jekyll posts propagate automatically to `juribuora.com`.

## Project structure

```text
src/
  components/                   UI building blocks
  pages/                        Route components
  data/
    posts.ts                    Shared post and snapshot types
    jekyllSnapshot.generated.ts Auto-generated manifest used by the app
  hooks/usePosts.ts             Thin wrapper around the generated snapshot
scripts/
  sync-jekyll-content.mjs       Pulls posts from the Jekyll repo and writes generated assets
  generate-sitemap.ts           Builds sitemap.xml from the generated manifest
public/
  generated/
    manifest.json               Mirror manifest for build tooling and debugging
    posts/                      Per-post JSON snapshots loaded by post pages
  404.html                      SPA fallback for GitHub Pages deep links
  CNAME                         Custom domain
```

## Configuration

The upstream repo, branch, and folder mapping are defined in `scripts/sync-jekyll-content.mjs`.

If you ever change the Jekyll repo layout, update that file and rerun:

```bash
npm run sync:jekyll
```
