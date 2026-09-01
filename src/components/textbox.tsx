import { forwardRef, Ref, RefAttributes } from 'react';
import Box, { BoxProps, BoxTagProps } from '../box';
import { OmitTagProps } from '../react/boxProps';
import splitPlaceholder, { PlaceholderProp } from '../react/forms/placeholderProp';
import { ComponentsAndVariants } from '../types';
import ObjectUtils from '../utils/object/objectUtils';

const tagProps = [
  'name',
  'onInput',
  'onChange',
  'type',
  'step',
  'defaultValue',
  'autoFocus',
  'readOnly',
  'required',
  'value',
  'pattern',
] as const;
type TagPropsType = (typeof tagProps)[number];

type TextareaProps<TKey extends keyof ComponentsAndVariants> = Omit<BoxProps<'input', TKey>, 'tag' | 'props' | 'placeholder'>;
type TextboxTagProps = OmitTagProps<BoxTagProps<'input'>, TagPropsType>;

type TextboxType =
  'date' | 'datetime-local' | 'email' | 'hidden' | 'month' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';

interface Props<TKey extends keyof ComponentsAndVariants> extends TextareaProps<TKey> {
  name?: string;
  props?: TextboxTagProps;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: TextboxType;
  placeholder?: PlaceholderProp;
  value?: string | number;
  defaultValue?: string | number;
  pattern?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  step?: number | string;
}

function TextboxImpl<TKey extends keyof ComponentsAndVariants>(props: Props<TKey>, ref: Ref<HTMLInputElement>) {
  const { placeholder, ...rest } = props;
  const { text, styles } = splitPlaceholder(placeholder);
  const newProps = ObjectUtils.buildProps(rest, tagProps, text === undefined ? undefined : { placeholder: text });

  return <Box ref={ref} tag="input" component={'textbox' as TKey} {...newProps} placeholder={styles} />;
}

const Textbox = forwardRef(TextboxImpl);
Textbox.displayName = 'Textbox';

export default Textbox as <TKey extends keyof ComponentsAndVariants = 'textbox'>(
  props: Props<TKey> & RefAttributes<HTMLInputElement>,
) => React.ReactNode;
