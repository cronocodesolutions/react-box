/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect } from 'react';
import getDefaultEngine from '../core/engine/defaultEngine';
import { StylesConfiguration } from '../core/engine/styleEngine';
import { BoxStyleProps } from '../types';

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// React's own recommendation for injecting CSS-in-JS rules. Insertion effects run during the
// commit, ahead of *every* layout effect in it, so a component that measures its DOM in
// `useLayoutEffect` already sees the styles — with a layout-effect flush it saw them only if the
// Box happened to commit earlier in the tree. Added in React 18, and the peer range starts at
// 16.14, so fall back to a layout effect there. Off the browser no flush effect can help: nothing
// paints and `getStyles()` flushes for itself (see `ssg.ts`), so `useEffect` keeps React quiet.
const useInsertionEffect: typeof useLayoutEffect =
  (React as { useInsertionEffect?: typeof useLayoutEffect }).useInsertionEffect ?? useLayoutEffect;
const useFlushEffect = isBrowser ? useInsertionEffect : useEffect;

export type { StylesConfiguration };

export default function useStyles(props: BoxStyleProps<any>, isSvg: boolean) {
  const { classNames, signature } = getDefaultEngine().resolveClassNames(props, isSvg);

  // Flush during the commit, before anything can paint or measure. Keyed on the stable signature
  // so it only re-runs when the class list changes; a cache hit added no rules, and a miss (new
  // signature) fires the effect and the flush drains all pending rules globally. Falls back to
  // `props` when the signature is null. Rules queued by a render that never commits are not lost
  // either — the engine schedules a microtask flush of its own when it queues them.
  useFlushEffect(() => {
    getDefaultEngine().flushSync();
  }, [signature ?? props]);

  return classNames;
}

export function useGlobalStyles(props: BoxStyleProps<any> | undefined, selector: string) {
  if (props) {
    getDefaultEngine().addGlobalStyles(props, selector);
  }

  useFlushEffect(() => {
    getDefaultEngine().flushSync();
  }, [props, selector]);
}

/** Engine controls for the default instance. For an isolated engine use `createStyleEngine()`. */
export namespace StylesContext {
  /** Write every pending rule now. The React binding calls this from an insertion effect. */
  export function flushSync() {
    getDefaultEngine().flushSync();
  }

  export function clear() {
    getDefaultEngine().clear();
  }

  /** The CSS emitted so far, as text. Flushes first — see `StyleEngine.getStyles`. */
  export function getStyles() {
    return getDefaultEngine().getStyles();
  }

  /** The id of the `<style>` element the default engine writes to. */
  export function styleElementId() {
    return getDefaultEngine().styleElementId;
  }

  /** Apply explicit engine configuration. Call before the first render — cached class names are dropped when the configuration changes. */
  export function configure(config: StylesConfiguration) {
    getDefaultEngine().configure(config);
  }
}
