const SOURCES: [RegExp, string][] = [
  [/(^|\.)ycombinator\.com$/, 'hackernews'],
  [/(^|\.)producthunt\.com$/, 'producthunt'],
  [/^(chatgpt\.com|chat\.openai\.com)$/, 'chatgpt'],
  [/(^|\.)perplexity\.ai$/, 'perplexity'],
  [/^claude\.ai$/, 'claude'],
  [/^gemini\.google\.com$/, 'gemini'],
  [/^copilot\.microsoft\.com$/, 'copilot'],
  [/(^|\.)reddit\.com$/, 'reddit'],
  [/^(t\.co|x\.com|twitter\.com)$/, 'x'],
  [/^(linkedin\.com|lnkd\.in)$/, 'linkedin'],
  [/(^|\.)github\.com$/, 'github'],
  [/^usespotlight\.ai$/, 'landing'],
  [/^docs\.usespotlight\.ai$/, 'docs'],
  [/(^|\.)google\.[a-z.]+$/, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
  [/(^|\.)duckduckgo\.com$/, 'duckduckgo'],
];

function named(host: string) {
  const bare = host.toLowerCase().replace(/^www\./, '');
  return SOURCES.find(([pattern]) => pattern.test(bare))?.[1] ?? bare;
}

function referrerHost(referrer: string) {
  try {
    return new URL(referrer).hostname;
  } catch {
    return null;
  }
}

export function trafficSource(url: URL, referrer: string) {
  const tagged =
    url.searchParams.get('utm_source') ?? url.searchParams.get('ref');
  if (tagged) return named(tagged);

  const host = referrerHost(referrer);
  if (!host) return 'direct';
  if (host === url.hostname) return 'internal';
  return named(host);
}
