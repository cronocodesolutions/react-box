import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import reactPlugin from '@vitejs/plugin-react';
import { defineConfig, Plugin } from 'vite';
import { SITE_URL, siteRoutes } from './pages/site/site';
import { buildRobotsTxt, buildSitemap, notFoundMeta, pageMeta, withHeadHtml } from './pages/site/siteMeta';

/**
 * Everything the site publishes about its own address, built from the route table in
 * `pages/site/site.ts`: the metadata in each page's head, one static shell per route, `sitemap.xml`,
 * `robots.txt`, and the `CNAME` that pins the GitHub Pages custom domain.
 *
 * The shells are why the sitemap is worth having. GitHub Pages answers an address it has no file
 * for with `404.html` and an HTTP 404 — the page renders, but every route the sitemap lists would
 * report itself missing. A `<route>/index.html` per route makes them 200s, and each one carries its
 * own title, description and canonical link for the crawlers that never run the app.
 */
function siteMetadata(): Plugin {
  const home = siteRoutes[0];

  return {
    name: 'site-metadata',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => withHeadHtml(html, pageMeta(home)),
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap() });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt() });
      // GitHub Pages keeps the custom domain in a repository setting that nothing in this repo can
      // see. Shipping the same host in the artifact means a setting that gets lost or overwritten
      // shows up as a diff here, rather than as a site quietly answering on the wrong address.
      this.emitFile({ type: 'asset', fileName: 'CNAME', source: `${new URL(SITE_URL).host}\n` });
    },
    async writeBundle(options) {
      const outDir = options.dir;
      if (!outDir) return;

      const shell = await readFile(join(outDir, 'index.html'), 'utf8');

      const pages = siteRoutes
        .filter((route) => route.path !== home.path)
        .map((route) => [join(outDir, route.path.slice(1), 'index.html'), pageMeta(route)] as const)
        .concat([[join(outDir, '404.html'), notFoundMeta] as const]);

      for (const [file, meta] of pages) {
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, withHeadHtml(shell, meta));
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [reactPlugin(), siteMetadata()],
    build: {
      emptyOutDir: true,
      minify: mode !== 'dev',
      // No explicit input: both scripts pass `./pages` as the root, so Vite's default
      // `<root>/index.html` is the entry. Naming it `pages/index.html` resolved against the root
      // (`pages/pages/index.html`), which made the dev server's dependency scan fail and skip
      // pre-bundling entirely.
    },
  };
});
