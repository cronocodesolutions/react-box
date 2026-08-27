/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import getDefaultEngine from '../core/engine/defaultEngine';
import { BoxStyleProps } from '../types';
import styleElementsOf from './styleElements';

export interface ResolvedBoxStyles {
  classNames: string[];
  /**
   * Element mode only: the hoistable `<style>` elements this Box's classes need, the engine's base
   * element first. Undefined in every other mode, where the CSS has already gone to a stylesheet.
   */
  styleElements?: React.ReactElement[];
}

/**
 * Resolve a Box's classes without calling a single hook — the render path a Server Component can
 * take. In element mode everything those classes need comes back as elements to render, so there
 * is nothing left to flush and no client runtime to wait for.
 *
 * It lives in its own module for that reason: the RSC entry must reach this without pulling in
 * `useStyles`, whose flush effect is meaningless (and unavailable) on a server.
 */
export default function resolveStyles(props: BoxStyleProps<any>, isSvg: boolean): ResolvedBoxStyles & { signature: string | null } {
  const { classNames, signature, styleElements } = getDefaultEngine().resolveClassNames(props, isSvg);

  return { classNames, signature, styleElements: styleElementsOf(styleElements) };
}
