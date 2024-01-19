import { Ref, forwardRef, RefAttributes } from 'react';
import Box from '../box';

type ExtractElementType<T> = T extends React.DetailedHTMLProps<React.HTMLAttributes<infer E>, infer E>
  ? E
  : T extends React.SVGProps<infer E>
  ? E
  : never;

type ExtractElementFromTag<T extends keyof React.JSX.IntrinsicElements> = ExtractElementType<React.JSX.IntrinsicElements[T]>;

type BoxProps<TTag extends keyof React.JSX.IntrinsicElements = 'div'> = Omit<React.ComponentProps<typeof Box<TTag>>, 'ref'>;

function Grid<TTag extends keyof React.JSX.IntrinsicElements = 'div'>(props: BoxProps<TTag>, ref: Ref<ExtractElementFromTag<TTag>>) {
  const { inline, ...restProps } = props;

  return <Box ref={ref} display={inline ? 'inline-grid' : 'grid'} {...restProps} />;
}

export default forwardRef(Grid) as <TTag extends keyof React.JSX.IntrinsicElements = 'div'>(
  props: BoxProps<TTag> & RefAttributes<ExtractElementFromTag<TTag>>,
) => React.ReactNode;
