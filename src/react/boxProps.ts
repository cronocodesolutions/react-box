import React from 'react';
import { ClassNameType } from '../core/classNames';
import { BoxStyleProps, ComponentsAndVariants } from '../types';

/**
 * The prop shape of Box, shared by the client component and the Server-Component one so the public
 * surface cannot drift between them.
 */

type AllProps<TTag extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<TTag>;

/** `data-*`, which React's own attribute types allow only in JSX position and never in a props bag. */
type DataAttributes = { [attribute: `data-${string}`]: string | number | boolean | undefined };

type TagProps<TTag extends keyof React.JSX.IntrinsicElements> = Omit<
  AllProps<TTag>,
  'className' | 'style' | 'ref' | 'disabled' | 'required' | 'checked' | 'id'
>;

/**
 * Every attribute the tag takes, plus `data-*` (bug #99: `props={{ 'data-state': 'open' }}` did not
 * typecheck, and `<Box data-state>` did but was dropped, since Box forwards nothing but `props`). A union
 * rather than an intersection: an index signature in the target makes every *interface* passed as a bag
 * unassignable, and `TooltipTrigger.props` is one. Anything else unknown still fails.
 */
export type TagPropsType<TTag extends keyof React.JSX.IntrinsicElements> = TagProps<TTag> | (TagProps<TTag> & DataAttributes);

/**
 * `Omit` one union member at a time, for a component claiming attributes of its own. A plain `Omit` over
 * a union keeps only the keys every member shares, so it collapsed the two above into one and dropped
 * `data-*` again — bug #99 one layer up, on every pre-built component.
 */
export type OmitTagProps<TProps, TKeys extends PropertyKey> = TProps extends unknown ? Omit<TProps, TKeys> : never;

/**
 * The style props plus the `className` the engine's classes are merged with — everything the
 * resolution needs and nothing about a tag. `useClassNames` takes this, which is why it can style
 * an element this library does not render.
 */
export interface BoxClassNameProps<TKey extends keyof ComponentsAndVariants = never> extends BoxStyleProps<TKey> {
  /** classNames. supports conditional classNames. */
  className?: ClassNameType;
}

export interface BoxCoreProps<
  TTag extends keyof React.JSX.IntrinsicElements,
  TKey extends keyof ComponentsAndVariants,
> extends BoxClassNameProps<TKey> {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  /** html tag element */
  tag?: TTag;
  /** props (attributes) related to html tag */
  props?: TagPropsType<TTag>;
  /** CSSProperties */
  style?: React.ComponentProps<TTag>['style'];
  /** The HTML id attribute is used to specify a unique id for an HTML element. */
  id?: string;
}
