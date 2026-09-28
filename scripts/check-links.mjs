import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../content/docs/', import.meta.url).pathname;
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.mdx')) files.push(path);
  }
};
walk(root);

const fileFor = (slug) => {
  const base = join(root, slug);
  if (existsSync(`${base}.mdx`)) return `${base}.mdx`;
  if (existsSync(join(base, 'index.mdx'))) return join(base, 'index.mdx');
  return null;
};

const slugify = (heading) =>
  heading
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');

const anchorsOf = new Map();
const anchors = (file) => {
  if (!anchorsOf.has(file)) {
    const found = new Set();
    let fenced = false;
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      if (/^\s*```/.test(line)) fenced = !fenced;
      if (fenced) continue;
      const heading = line.match(/^#{1,6}\s+(.*?)\s*$/);
      if (!heading) continue;
      const custom = heading[1].match(/\s*\[#([^\]]+)\]$/);
      if (custom) found.add(custom[1]);
      found.add(slugify(heading[1].replace(/\s*\[#[^\]]+\]$/, '')));
    }
    anchorsOf.set(file, found);
  }
  return anchorsOf.get(file);
};

const broken = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/(?:\]\(|href=["'])(\/docs\/?[^)"'\s]*|#[^)"'\s]+)/g)) {
    const [path, hash] = match[1].split('#');
    const target = path ? fileFor(path.replace(/^\/docs\/?/, '') || 'index') : file;
    if (!target) {
      broken.push(`${relative(root, file)}: ${match[1]} (no page)`);
    } else if (hash && !anchors(target).has(hash)) {
      broken.push(`${relative(root, file)}: ${match[1]} (no heading)`);
    }
  }
}
if (broken.length) {
  console.log(broken.join('\n'));
  process.exit(1);
}
console.log(`All internal links and anchors resolve in ${files.length} file(s)`);
