// Types for the plain-ESM helper shared by the boundary checks and `vite.config.ts`.
export const RSC_ENTRY: string;
export const CORE_ENTRY: string;
export const CLIENT_APIS: readonly string[];
export const BANNED_SPECIFIER: RegExp;

export interface ModuleGraph {
  /** Every module the entry reaches: repo-relative POSIX path → comment-free source. */
  modules: Map<string, string>;
  bare: { path: string; specifier: string }[];
  unresolved: { path: string; specifier: string }[];
}

export function moduleGraph(entry: string): ModuleGraph;
export function rscGraph(): ModuleGraph;
export function coreGraph(): ModuleGraph;
