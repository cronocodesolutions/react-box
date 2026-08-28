// Pack `dist/` into `examples/next-app/.local/react-box.tgz`.
//
// The Next.js example depends on that tarball by path rather than on `../../dist`, because a
// directory dependency is installed as a symlink: everything inside it would then resolve its
// `react` from the repo's own `node_modules`, and the example would run two copies of React. A
// tarball is copied into the example's tree, which is also exactly what a consumer installs.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

if (!existsSync(join('dist', 'package.json'))) {
  console.error('\n✖ dist/ is not built — run `npm run build` first.\n');
  process.exit(1);
}

const target = resolve('examples', 'next-app', '.local');
mkdirSync(target, { recursive: true });

// Run npm through the CLI that invoked this script when there is one (every npm script sets
// npm_execpath): Windows cannot spawn `npm.cmd` without a shell, and passing arguments through a
// shell is what Node 24 deprecates. Called directly with node, it falls back to the shell lookup.
const npmCli = process.env.npm_execpath;
const packArgs = ['pack', '--json', '--pack-destination', target];
const result = npmCli
  ? spawnSync(process.execPath, [npmCli, ...packArgs], { cwd: 'dist', encoding: 'utf8' })
  : spawnSync('npm', packArgs, { cwd: 'dist', encoding: 'utf8', shell: true });

if (result.status !== 0) {
  console.error(`\n✖ npm pack failed:\n${result.stderr?.trim()}\n`);
  process.exit(1);
}

// npm names the tarball after the package version; the example's dependency path must not move
// every release, so it gets a stable name.
const [{ filename }] = JSON.parse(result.stdout.slice(result.stdout.indexOf('[')));
const tarball = join(target, 'react-box.tgz');

rmSync(tarball, { force: true });
renameSync(join(target, filename), tarball);

console.log(`✔ packed ${filename} → ${tarball}`);
