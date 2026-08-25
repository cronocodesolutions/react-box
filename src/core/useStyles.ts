/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useLayoutEffect } from 'react';
import { BoxStyleProps } from '../types';
import getDefaultEngine from './engine/defaultEngine';
import { StylesConfiguration } from './engine/styleEngine';

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

const useEff = isBrowser ? useLayoutEffect : useEffect;

export type { StylesConfiguration };

export default function useStyles(props: BoxStyleProps<any>, isSvg: boolean) {
  const { classNames, signature } = getDefaultEngine().resolveClassNames(props, isSvg);

  // Flush after DOM is ready. Keyed on the stable signature so it only re-runs when the class
  // list changes; a cache hit added no rules, and a miss (new signature) fires the effect and
  // flush() drains all pending rules globally. Falls back to `props` when the signature is null.
  useEff(() => {
    getDefaultEngine().flush();
  }, [signature ?? props]);

  return classNames;
}

export function useGlobalStyles(props: BoxStyleProps<any> | undefined, selector: string) {
  if (props) {
    getDefaultEngine().addGlobalStyles(props, selector);
  }

  useEff(() => {
    getDefaultEngine().flush();
  }, [props, selector]);
}

/** Engine controls for the default instance. For an isolated engine use `createStyleEngine()`. */
export namespace StylesContext {
  export function flush() {
    getDefaultEngine().flush();
  }

  export function clear() {
    getDefaultEngine().clear();
  }

  /** Apply explicit engine configuration. Call before the first render — cached class names are dropped when the configuration changes. */
  export function configure(config: StylesConfiguration) {
    getDefaultEngine().configure(config);
  }
}
