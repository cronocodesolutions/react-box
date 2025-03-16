import { forwardRef, Ref, RefAttributes } from 'react';
import Box, { BoxProps, BoxTagProps } from '../box';
import ObjectUtils from '../utils/object/objectUtils';
import { ComponentsAndVariants } from '../types';

const tagProps = ['name', 'onInput', 'onChange', 'value', 'autoFocus', 'readOnly', 'defaultChecked'] as const;
type TagPropsType = (typeof tagProps)[number];

type RadioButtonProps<TKey extends keyof ComponentsAndVariants> = Omit<BoxProps<'input', TKey>, 'tag' | 'props'>;
type RadioButtonTagProps = Omit<BoxTagProps<'input'>, TagPropsType | 'type'>;

interface Props<TKey extends keyof ComponentsAndVariants> extends RadioButtonProps<TKey> {
  name?: string;
  props?: RadioButtonTagProps;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  defaultChecked?: boolean;
}

function RadioButton<TKey extends keyof ComponentsAndVariants>(props: Props<TKey>, ref: Ref<HTMLInputElement>) {
  const newProps = ObjectUtils.buildProps(props, tagProps, { type: 'radio' });

  return <Box tag="input" component={'radioButton' as TKey} {...newProps} />;
}

export default forwardRef(RadioButton) as <TKey extends keyof ComponentsAndVariants = 'radioButton'>(
  props: Props<TKey> & RefAttributes<HTMLInputElement>,
) => React.ReactNode;
