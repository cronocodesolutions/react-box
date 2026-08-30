import { describe, expect, it } from 'vitest';
import { SITE_URL, siteRoutes } from './site';
import {
  buildHeadHtml,
  buildRobotsTxt,
  buildSitemap,
  canonicalUrl,
  documentTitle,
  indexableRoutes,
  META_END,
  META_START,
  notFoundMeta,
  pageMeta,
  routeFor,
  withHeadHtml,
} from './siteMeta';

describe('the route table', () => {
  it('gives every route a unique absolute path', () => {
    const paths = siteRoutes.map((route) => route.path);

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every((path) => path.startsWith('/'))).toBe(true);
  });

  it('keeps every description inside what a search result shows', () => {
    const tooLong = siteRoutes.filter((route) => route.description.length > 160);

    expect(tooLong.map((route) => route.path)).toEqual([]);
  });
});

describe('canonicalUrl', () => {
  it('ends every address in the slash GitHub Pages serves', () => {
    expect(canonicalUrl('/')).toBe(`${SITE_URL}/`);
    expect(canonicalUrl('/dropdown')).toBe(`${SITE_URL}/dropdown/`);
  });
});

describe('documentTitle', () => {
  it('suffixes the site name, unless the route brings its own title', () => {
    expect(documentTitle({ path: '/dropdown', name: 'Dropdown', description: '' })).toBe('Dropdown — React Box');
    expect(documentTitle({ path: '/', name: 'Introduction', title: 'React Box', description: '' })).toBe('React Box');
  });
});

describe('routeFor', () => {
  it('finds a route by pathname, trailing slash or not', () => {
    expect(routeFor('/dropdown')?.name).toBe('Dropdown');
    expect(routeFor('/dropdown/')?.name).toBe('Dropdown');
    expect(routeFor('/')?.path).toBe('/');
  });

  it('returns nothing for an address the site does not serve', () => {
    expect(routeFor('/nope')).toBeUndefined();
  });
});

describe('buildSitemap', () => {
  it('lists every indexable route as an absolute URL', () => {
    const sitemap = buildSitemap();

    for (const route of indexableRoutes()) {
      expect(sitemap).toContain(`<loc>${canonicalUrl(route.path)}</loc>`);
    }

    expect(sitemap.match(/<loc>/g)).toHaveLength(indexableRoutes().length);
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('leaves the unlisted demos out', () => {
    expect(buildSitemap()).not.toContain('/fido-enrollment');
    expect(indexableRoutes().length).toBe(siteRoutes.length - 1);
  });

  it('follows the site address, so the domain cutover is one constant', () => {
    expect(buildSitemap('https://box-kite.dev')).toContain('<loc>https://box-kite.dev/dropdown/</loc>');
  });
});

describe('buildRobotsTxt', () => {
  it('points at the sitemap and allows the assistants by name', () => {
    const robots = buildRobotsTxt();

    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    expect(robots).toContain('User-agent: *\nAllow: /');
    expect(robots).toContain('User-agent: ClaudeBot\nAllow: /');
    expect(robots).toContain('User-agent: GPTBot\nAllow: /');
  });

  it('crawls the unlisted demo rather than blocking it, so its noindex can be read', () => {
    expect(buildRobotsTxt()).not.toContain('Disallow');
  });
});

describe('buildHeadHtml', () => {
  it('writes the title, description, canonical and Open Graph tags a crawler reads without scripts', () => {
    const head = buildHeadHtml(pageMeta(siteRoutes[0]));

    expect(head).toContain(`<title>${documentTitle(siteRoutes[0])}</title>`);
    expect(head).toContain(`<link rel="canonical" href="${SITE_URL}/" />`);
    expect(head).toContain(`<meta property="og:url" content="${SITE_URL}/" />`);
    expect(head).not.toContain('robots');
  });

  it('marks an unlisted route noindex, and leaves the not-found shell without a canonical', () => {
    expect(buildHeadHtml(pageMeta(routeFor('/fido-enrollment')!))).toContain('<meta name="robots" content="noindex, follow" />');

    const notFound = buildHeadHtml(notFoundMeta);

    expect(notFound).toContain('<meta name="robots" content="noindex, follow" />');
    expect(notFound).not.toContain('canonical');
    expect(notFound).not.toContain('og:url');
  });

  it('escapes text that would otherwise close an attribute or a tag', () => {
    const head = buildHeadHtml({ title: 'a "quoted" <title>', description: 'ampersands & angles <>', indexable: true });

    expect(head).toContain('<title>a "quoted" &lt;title&gt;</title>');
    expect(head).toContain('content="ampersands &amp; angles &lt;&gt;"');
  });
});

describe('withHeadHtml', () => {
  const shell = `<head>\n    ${META_START}\n    ${META_END}\n  </head>`;

  it('replaces whatever sits between the markers, so a shell can be rewritten per route', () => {
    const once = withHeadHtml(shell, pageMeta(siteRoutes[0]));
    const twice = withHeadHtml(once, pageMeta(routeFor('/colors')!));

    expect(twice).toContain('<title>Colors — React Box</title>');
    expect(twice).not.toContain(documentTitle(siteRoutes[0]));
    expect(twice.match(/<title>/g)).toHaveLength(1);
  });

  it('refuses to guess when index.html has lost its markers', () => {
    expect(() => withHeadHtml('<head></head>', notFoundMeta)).toThrow(/markers/);
  });
});
