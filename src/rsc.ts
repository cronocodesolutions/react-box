import React from 'react';
import getDefaultEngine from './core/engine/defaultEngine';
import { StylesConfiguration } from './core/engine/styleEngine';
import BoxExtends from './core/extends/boxExtends';
import boxClassNames, { BoxClassNames } from './react/boxClassNames';
import { BoxClassNameProps, BoxCoreProps } from './react/boxProps';
import buildTagProps from './react/boxTagProps';
import resolveStyles from './react/resolveStyles';
import { ComponentsAndVariants } from './types';

/**
 * Box for React Server Components.
 *
 * This entry is what the `react-server` export condition resolves to, so a Server Component that
 * imports `@cronocode/react-box` lands here automatically — no `'use client'`, no configuration.
 * The difference from the client Box is what it does *not* do: it calls no hook, schedules no
 * effect and never touches the DOM. Its CSS travels with its markup as `<style href precedence>`
 * elements, which React 19 hoists into `<head>` and dedupes by href — the same emission path a
 * streaming SSR pass uses, and the reason none of this needs a client runtime.
 *
 * What stays behind in the client bundle: hover-callback children (they need state) and
 * `Box.Theme` (it needs state, storage and a media-query listener). Theme *styles* work here as
 * they always did — `theme={{ dark: { ... } }}` generates ancestor-scoped rules, so putting the
 * theme class on `<html>` in a server component is enough.
 */

// The engine has to be in element mode before the first render, and importing this entry is the
// earliest, most reliable moment: a Server Component has nowhere else to configure anything.
getDefaultEngine().configure({ sink: 'element' });

function Box<TTag extends keyof React.JSX.IntrinsicElements = 'div', TKey extends keyof ComponentsAndVariants = never>(
  props: BoxCoreProps<TTag, TKey>,
): React.ReactNode {
  const { tag = 'div', children } = props;

  if (typeof children === 'function') {
    throw new Error(
      "[react-box] Box children as a function track hover state, which needs the client Box — render it from a 'use client' module.",
    );
  }

  const { classNames, styleElements } = resolveStyles(props, tag === 'svg');

  return React.createElement(
    React.Fragment,
    null,
    styleElements,
    React.createElement(tag, buildTagProps(props, classNames) as React.ComponentProps<TTag>, children),
  );
}

interface RscBoxType {
  <TTag extends keyof React.JSX.IntrinsicElements = 'div', TKey extends keyof ComponentsAndVariants = never>(
    props: BoxCoreProps<TTag, TKey>,
  ): React.ReactNode;
  extend: typeof BoxExtends.extend;
  components: typeof BoxExtends.components;
  getVariableValue: (name: string) => string;
  /** Explicit engine configuration. Element mode is already on; this is for the rest of it. */
  configure: (config: StylesConfiguration) => void;
}

const RscBox = Box as RscBoxType;

RscBox.extend = BoxExtends.extend;
RscBox.components = BoxExtends.components;
RscBox.getVariableValue = (name: string) => getDefaultEngine().getVariableValue(name);
RscBox.configure = (config: StylesConfiguration) => getDefaultEngine().configure(config);

/**
 * The Server-Component half of `useClassNames` — see the client entry for what it is for.
 *
 * Not a hook here, and it does not need to be: in element mode resolving the styles produces the
 * `<style>` elements themselves, so there is nothing left to flush. The name keeps the `use`
 * prefix because a component written against it must be able to move between the two entries
 * without changing a line, and on the client it really is one.
 */
export function useClassNames<TKey extends keyof ComponentsAndVariants = never>(
  props: BoxClassNameProps<TKey>,
  options?: { svg?: boolean },
): BoxClassNames {
  return boxClassNames(resolveStyles(props, options?.svg === true), props.className);
}

export default RscBox;

export type { BoxClassNames, BoxClassNameProps };
