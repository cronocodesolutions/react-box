import React, { forwardRef, Ref } from 'react';
import Box from '../../box';
import ObjectUtils from '../../utils/object/objectUtils';

type BoxProps = Omit<React.ComponentProps<typeof Box<'textarea'>>, 'ref' | 'tag'>;
type BoxTagProps = Required<BoxProps>['props'];

type TextareaCoreTagProps = Omit<
  BoxTagProps,
  | 'name'
  | 'onInput'
  | 'onChange'
  | 'placeholder'
  | 'disabled'
  | 'value'
  | 'defaultValue'
  | 'rows'
  | 'cols'
  | 'autoFocus'
  | 'maxLength'
  | 'minLength'
  | 'readOnly'
  | 'required'
>;

interface Props extends Omit<BoxProps, 'props'> {
  name?: string;
  props?: TextareaCoreTagProps;
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

function TextareaCore(props: Props, ref: Ref<HTMLTextAreaElement>) {
  const [tagProps, newProps] = ObjectUtils.moveToTagProps(
    props,
    'name',
    'onInput',
    'onChange',
    'placeholder',
    'disabled',
    'value',
    'defaultValue',
    'rows',
    'cols',
    'autoFocus',
    'maxLength',
    'minLength',
    'readOnly',
    'required',
  );

  return <Box ref={ref} tag="textarea" inline {...newProps} props={{ ...props.props, ...(tagProps as BoxTagProps) }} />;
}

export default forwardRef(TextareaCore);
