# Vantara in Figures — national statistics portal

A static, fully offline national statistics website entry for the make.fun bounty
[Make the best national statistics site (best-national-statistics-site-20261126-0539)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539).

- Vanilla HTML/CSS/JS under `app/` — no frameworks, no build step, no network requests; works on desktop and phone.
- SVG charts drawn from the internal dataset `app/js/data.js`; working year selector and sortable tables.
- `main.ts` (Node 22, stdlib only) copies `app/` and `screenshots/` to the output dir and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`).
- Run locally: `node serve.ts` (kit) or any static server rooted at `app/`. Entry build: `MAKEFUN_OUTPUT_DIR=out node main.ts`.

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/hzelnutzz/vantara-stats-01/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/hzelnutzz/vantara-stats-01/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
