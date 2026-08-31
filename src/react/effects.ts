import React, { useEffect, useLayoutEffect } from 'react';
import { isBrowser as environmentIsBrowser } from '../utils/environment/environmentUtils';

/**
 * Which effect to use where: the part of "run this before the browser paints" that depends on the
 * environment and the React version rather than on what is being run. Both callers need the same answers
 * — the binding flushes rules, the behaviour primitives register listeners and move focus — and off the
 * browser neither happens at all, where React would warn about a layout effect that never runs.
 */
const isBrowser = environmentIsBrowser();

/** A layout effect on the browser, a passive one everywhere else. */
export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

/**
 * An insertion effect on the browser, falling back to a layout effect on React 16/17 — React's own
 * recommendation for injecting CSS-in-JS. Insertion effects run during the commit ahead of *every* layout
 * effect, so a component measuring its DOM already sees the styles. Off the browser nothing paints and
 * `getStyles()` flushes for itself, so `useEffect` keeps React quiet.
 */
export const useIsomorphicInsertionEffect: typeof useLayoutEffect = isBrowser
  ? ((React as { useInsertionEffect?: typeof useLayoutEffect }).useInsertionEffect ?? useLayoutEffect)
  : useEffect;
