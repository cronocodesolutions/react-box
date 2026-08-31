// The gate: prove a sweep changed nothing but comments.
//
//   node .claude/skills/terse-comments/scripts/verify-comments.mjs [paths...]
//
// BASE_REV=<rev>   what to compare against (default HEAD)
//
// Every file is compared with its baseline with whole-line comments dropped. It fails on:
//   CODE DRIFT       a non-comment line that differs — the sweep touched code, which it must not
//   DIRECTIVE DRIFT  a lost `@__PURE__`, `eslint-*`, `@ts-*`, `<reference` or `@deprecated`, which
//                    are comments the toolchain reads
//
// Run it after every batch, not only at the end: it reports the file, and a batch is small enough
// to re-do.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE_REV ?? 'HEAD';
const DIRECTIVE = /@__PURE__|eslint-|@ts-|<reference|@deprecated/;

function trackedFiles() {
  return execFileSync('git', ['ls-files', '*.ts', '*.tsx', '*.mjs', '*.js', '*.cjs'], { encoding: 'utf8' }).split('\n').filter(Boolean);
}

function baseline(path) {
  try {
    return execFileSync('git', ['show', `${BASE}:${path}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return null;
  }
}

/** A file split into its code lines (trimmed) and its comment lines. A JSX comment closes on a braced star-slash. */
function split(text) {
  const code = [];
  const comments = [];
  let closer = null;

  for (const raw of text.split('\n')) {
    const line = raw.trim();

    if (closer) {
      comments.push(line);
      if (line.includes(closer)) closer = null;
      continue;
    }
    if (line.startsWith('/*') || line.startsWith('{/*')) {
      const end = line.startsWith('{/*') ? '*/}' : '*/';
      comments.push(line);
      if (!line.includes(end)) closer = end;
      continue;
    }
    if (line.startsWith('//')) {
      comments.push(line);
      continue;
    }
    if (line.length > 0) code.push(line);
  }

  return { code, comments };
}

const paths = process.argv.slice(2).length > 0 ? process.argv.slice(2) : trackedFiles();
const directives = (lines) => lines.filter((line) => DIRECTIVE.test(line)).length;
let failures = 0;
let before = 0;
let after = 0;

for (const path of paths) {
  const base = baseline(path);
  if (base === null) continue;

  const was = split(base);
  const is = split(readFileSync(path, 'utf8'));
  before += was.comments.length;
  after += is.comments.length;

  const drift = [];
  for (let index = 0; index < Math.max(was.code.length, is.code.length); index++) {
    if (was.code[index] !== is.code[index]) drift.push([was.code[index], is.code[index]]);
  }

  if (drift.length > 0) {
    failures++;
    console.log(`CODE DRIFT ${path} (${drift.length} lines)`);
    for (const [wasLine, isLine] of drift.slice(0, 6)) {
      console.log(`  - ${wasLine ?? '(missing)'}`);
      console.log(`  + ${isLine ?? '(missing)'}`);
    }
  }

  const wasDirectives = directives(was.comments) + directives(was.code);
  const isDirectives = directives(is.comments) + directives(is.code);
  if (wasDirectives !== isDirectives) {
    failures++;
    console.log(`DIRECTIVE DRIFT ${path}: ${wasDirectives} -> ${isDirectives}`);
  }
}

console.log(`\nchecked ${paths.length} paths · comment lines ${before} -> ${after} (${before - after} removed)`);
process.exit(failures > 0 ? 1 : 0);
