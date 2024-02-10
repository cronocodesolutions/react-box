import React, { forwardRef, Ref } from 'react';
import Box from '../box';
import ObjectUtils from '../utils/object/objectUtils';

type BoxProps = Omit<React.ComponentProps<typeof Box<'input'>>, 'ref' | 'tag'>;
type BoxTagProps = Required<BoxProps>['props'];

const tagProps = [
  'name',
  'onInput',
  'onChange',
  'disabled',
  'autoFocus',
  'readOnly',
  'required',
  'value',
  'checked',
  'defaultChecked',
] as const;
type TagPropsType = (typeof tagProps)[number];

type CheckboxTagProps = Omit<BoxTagProps, TagPropsType | 'type'>;

interface Props extends Omit<BoxProps, 'props'> {
  name?: string;
  props?: CheckboxTagProps;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  required?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
}

function Checkbox(props: Props, ref: Ref<HTMLInputElement>) {
  const newProps = ObjectUtils.buildProps(props, tagProps, { type: 'checkbox' });

  return <Box ref={ref} tag="input" component="checkbox" {...newProps} />;
}

export default forwardRef(Checkbox);
