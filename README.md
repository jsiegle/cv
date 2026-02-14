# CV Site Generator

This template generates two CV variants from one Markdown source:

- `highlights` (short version)
- `complete` (full version)

Outputs:

- HTML: `_site/index.html` and `_site/complete/index.html`
- PDF: `output/highlights.pdf` and `output/complete.pdf`

## Quickstart

```bash
npm install
npm run build
```

For local preview:

```bash
npm run dev
```

## Content model

Edit `src/data/cv.md`.

- YAML front matter stores structured sections (`positions`, `publications`, `awards`, etc.)
- Markdown body becomes the summary paragraph under the header

### Notes

- Use `publications.highlights` and `publications.complete` to control short/full output.
- Same split is available for `awards` and `talks`.
- Add/edit profile links in `links` to include GitHub, personal site, Scholar, and more.

## Build steps

1. Eleventy reads `src/data/cv.md` via `.eleventy.js` and builds the two pages.
2. `scripts/render-pdf.mjs` runs Playwright against the built site and writes two PDFs.
