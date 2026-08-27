import React from 'react';

/**
 * React-only type helpers. These live in the adapter rather than in `src/core/coreTypes.ts`
 * because they are expressed in React's own JSX types — the style definitions themselves stay
 * framework-free so every adapter can share them.
 */

/** The DOM element type behind a set of React props (`HTMLAttributes<E>` / `SVGProps<E>` → `E`). */
export type ExtractElementType<T> =
  T extends React.DetailedHTMLProps<React.HTMLAttributes<infer E>, infer E> ? E : T extends React.SVGProps<infer E> ? E : never;

/** The DOM element type behind an intrinsic tag name (`'input'` → `HTMLInputElement`). */
export type ExtractElementFromTag<T extends keyof React.JSX.IntrinsicElements> = ExtractElementType<React.JSX.IntrinsicElements[T]>;
