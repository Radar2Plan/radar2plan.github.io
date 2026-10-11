# Radar2Plan project website

Prepared destination: **https://radar2plan.github.io/**

This is the existing public Radar2Plan page extracted from
[YaoLingHomePage](https://github.com/YaoLING1111/YaoLingHomePage) and prepared for
independent GitHub Pages hosting. It preserves the layout, experiments,
interactive charts, and the 19 existing web videos.

## Requested updates

- Remove the separate Ling Yao link above the title and the homepage link in the footer.
- Link author names to verified pages: Ling Yao's homepage, Yichun Xiao's PAIRS Lab
  profile, Fangqiang Ding's homepage, and Jin Jin's Oxford Robotics Institute profile.
  Authors without a verified page
  remain plain text.
- Paper/PDF links and BibTeX refer to arXiv:2610.06121.
- Replace the anonymous-manuscript and pending-arXiv resource text.
- Retain only “Design inspired by FADA” in the design-credit line.
- Add scholarly metadata for the public preprint and use the standalone root URL.

## Local review

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:8010/. In development, figures and videos load from the
existing public website. No video files are downloaded into the D-drive source
checkout. The production build uses assets hosted on the new Pages site.

## Migration

1. Under the `Radar2Plan` account or organization, create a **public** repository
   named **radar2plan.github.io**. Keep it empty initially.
2. Upload this directory's source files, including `.github/workflows/pages.yml`,
   `package-lock.json`, `asset-manifest.json`, and LICENSE; exclude
   `node_modules`, `.astro`, `dist`, and local environment files.
3. In the new repository, go to **Settings → Pages → Build and deployment →
   Source → GitHub Actions**.
4. The included workflow builds and publishes the site. When it succeeds, review
   https://radar2plan.github.io/.
5. After the new URL is verified, update the personal homepage's project link.
   Retain the existing page until the new site works.

The workflow downloads 41 curated public media assets (about 86 MB total) from
a pinned source commit, verifies each file against its original Git blob hash,
then includes them in the deployment artifact. This keeps videos out of the
source repository while making the deployed website independent of the old
Vercel site's runtime.

## Content maintenance

- `src/components/research/radar2plan-data.ts`: author links, resources, BibTeX,
  and aggregate result values.
- `src/components/research/Radar2PlanPage.astro`: page text and structure.
- `src/components/research/radar2plan-demos.ts`: video labels and metadata.
- `src/components/research/radar2plan.css`: existing page design.
- `asset-manifest.json`: original source commit and exact media checksums.

See SOURCE_PROVENANCE.md and LICENSE for retained source attribution.
