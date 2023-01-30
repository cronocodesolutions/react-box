import React, { forwardRef, Ref } from 'react';
import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box<'input'>>;
type BoxTagProps = Required<BoxProps>['props'];

type UncontrolledTextboxCoreTagProps = Omit<
  BoxTagProps,
  'name' | 'onInput' | 'onChange' | 'type' | 'placeholder' | 'disabled' | 'defaultValue' | 'autoFocus' | 'readOnly' | 'required'
>;
type UncontrolledTextboxCoreType =
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
  name: string;
  props?: UncontrolledTextboxCoreTagProps;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  type?: UncontrolledTextboxCoreType;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  required?: boolean;
  step?: number | string;
}

function UncontrolledTextboxCore(props: Props, ref: Ref<HTMLInputElement>) {
  const {
    props: tagProps,
    name,
    type,
    disabled,
    placeholder,
    defaultValue,
    onInput,
    onChange,
    autoFocus,
    readOnly,
    required,
    step,
  } = props;

  const newTagProps = {
    ...tagProps,
    type: type || 'text',
    name,
    disabled,
    placeholder,
    onInput,
    onChange,
    defaultValue,
    autoFocus,
    readOnly,
    required,
    step,
    ref,
  } as BoxTagProps;

  return <Box tag="input" inline {...props} props={newTagProps} />;
}

export default forwardRef(UncontrolledTextboxCore);
