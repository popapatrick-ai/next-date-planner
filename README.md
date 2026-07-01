# Next Date Planner

A playful, single-page static website for deciding what Arianna should do this Saturday. It is built with plain HTML, CSS, and JavaScript, with no backend, package install, build step, paid services, or remote assets.

## Files

- `index.html` - the full page structure
- `styles.css` - responsive styling, animations, and the soft visual system
- `script.js` - button behavior, countdown, date ideas, confetti, and tiny generated sound effects
- `.github/workflows/pages.yml` - GitHub Pages deployment workflow

## Run Locally

Open `index.html` in a browser, or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Deploy To GitHub Pages

This repository includes a GitHub Actions workflow that deploys the static site to GitHub Pages after pushes to `main`.

No backend or environment variables are required.
