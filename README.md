# Apulza Website

A simple React + TypeScript marketing page powered by Vite.

## Live Preview

[View the live website](https://apulza-website.apulza.workers.dev/)

## Scripts

- `npm run dev` starts the local dev server.
- `npm run build` creates a production build in `dist`.
- `npm run preview` serves the production build locally.

## Beta signup

The beta signup form posts to `/api/beta-signup` and is handled by the Cloudflare Worker in
`src/worker.ts`. General questions and school demo requests use the contact email shown on the site.
