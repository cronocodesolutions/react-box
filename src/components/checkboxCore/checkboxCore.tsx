import React, { forwardRef, Ref } from 'react';
import Box from '../../box';
import ObjectUtils from '../../utils/object/objectUtils';

type BoxProps = Omit<React.ComponentProps<typeof Box<'input'>>, 'ref' | 'tag'>;
type BoxTagProps = Required<BoxProps>['props'];

type CheckboxCoreTagProps = Omit<
  BoxTagProps,
  | 'name'
  | 'onInput'
  | 'onChange'
  | 'type'
  | 'placeholder'
  | 'disabled'
  | 'value'
  | 'autoFocus'
  | 'readOnly'
  | 'required'
  | 'checked'
  | 'defaultChecked'
>;

interface Props extends Omit<BoxProps, 'props'> {
  name?: string;
  props?: CheckboxCoreTagProps;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  value?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  required?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
}

function CheckboxCore(props: Props, ref: Ref<HTMLInputElement>) {
  const [tagProps, newProps] = ObjectUtils.moveToTagProps(
    props,
    'name',
    'onInput',
    'onChange',
    'disabled',
    'value',
    'autoFocus',
    'readOnly',
    'required',
    'checked',
    'defaultChecked',
  );

  return <Box ref={ref} tag="input" inline {...newProps} props={{ ...props.props, ...(tagProps as BoxTagProps), type: 'checkbox' }} />;
}

export default forwardRef(CheckboxCore);
