// Replaces whole comment blocks from a JSON plan, so a rewrite only has to carry the new comment.
//
//   node .claude/skills/terse-comments/scripts/condense-comments.mjs plan.json
//
// The plan is a list of files, each with `[anchor, replacement]` pairs. The anchor is any substring
// unique to one line of the file; the block containing that line is replaced entirely. `null`
// deletes the block. Indentation is taken from the block being replaced, so write the new lines
// flush left.
//
//   [
//     {
//       "file": "src/core/engine/styleEngine.ts",
//       "edits": [
//         ["Build a stable cache key", ["/**", " * A stable cache key for the inputs that decide a class list.", " */"]],
//         ["Only generate rule if it hasn't been generated", null]
//       ]
//     }
//   ]
//
// JSON rather than a script you import: an apostrophe inside a single-quoted JS string has broken
// this twice, and a JSON plan written with the Write tool cannot be mangled by shell escaping.
import { readFileSync, writeFileSync } from 'node:fs';

/** The block containing `index`: a run of `//` lines, or from `/*` (or `{/*`) to its closer. */
function blockRange(lines, index) {
  const line = lines[index].trim();

  if (line.startsWith('//')) {
    let start = index;
    let end = index;
    while (start > 0 && lines[start - 1].trim().startsWith('//')) start--;
    while (end < lines.length - 1 && lines[end + 1].trim().startsWith('//')) end++;

    return [start, end];
  }

  // Both openers have to be recognised: a walk that does not know `{/*` runs past a JSX comment and
  // swallows the code above it.
  const opens = (text) => text.startsWith('/*') || text.startsWith('{/*');

  let start = index;
  while (start >= 0 && !opens(lines[start].trim())) start--;
  if (start < 0) throw new Error(`no comment opens above: ${line}`);

  const closer = lines[start].trim().startsWith('{/*') ? '*/}' : '*/';
  let end = index;
  while (end < lines.length && !lines[end].includes(closer)) end++;
  if (end >= lines.length) throw new Error(`no comment closes below: ${line}`);

  return [start, end];
}

export function condense(path, edits) {
  let lines = readFileSync(path, 'utf8').split('\n');
  let removed = 0;

  for (const [anchor, replacement] of edits) {
    const matches = lines.filter((line) => line.includes(anchor)).length;
    if (matches !== 1) throw new Error(`${path}: ${matches} lines contain ${JSON.stringify(anchor)} — pick a unique anchor`);

    const [start, end] = blockRange(
      lines,
      lines.findIndex((line) => line.includes(anchor)),
    );
    const indent = lines[start].match(/^\s*/)[0];
    const next = replacement === null ? [] : replacement.map((line) => (line === '' ? '' : indent + line));

    removed += end - start + 1 - next.length;
    lines = [...lines.slice(0, start), ...next, ...lines.slice(end + 1)];
  }

  writeFileSync(path, lines.join('\n'));

  return removed;
}

const planPath = process.argv[2];
if (planPath) {
  let total = 0;

  for (const { file, edits } of JSON.parse(readFileSync(planPath, 'utf8'))) {
    const removed = condense(file, edits);
    total += removed;
    console.log(`${file}: ${removed} lines removed`);
  }

  console.log(`\n${total} lines removed`);
}
