import React, { useEffect, useLayoutEffect } from 'react';
import { isBrowser as environmentIsBrowser } from '../utils/environment/environmentUtils';

/**
 * Which effect to use where — the one part of "run this before the browser paints" that depends on
 * the environment and the React version rather than on what is being run.
 *
 * Both callers need the same answers: the styling binding flushes CSS rules, and the behaviour
 * primitives register document listeners and move focus. Off the browser neither happens at all,
 * and React logs a warning for a layout effect that will never run.
 */
const isBrowser = environmentIsBrowser();

/** A layout effect on the browser, a passive one everywhere else. */
export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

/**
 * An insertion effect on the browser, falling back to a layout effect on React 16/17.
 *
 * React's own recommendation for injecting CSS-in-JS rules. Insertion effects run during the
 * commit, ahead of *every* layout effect in it, so a component that measures its DOM in
 * `useLayoutEffect` already sees the styles — with a layout-effect flush it saw them only if the
 * Box happened to commit earlier in the tree. Added in React 18, and the peer range starts at
 * 16.14. Off the browser no flush effect can help: nothing paints and `getStyles()` flushes for
 * itself (see `ssg.ts`), so `useEffect` keeps React quiet.
 */
export const useIsomorphicInsertionEffect: typeof useLayoutEffect = isBrowser
  ? ((React as { useInsertionEffect?: typeof useLayoutEffect }).useInsertionEffect ?? useLayoutEffect)
  : useEffect;
