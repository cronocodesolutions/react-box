import { forwardRef, Ref, RefAttributes } from 'react';
import Box, { BoxProps } from '../box';
import { ExtractElementFromTag } from '../core/coreTypes';
import { ComponentsAndVariants } from '../types';

type SemanticComponentType<TTag extends keyof React.JSX.IntrinsicElements, TKey extends keyof ComponentsAndVariants = never> = (
  props: Omit<BoxProps<TTag, TKey>, 'tag'> & RefAttributes<ExtractElementFromTag<TTag>>,
) => React.ReactNode;

function semantic<TTag extends keyof React.JSX.IntrinsicElements, TKey extends keyof ComponentsAndVariants>(
  tagName: TTag,
  p?: BoxProps<TTag>,
): SemanticComponentType<TTag, TKey> {
  return forwardRef((props: Omit<BoxProps<TTag, TKey>, 'tag'>, ref: Ref<ExtractElementFromTag<TTag>>) => (
    <Box tag={tagName} ref={ref} component={tagName as unknown as TKey} {...p} {...props} />
  ));
}

export const Label = semantic('label');
export const Span = semantic('span', { inline: true });
export const Article = semantic('article');
export const Aside = semantic('aside');
export const Details = semantic('details');
export const Figcaption = semantic('figcaption');
export const Figure = semantic('figure');
export const Footer = semantic('footer');
export const Header = semantic('header');
export const Main = semantic('main');
export const Mark = semantic('mark');
export const Nav = semantic('nav');
export const Menu = semantic('menu');
export const Section = semantic('section');
export const Summary = semantic('summary');
export const Time = semantic('time');
export const P = semantic('p');
export const H1 = semantic('h1', { fontSize: 14 * 2.5 });
export const H2 = semantic('h2', { fontSize: 14 * 2.0 });
export const H3 = semantic('h3', { fontSize: 14 * 1.75 });
export const H4 = semantic('h4', { fontSize: 14 * 1.5 });
export const H5 = semantic('h5', { fontSize: 14 * 1.25 });
export const H6 = semantic('h6', { fontSize: 14 * 1.0 });
export const Link = semantic('a');
export const Img = semantic('img');
