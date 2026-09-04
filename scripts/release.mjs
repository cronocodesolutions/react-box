// Cuts a release as a pull request: turns releases/next.md into releases/<version>.md, bumps the
// manifest, and opens `release/<version>` for review. Merging that PR is the release — release.yml
// tags the version, opens the GitHub Release from the notes file and hands the tag to publish.yml.
// The manifest leads and the tag follows, so the version is decided here, in a PR, and nowhere else.
//
// Run: npm run release -- patch|minor|major|<x.y.z> [--dry-run]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import prettier from 'prettier';

const root = join(import.meta.dirname, '..');
const NEXT = 'releases/next.md';
const CHANGELOG = 'CHANGELOG.md';
const REPO = 'https://github.com/box-kite/box-kite';
const NPM = 'https://www.npmjs.com/package/@box-kite/react';
const BREAKING = 'Breaking changes';

/** What releases/next.md is reset to after a release. The comments are instructions; the release strips them. */
export const TEMPLATE = `# Box Kite next

_Unreleased. A PR that changes what a consumer sees adds its section here — see CONTRIBUTING.md, "Release notes"._

<!-- Intro: one or two sentences on what this release is about. The first one becomes the CHANGELOG line. -->

## Highlights

<!-- One bullet per section below, linking to it: **[Heading](#heading)** — one line on why it matters. -->

<!-- One \`##\` per change, above Breaking changes: a sentence for the heading, a paragraph on what and why, an example if it helps. -->

## ${BREAKING}

None.

## Fixes

<!-- One bullet per fix: **What was wrong.** What it does now. -->
`;

/** A `## ` section: its heading text and everything under it, up to the next heading. */
function sections(body) {
  const parts = body.split(/^## /m);
  const preamble = parts.shift();
  return {
    preamble,
    sections: parts.map((part) => {
      const [heading, ...rest] = part.split('\n');
      return { heading: heading.trim(), body: rest.join('\n') };
    }),
  };
}

const longDate = (date) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
const isoDate = (date) => date.toISOString().slice(0, 10);

/**
 * The draft becomes the notes of one version: the instructions go, the header names the version and the
 * date, and an empty Highlights or Fixes section goes with them. `empty` means there was nothing to release.
 */
export function prepareNotes(next, { version, previous, date }) {
  const stripped = next.replace(/<!--[\s\S]*?-->[ \t]*\n?/g, '');
  const { preamble, sections: all } = sections(stripped);

  const lines = preamble.split('\n');
  const meta = lines.findIndex((line, index) => index > 0 && /^_.*_\s*$/.test(line));
  const intro = lines
    .slice(meta === -1 ? 1 : meta + 1)
    .join('\n')
    .trim();
  const header = [
    `# Box Kite ${version}`,
    '',
    `_${longDate(date)} · [npm](${NPM}) · [Compare v${previous}...v${version}](${REPO}/compare/v${previous}...v${version})_`,
  ];

  let breaking = false;
  const kept = all.flatMap(({ heading, body }) => {
    const text = body.trim();
    if (heading === BREAKING) {
      breaking = text !== '' && text !== 'None.';
      return [{ heading, body: text === '' ? 'None.' : text }];
    }
    return text === '' ? [] : [{ heading, body: text }];
  });

  const notes = [
    ...header,
    ...(intro ? ['', intro] : ''),
    ...kept.flatMap(({ heading, body }) => ['', `## ${heading}`, '', body]),
    '',
  ].join('\n');
  const empty = !intro && kept.every(({ heading, body }) => heading === BREAKING && body === 'None.');
  const summary = intro ? firstSentence(intro) : `Release ${version}.`;
  return { notes, breaking, empty, summary };
}

/** The CHANGELOG line: the intro's first sentence, with the emphasis markers taken off. */
function firstSentence(text) {
  const plain = text
    .replace(/\*\*|__/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const match = plain.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : plain).trim();
}

/** A new row goes straight under the table header, so the newest release reads first. */
export function withChangelogRow(changelog, { version, date, summary }) {
  const row = `| [${version}](releases/${version}.md) | ${isoDate(date)} | ${summary.replace(/\|/g, '\\|')} |`;
  const lines = changelog.split('\n');
  const separator = lines.findIndex((line) => /^\|\s*-+/.test(line));
  if (separator === -1) throw new Error(`${CHANGELOG} has no table to add a row to`);
  lines.splice(separator + 1, 0, row);
  return lines.join('\n');
}

export function bump(current, kind) {
  const match = current.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) throw new Error(`package.json version "${current}" is not x.y.z`);
  const [major, minor, patch] = match.slice(1).map(Number);
  if (kind === 'major') return `${major + 1}.0.0`;
  if (kind === 'minor') return `${major}.${minor + 1}.0`;
  if (kind === 'patch') return `${major}.${minor}.${patch + 1}`;
  if (!/^\d+\.\d+\.\d+$/.test(kind)) throw new Error(`"${kind}" is neither patch, minor, major nor a version`);
  const next = kind.split('.').map(Number);
  const differs = next.findIndex((part, index) => part !== [major, minor, patch][index]);
  if (differs === -1 || next[differs] < [major, minor, patch][differs]) throw new Error(`${kind} is not above ${current}`);
  return kind;
}

