// Types for the plain-ESM helper shared by `check-rsc-boundary.mjs` and `vite.config.ts`.
export const RSC_ENTRY: string;
export const CLIENT_APIS: readonly string[];
export const BANNED_SPECIFIER: RegExp;

export function rscGraph(): {
  /** Every module the entry reaches: repo-relative POSIX path → comment-free source. */
  modules: Map<string, string>;
  bare: { path: string; specifier: string }[];
  unresolved: { path: string; specifier: string }[];
};
