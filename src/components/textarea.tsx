import { forwardRef, Ref, RefAttributes } from 'react';
import Box, { BoxProps, BoxTagProps } from '../box';
import { ComponentsAndVariants } from '../types';
import ObjectUtils from '../utils/object/objectUtils';

const tagProps = [
  'name',
  'onInput',
  'onChange',
  'placeholder',
  'value',
  'defaultValue',
  'rows',
  'cols',
  'autoFocus',
  'maxLength',
  'minLength',
  'readOnly',
] as const;
type TagPropsType = (typeof tagProps)[number];

type TextareaProps<TKey extends keyof ComponentsAndVariants> = Omit<BoxProps<'textarea', TKey>, 'tag' | 'props'>;
type TextareaTagProps = Omit<BoxTagProps<'textarea'>, TagPropsType | 'type'>;

interface Props<TKey extends keyof ComponentsAndVariants> extends TextareaProps<TKey> {
  name?: string;
  props?: TextareaTagProps;
  onInput?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  rows?: number;
  cols?: number;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  readOnly?: boolean;
  required?: boolean;
}

function TextareaImpl<TKey extends keyof ComponentsAndVariants>(props: Props<TKey>, ref: Ref<HTMLTextAreaElement>) {
  const newProps = ObjectUtils.buildProps(props, tagProps);

  return <Box ref={ref} tag="textarea" component={'textarea' as TKey} {...newProps} />;
}

const Textarea = forwardRef(TextareaImpl);
Textarea.displayName = 'Textarea';

export default Textarea as <TKey extends keyof ComponentsAndVariants = 'textarea'>(
  props: Props<TKey> & RefAttributes<HTMLTextAreaElement>,
) => React.ReactNode;
