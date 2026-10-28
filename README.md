# Apulza Website

A simple React + TypeScript marketing page powered by Vite.

## Live Preview

[View the live website](https://apulza-website.apulza.workers.dev/)

## Scripts

- `npm run dev` starts the local dev server.
- `npm run build` creates a production build in `dist`.
- `npm run preview` serves the production build locally.

## Beta signup

The student beta form posts to `/api/beta-signup`. The school conversation form posts to
`/api/school-inquiry`. Both are handled by the Cloudflare Worker in `src/worker.ts` and stored
in D1. Apply the migrations before deploying the Worker. When the optional Sheets webhook is
configured, both kinds of requests are copied to the `Sign-ups` sheet with a `Lead type` column.
General questions use the contact email shown on the site.
