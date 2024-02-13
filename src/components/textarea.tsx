import React, { forwardRef, Ref } from 'react';
import Box from '../box';
import ObjectUtils from '../utils/object/objectUtils';

type BoxProps = Omit<React.ComponentProps<typeof Box<'textarea'>>, 'ref' | 'tag'>;
type BoxTagProps = Required<BoxProps>['props'];

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
  'required',
] as const;
type TagPropsType = (typeof tagProps)[number];
type TextareaTagProps = Omit<BoxTagProps, TagPropsType>;

interface Props extends Omit<BoxProps, 'props'> {
  name?: string;
  props?: TextareaTagProps;
  onInput?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
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

function Textarea(props: Props, ref: Ref<HTMLTextAreaElement>) {
  const newProps = ObjectUtils.buildProps(props, tagProps);

  return <Box ref={ref} tag="textarea" component="textarea" {...newProps} />;
}

export default forwardRef(Textarea);
