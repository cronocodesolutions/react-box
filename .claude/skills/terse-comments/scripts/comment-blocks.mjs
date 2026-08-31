// The worklist for a comment sweep: which comment blocks are too long, and what they say.
//
//   node .claude/skills/terse-comments/scripts/comment-blocks.mjs [paths...]
//
// MIN=n     only blocks of n lines or more (default 5)
// TEXT=1    print each block in full, ready to write a replacement for
// PROSE=1   skip blocks holding a code fence — those are allowed to be long
//
// With no paths it walks every tracked source file and ends with a per-file summary.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const MIN = Number(process.env.MIN ?? 5);
const TEXT = process.env.TEXT === '1';
const PROSE = process.env.PROSE === '1';

function trackedFiles() {
  return execFileSync('git', ['ls-files', '*.ts', '*.tsx', '*.mjs', '*.js', '*.cjs'], { encoding: 'utf8' }).split('\n').filter(Boolean);
}

/** Every comment block in a file, as [firstLine, lastLine] pairs. A JSX comment closes on a braced star-slash. */
export function commentBlocks(lines) {
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (line.startsWith('//')) {
      const start = index;
      while (index < lines.length && lines[index].trim().startsWith('//')) index++;
      blocks.push([start, index - 1]);
      continue;
    }
    if (line.startsWith('/*') || line.startsWith('{/*')) {
      const closer = line.startsWith('{/*') ? '*/}' : '*/';
      const start = index;
      while (index < lines.length && !lines[index].includes(closer)) index++;
      blocks.push([start, Math.min(index, lines.length - 1)]);
      index++;
      continue;
    }
    index++;
  }

  return blocks;
}

const paths = process.argv.slice(2).length > 0 ? process.argv.slice(2) : trackedFiles();
const perFile = new Map();
const found = [];

for (const path of paths) {
  const lines = readFileSync(path, 'utf8').split('\n');

  for (const [start, end] of commentBlocks(lines)) {
    const size = end - start + 1;
    const text = lines.slice(start, end + 1).join('\n');
    if (size < MIN || (PROSE && text.includes('```'))) continue;

    found.push({ path, line: start + 1, size, text });
    perFile.set(path, (perFile.get(path) ?? 0) + size);
  }
}

found.sort((a, b) => b.size - a.size || a.path.localeCompare(b.path));

for (const block of found) {
  console.log(`--- ${block.path}:${block.line} (${block.size} lines)`);
  console.log(TEXT ? block.text : block.text.split('\n')[block.size > 1 ? 1 : 0].trim().slice(0, 100));
}

console.log(`\n${found.length} blocks of >=${MIN} lines, ${found.reduce((sum, block) => sum + block.size, 0)} lines`);

if (process.argv.slice(2).length === 0) {
  console.log('\nby file:');
  for (const [path, size] of [...perFile].sort((a, b) => b[1] - a[1]).slice(0, 40)) console.log(`${String(size).padStart(4)}  ${path}`);
}
