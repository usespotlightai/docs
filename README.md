# Spotlight docs

The documentation site for Spotlight, built with [Fumadocs](https://fumadocs.dev)
on Next.js.

```bash
npm install
npm run dev          # http://localhost:3000/docs
npm run build        # static export in out/
npx wrangler dev     # serve out/ through the Worker, on :8787
npm run lint:prose   # house-style checks on every page
npm run lint:links   # every internal link and anchor resolves
```

The site is deployed to [docs.usespotlight.ai](https://docs.usespotlight.ai) as the `docs` Cloudflare Worker, with Workers Builds.
`worker/index.ts` returns Markdown for `/docs/<page>.md` and for requests that prefer `text/markdown`.
