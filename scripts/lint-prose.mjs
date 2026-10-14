import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../content/docs/', import.meta.url).pathname;

const banned = [
  'delve', 'tapestry', 'realm', 'paradigm', 'embark', 'testament', 'robust',
  'comprehensive', 'cutting-edge', 'leverage', 'leveraging', 'pivotal',
  'underscore', 'underscores', 'meticulous', 'meticulously', 'seamless',
  'seamlessly', 'game-changer', 'holistic', 'actionable', 'impactful',
  'synergy', 'interplay', 'genuinely', 'genuine', 'truly', 'crucial', 'foster',
  'elevate', 'empower', 'streamline', 'facilitate', 'facilitates', 'myriad',
  'plethora', 'nuanced', 'cornerstone', 'paramount', 'poised', 'quietly',
  'deeply', 'utilize', 'utilise', 'boasts', 'powerful', 'effortless',
  'effortlessly', 'simply', 'easily', 'landscape', 'ecosystem', 'unlock',
  'unleash', 'supercharge', 'journey', 'bustling', 'vibrant', 'intricate',
];

const phrases = [
  'in order to', 'due to the fact', 'serves as', 'it is worth noting',
  "it's worth noting", 'worth noting', 'notably', 'importantly',
  'in summary', 'in conclusion', 'to summarize', 'moreover', 'furthermore',
  'additionally', "let's dive", 'dive into', 'deep dive', 'at its core',
  'when it comes to', 'at the end of the day', 'here is the thing',
  "here's the thing", 'the best part', 'note that', 'keep in mind',
  'rest assured', 'out of the box', 'under the hood', 'first-class',
  'best practices', 'a wide range', 'a variety of', 'you will learn',
  'we will learn', 'load-bearing', 'not only', 'plays a key role',
];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.mdx')) files.push(path);
  }
};
walk(root);

const problems = [];
const report = (file, line, message) =>
  problems.push(`${relative(root, file)}:${line}: ${message}`);

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const type = (text.match(/^type:\s*(\S+)/m) || [])[1];
  if (!type) report(file, 1, 'frontmatter has no type');
  const home = relative(root, file) === 'index.mdx';
  if (type === 'overview' && !home) report(file, 1, 'only the home page is an overview');
  if (!home && !/^icon:/m.test(text)) report(file, 1, 'frontmatter has no icon');
  let fenced = false;
  let frontmatter = false;

  lines.forEach((raw, index) => {
    const n = index + 1;
    if (index === 0 && raw === '---') {
      frontmatter = true;
      return;
    }
    if (frontmatter) {
      if (raw === '---') frontmatter = false;
      else if (raw.startsWith('title:') && type === 'how-to') {
        if (/^title:\s*(How to |[A-Z][a-z]+ing\b)/.test(raw)) report(file, n, 'how-to title must start with an imperative verb');
      }
      if (/[—–]/.test(raw)) report(file, n, 'dash in frontmatter');
      if (/^(title|description):\s+[^"'\s].*:\s/.test(raw)) report(file, n, 'quote a frontmatter value that contains ": "');
      return;
    }
    if (/^\s*```/.test(raw)) {
      fenced = !fenced;
      return;
    }
    if (fenced) return;

    const prose = raw.replace(/`[^`]*`/g, '').replace(/\]\([^)]*\)/g, ']');
    if (/—|–|\s--\s/.test(prose)) report(file, n, 'em or en dash');
    if (/^#\s/.test(raw)) report(file, n, 'H1 in body; the title is the H1');
    const heading = raw.match(/^#{2,6}\s+(.*)$/);
    if (heading) {
      const words = heading[1].split(/\s+/).slice(1).filter((w) => /^[A-Z][a-z]/.test(w));
      if (words.length >= 2) report(file, n, `heading may be title case: ${heading[1]}`);
    }
    const lower = prose.toLowerCase();
    for (const word of banned) {
      if (new RegExp(`\\b${word}\\b`).test(lower)) report(file, n, `word: ${word}`);
    }
    for (const phrase of phrases) {
      if (lower.includes(phrase)) report(file, n, `phrase: ${phrase}`);
    }
    if (/[“”‘’]/.test(prose)) report(file, n, 'curly quote');
    if (/\bit'?s not\b[^.]*\bit'?s\b/i.test(prose)) report(file, n, 'possible "it\'s not X, it\'s Y"');
    if ((type === 'reference' || type === 'concept') && /\*\*[^*]+\*\*/.test(prose) && !/^\s*\|/.test(raw)) {
      report(file, n, 'bold in reference or explanation prose');
    }
    if (type === 'get-started' && /\byou will learn\b/i.test(prose)) report(file, n, 'tutorial promises learning');
    const plural = type === 'get-started' && prose.match(/\b(we|us|our|ours|ourselves|let's)\b/i);
    if (plural) report(file, n, `tutorial says "${plural[1]}"; address the reader as "you" and name Spotlight`);
  });
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\n${problems.length} problem(s) in ${files.length} file(s)`);
  process.exit(1);
}
console.log(`No problems in ${files.length} file(s)`);
