import { parseReleases, releaseRoutes } from './releases';
import { SiteRoute, siteRoutes } from './site';

// Read at build time: one file per version, the draft excluded by its name. The Vite config reads the
// same folder with `fs`, because a config runs in Node where this glob does not exist.
const files = import.meta.glob<string>('../../releases/*.md', { query: '?raw', import: 'default', eager: true });

/** Every release, newest first. */
export const releases = parseReleases(files);

/** Every route the app serves: the table, then one page per release. */
export const routes: readonly SiteRoute[] = [...siteRoutes, ...releaseRoutes(releases)];
