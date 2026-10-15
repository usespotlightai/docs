# Spotlight docs

The documentation site for Spotlight, built with [Fumadocs](https://fumadocs.dev)
on Next.js.

```bash
npm install
npm run dev          # http://localhost:3000/docs
npm run build        # static export in out/
npx wrangler pages dev   # serve out/ as Cloudflare Pages does, on :8788
npm run lint:prose   # house-style checks on every page
npm run lint:links   # every internal link and anchor resolves
```

The site is deployed to [docs.usespotlight.ai](https://docs.usespotlight.ai) on Cloudflare Pages.
`functions/_middleware.ts` returns Markdown for `/docs/<page>.md` and for requests that prefer `text/markdown`.
