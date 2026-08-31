// `~icons/<set>/<name>` — the virtual modules `unplugin-icons` compiles from the icon data in the
// `@iconify-json/*` devDependencies (see `pages.vite.config.ts`). Without this reference the
// specifier resolves to nothing and TypeScript reports every Iconify import as a missing module.
//
// The recipe the /icon page documents needs the same three lines in a consumer's project.
/// <reference types="unplugin-icons/types/react" />
