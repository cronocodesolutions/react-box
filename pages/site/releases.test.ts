import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { headings } from '../utils/markdownUtils';
import { parseReleases, RELEASES_PATH, releaseRoutes, withoutTitle } from './releases';

const notes = (version: string, intro = '**Something is different.** More words follow.') =>
  `# Box Kite ${version}\n\n_4 September 2026 · [npm](https://x) · [Compare](https://y)_\n\n${intro}\n\n## A section\n\nText.\n`;

describe('parseReleases', () => {
  it('reads the version from the file name, skips the draft, and lists the newest first', () => {
    const releases = parseReleases({
      '../../releases/1.0.0.md': notes('1.0.0'),
      '1.10.0.md': notes('1.10.0'),
      '1.2.0.md': notes('1.2.0'),
      'next.md': '# Box Kite next\n',
    });

    expect(releases.map((release) => release.version)).toEqual(['1.10.0', '1.2.0', '1.0.0']);
    expect(releases[0].path).toBe(`${RELEASES_PATH}/1.10.0`);
  });

  it('takes the date from the meta line and the summary from the intro, emphasis removed', () => {
    const [release] = parseReleases({ '1.0.0.md': notes('1.0.0') });

    expect(release.date).toBe('4 September 2026');
    expect(release.summary).toBe('Something is different.');
  });

  it('says what a release with no intro is, and keeps a description inside a search result', () => {
    const [bare] = parseReleases({ '2.0.0.md': '# Box Kite 2.0.0\n\n_1 May 2027 · x_\n\n## Only a section\n\nText.\n' });
    const [long] = parseReleases({ '2.1.0.md': notes('2.1.0', `${'A'.repeat(200)}.`) });

    expect(bare.summary).toBe('What changed in Box Kite 2.0.0.');
    expect(long.summary.length).toBeLessThanOrEqual(160);
    expect(long.summary.endsWith('…')).toBe(true);
  });
});

describe('releaseRoutes', () => {
  it('gives each release a route with a title of its own and the summary as its description', () => {
    const [route] = releaseRoutes(parseReleases({ '1.0.0.md': notes('1.0.0') }));

    expect(route).toEqual({
      path: '/releases/1.0.0',
      name: 'Box Kite 1.0.0',
      title: 'Box Kite 1.0.0 release notes',
      description: 'Something is different.',
    });
  });
});

describe('withoutTitle', () => {
  it('drops the H1 the page header already shows', () => {
    expect(withoutTitle('# Box Kite 1.0.0\n\n_meta_\n\nIntro.\n')).toBe('_meta_\n\nIntro.\n');
  });
});

// The files the site really serves. Each has to carry the header the release script writes, or the
// page shows no date and a generic summary — and the Highlights list links to anchors that must exist.
describe('releases/', () => {
  const dir = resolve(process.cwd(), 'releases');
  const files = Object.fromEntries(
    readdirSync(dir)
      .filter((file) => file.endsWith('.md'))
      .map((file) => [file, readFileSync(resolve(dir, file), 'utf8')]),
  );
  const releases = parseReleases(files);

  it('has a dated, summarised entry for every version file', () => {
    expect(releases.length).toBeGreaterThan(0);

    for (const release of releases) {
      expect(release.markdown.startsWith(`# Box Kite ${release.version}\n`), release.version).toBe(true);
      expect(release.date, release.version).toMatch(/^\d{1,2} [A-Z][a-z]+ \d{4}$/);
      expect(release.summary, release.version).not.toMatch(/^What changed in/);
    }
  });

  it('gives every section a unique anchor, and every in-page link a section to land on', () => {
    for (const release of releases) {
      const body = withoutTitle(release.markdown);
      const ids = headings(body).map((entry) => entry.id);
      const linked = [...body.matchAll(/\]\(#([^)]+)\)/g)].map((match) => match[1]);

      expect(new Set(ids).size, release.version).toBe(ids.length);
      expect(
        linked.filter((id) => !ids.includes(id)),
        release.version,
      ).toEqual([]);
    }
  });
});
