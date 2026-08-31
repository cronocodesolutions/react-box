import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import reactPlugin from '@vitejs/plugin-react';
import iconsPlugin from 'unplugin-icons/vite';
import { defineConfig, Plugin } from 'vite';
import { SITE_URL, siteRoutes } from './pages/site/site';
import { buildRobotsTxt, buildSitemap, notFoundMeta, pageMeta, withHeadHtml } from './pages/site/siteMeta';

/**
 * Everything the site publishes about its own address, built from the route table in `pages/site/site.ts`:
 * the head metadata, one static shell per route, `sitemap.xml`, `robots.txt` and the `CNAME`.
 *
 * The shells are why the sitemap is worth having: GitHub Pages answers an address it has no file for with
 * an HTTP 404, so every route the sitemap listed would report itself missing.
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

export default defineConfig(({ mode, isSsrBuild }) => {
  return {
    // `unplugin-icons` is the Iconify bridge the /icon page documents, and this site is where it is
    // proved: `~icons/<set>/<name>` becomes a React component at build time, out of the icon data in
    // an `@iconify-json/*` devDependency, so nothing is fetched at runtime and only the icons the
    // site imports are compiled. It is a *page* plugin — the library ships no icons, and nothing
    // about it reaches `vite.config.ts`.
    // The prerender pass builds `entry-server.tsx` through this same config (see
    // `scripts/prerender-pages.mjs`), and the metadata plugin has nothing to do there: an SSR bundle
    // has no `index.html` for it to read.
    plugins: [reactPlugin(), iconsPlugin({ compiler: 'jsx', jsx: 'react' }), ...(isSsrBuild ? [] : [siteMetadata()])],
    build: {
      emptyOutDir: true,
      minify: mode !== 'dev' && !isSsrBuild,
      // No explicit input: both scripts pass `./pages` as the root, so Vite's default
      // `<root>/index.html` is the entry. Naming it `pages/index.html` resolved against the root
      // (`pages/pages/index.html`), which made the dev server's dependency scan fail and skip
      // pre-bundling entirely.
    },
  };
});
