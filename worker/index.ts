import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '../lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

const MOVED: Readonly<Record<string, string>> = {
  '/docs/improvement/why-a-search-holds-tasks-back':
    '/docs/improvement/why-a-search-holds-tasks-out',
  '/docs/administration/ways-in-pools-trusts-and-tokens':
    '/docs/administration/pools-trusts-and-tokens',
  '/docs/lines/give-stations-a-skill': '/docs/lines/enable-skills-at-a-station',
  '/docs/hosts/admit-hosts-through-a-runner-trust':
    '/docs/hosts/run-hosts-without-a-stored-token',
  '/docs/integrations/give-stations-a-tool-from-an-http-api':
    '/docs/integrations/add-a-tool-from-an-http-api',
};

interface Env {
  ASSETS: { fetch: (input: Request | URL) => Promise<Response> };
}

async function markdown(env: Env, request: Request, path: string, vary: boolean) {
  const asset = await env.ASSETS.fetch(new URL(path, request.url));
  const response = new Response(asset.body, asset);
  response.headers.set('Content-Type', 'text/markdown; charset=utf-8');
  // this URL has two representations, selected by `Accept`
  if (vary) response.headers.set('Vary', 'Accept');
  return response;
}

export default {
  async fetch(request: Request, env: Env) {
    const { pathname, search } = new URL(request.url);

    const asMarkdown = pathname.endsWith('.md') ? '.md' : '';
    const moved = MOVED[pathname.replace(/(\.md|\/)$/, '')];
    if (moved) {
      return Response.redirect(
        new URL(moved + asMarkdown + search, request.url),
        301,
      );
    }

    const suffix = rewriteSuffix(pathname);
    if (suffix) return markdown(env, request, suffix, false);

    if (isMarkdownPreferred(request)) {
      const docs = rewriteDocs(pathname);
      if (docs) return markdown(env, request, docs, true);
    }

    return env.ASSETS.fetch(request);
  },
};
