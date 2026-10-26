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

Production builds send pageviews and web vitals to PostHog (EU cloud), the same project as the landing page, in cookieless mode. The public key is `NEXT_PUBLIC_POSTHOG_KEY` in `.env.production`. The Worker proxies `/ingest/*` to PostHog, so ad blockers do not drop the events. Every event carries `source`: the `utm_source` or `ref` parameter, else the referring site (`landing` for usespotlight.ai), else `direct`.
