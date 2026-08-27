import React from 'react';
import { ClassNameType } from '../core/classNames';
import { BoxStyleProps, ComponentsAndVariants } from '../types';

/**
 * The prop shape of Box, shared by the client component and the Server-Component one so the public
 * surface cannot drift between them.
 */

type AllProps<TTag extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<TTag>;

export type TagPropsType<TTag extends keyof React.JSX.IntrinsicElements> = Omit<
  AllProps<TTag>,
  'className' | 'style' | 'ref' | 'disabled' | 'required' | 'checked' | 'id'
>;

export interface BoxCoreProps<
  TTag extends keyof React.JSX.IntrinsicElements,
  TKey extends keyof ComponentsAndVariants,
> extends BoxStyleProps<TKey> {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  /** html tag element */
  tag?: TTag;
  /** props (attributes) related to html tag */
  props?: TagPropsType<TTag>;
  /** classNames. supports conditional classNames. */
  className?: ClassNameType;
  /** CSSProperties */
  style?: React.ComponentProps<TTag>['style'];
  /** The HTML id attribute is used to specify a unique id for an HTML element. */
  id?: string;
}
