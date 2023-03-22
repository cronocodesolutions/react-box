import React, { forwardRef, Ref } from 'react';
import Box from '../../box';
import ObjectUtils from '../../utils/object/objectUtils';

type BoxProps = Omit<React.ComponentProps<typeof Box<'input'>>, 'ref' | 'tag'>;
type BoxTagProps = Required<BoxProps>['props'];

type TextboxCoreTagProps = Omit<
  BoxTagProps,
  | 'name'
  | 'onInput'
  | 'onChange'
  | 'type'
  | 'placeholder'
  | 'disabled'
  | 'defaultValue'
  | 'autoFocus'
  | 'readOnly'
  | 'required'
  | 'value'
  | 'pattern'
>;
type TextboxCoreType =
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'hidden'
  | 'month'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

interface Props extends Omit<BoxProps, 'props'> {
  name?: string;
  props?: TextboxCoreTagProps;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  type?: TextboxCoreType;
  placeholder?: string;
  disabled?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  pattern?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  required?: boolean;
  step?: number | string;
}

function TextboxCore(props: Props, ref: Ref<HTMLInputElement>) {
  const [tagProps, newProps] = ObjectUtils.moveToTagProps(
    props,
    'onInput',
    'onChange',
    'type',
    'placeholder',
    'disabled',
    'value',
    'defaultValue',
    'pattern',
    'autoFocus',
    'readOnly',
    'required',
    'step',
  );

  return <Box ref={ref} tag="input" inline {...newProps} props={{ ...props.props, ...(tagProps as BoxTagProps) }} />;
}

export default forwardRef(TextboxCore);
