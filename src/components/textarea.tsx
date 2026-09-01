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

type TextareaProps<TKey extends keyof ComponentsAndVariants> = Omit<BoxProps<'textarea', TKey>, 'tag' | 'props' | 'placeholder'>;
type TextareaTagProps = OmitTagProps<BoxTagProps<'textarea'>, TagPropsType | 'type'>;

interface Props<TKey extends keyof ComponentsAndVariants> extends TextareaProps<TKey> {
  name?: string;
  props?: TextareaTagProps;
  onInput?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: PlaceholderProp;
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
  const { placeholder, ...rest } = props;
  const { text, styles } = splitPlaceholder(placeholder);
  const newProps = ObjectUtils.buildProps(rest, tagProps, text === undefined ? undefined : { placeholder: text });

  return <Box ref={ref} tag="textarea" component={'textarea' as TKey} {...newProps} placeholder={styles} />;
}

const Textarea = forwardRef(TextareaImpl);
Textarea.displayName = 'Textarea';

export default Textarea as <TKey extends keyof ComponentsAndVariants = 'textarea'>(
  props: Props<TKey> & RefAttributes<HTMLTextAreaElement>,
) => React.ReactNode;
