import { forwardRef, Ref, RefAttributes } from 'react';
import Box, { BoxProps, BoxTagProps } from '../box';
import ObjectUtils from '../utils/object/objectUtils';
import { ComponentsAndVariants } from '../types';

const tagProps = ['type', 'onClick'] as const;
type TagPropsType = (typeof tagProps)[number];

type ButtonProps<TKey extends keyof ComponentsAndVariants> = Omit<BoxProps<'button', TKey>, 'tag' | 'props'>;
type ButtonTagProps = Omit<BoxTagProps<'button'>, TagPropsType>;

type ButtonType = Required<React.ComponentProps<'button'>>['type'];

interface Props<TKey extends keyof ComponentsAndVariants> extends ButtonProps<TKey> {
  props?: ButtonTagProps;
  type?: ButtonType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Button<TKey extends keyof ComponentsAndVariants>(props: Props<TKey>, ref: Ref<HTMLButtonElement>) {
  const newProps = ObjectUtils.buildProps(props, tagProps);

  return <Box ref={ref} tag="button" component={'button' as TKey} {...newProps} />;
}

export default forwardRef(Button) as <TKey extends keyof ComponentsAndVariants = never>(
  props: Props<TKey> & RefAttributes<HTMLButtonElement>,
) => React.ReactNode;
