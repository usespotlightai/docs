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
    const { pathname } = new URL(request.url);

    const suffix = rewriteSuffix(pathname);
    if (suffix) return markdown(env, request, suffix, false);

    if (isMarkdownPreferred(request)) {
      const docs = rewriteDocs(pathname);
      if (docs) return markdown(env, request, docs, true);
    }

    return env.ASSETS.fetch(request);
  },
};