const run = (command, args, options = {}) =>
  execFileSync(command, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...options }).trim();

const readJson = (file) => JSON.parse(readFileSync(join(root, file), 'utf8'));
const writeJson = (file, value) => writeFileSync(join(root, file), JSON.stringify(value, null, 2) + '\n');

async function formatted(file, text) {
  const filepath = join(root, file);
  return prettier.format(text, { ...(await prettier.resolveConfig(filepath)), filepath });
}

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const kind = args.find((arg) => !arg.startsWith('--'));
  if (!kind) fail('Usage: npm run release -- patch|minor|major|<x.y.z> [--dry-run]');

  if (!existsSync(join(root, NEXT))) fail(`${NEXT} does not exist — there is nothing to release`);
  const manifest = readJson('package.json');
  const previous = manifest.version;
  const version = bump(previous, kind);
  const date = new Date();
  const prepared = prepareNotes(readFileSync(join(root, NEXT), 'utf8'), { version, previous, date });

  if (prepared.empty) fail(`${NEXT} has no notes. A release with nothing to say is not a release — write the section first.`);
  if (prepared.breaking && !version.endsWith('.0.0')) {
    fail(
      `${NEXT} lists breaking changes, and ${previous} → ${version} is not a major bump. SUPPORT.md promises breaking changes only in a major.`,
    );
  }

  // The manifest leads, main is where it leads from, and nothing may be lying around uncommitted.
  if (run('git', ['branch', '--show-current']) !== 'main') fail('Releases start from main');
  if (run('git', ['status', '--porcelain'])) fail('The working tree is not clean');
  run('git', ['fetch', '--quiet', 'origin', 'main']);
  if (run('git', ['rev-parse', 'HEAD']) !== run('git', ['rev-parse', 'origin/main'])) fail('main is not at origin/main — pull first');

  const branch = `release/${version}`;
  console.log(`\nBox Kite ${previous} → ${version}${prepared.breaking ? ' (breaking changes listed)' : ''}`);
  console.log(`CHANGELOG line: ${prepared.summary}`);
  console.log(`\n${prepared.notes.split('\n').slice(0, 12).join('\n')}\n…\n`);
  if (dryRun) {
    console.log(
      `Dry run — nothing written. Without --dry-run this writes releases/${version}.md, resets ${NEXT}, bumps package.json and package-lock.json, and opens ${branch} as a PR.`,
    );
    return;
  }

  run('git', ['switch', '--quiet', '-c', branch]);
  const notesFile = `releases/${version}.md`;
  mkdirSync(join(root, 'releases'), { recursive: true });
  writeFileSync(join(root, notesFile), await formatted(notesFile, prepared.notes));
  writeFileSync(join(root, NEXT), TEMPLATE);
  const changelog = existsSync(join(root, CHANGELOG))
    ? readFileSync(join(root, CHANGELOG), 'utf8')
    : `# Changelog\n\n| Version | Date | In one line |\n| --- | --- | --- |\n`;
  writeFileSync(
    join(root, CHANGELOG),
    await formatted(CHANGELOG, withChangelogRow(changelog, { version, date, summary: prepared.summary })),
  );

  writeJson('package.json', { ...manifest, version });
  const lock = readJson('package-lock.json');
  lock.version = version;
  if (lock.packages?.['']) lock.packages[''].version = version;
  writeJson('package-lock.json', lock);

  run('git', ['add', '--', notesFile, NEXT, CHANGELOG, 'package.json', 'package-lock.json']);
  run('git', ['commit', '--quiet', '-m', `Release ${version}`]);
  run('git', ['push', '--quiet', '-u', 'origin', branch]);

  const body = `Merging this PR is the release. Once Tests are green on main, the Release workflow tags \`v${version}\`, opens the GitHub Release from \`${notesFile}\`, publishes \`@box-kite/react\` and \`@box-kite/core\` to npm, and the site deploys with the notes.

Before merging:

- [ ] \`${notesFile}\` reads well as a whole: the intro, the Highlights, every section in a sensible order, and a migration note beside every breaking change.
- [ ] The version is right: ${previous} → ${version}${prepared.breaking ? ', a major, because breaking changes are listed' : ', and Breaking changes says None'}.
- [ ] The CHANGELOG line says what this release is: _${prepared.summary}_
`;
  const bodyFile = join(mkdtempSync(join(tmpdir(), 'box-kite-release-')), 'body.md');
  writeFileSync(bodyFile, body);
  const pr = ['pr', 'create', '--base', 'main', '--head', branch, '--title', `Release ${version}`, '--body-file', bodyFile];
  let url;
  try {
    url = run('gh', [...pr, '--label', 'release']);
  } catch {
    url = run('gh', pr);
  }
  console.log(`\n✔ ${url}\n\nRead the notes there, fix anything in place on ${branch}, and merge. The merge is the release.`);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await main();
}
