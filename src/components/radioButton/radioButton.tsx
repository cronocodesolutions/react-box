import React, { forwardRef, Ref } from 'react';
import Box from '../../box';
import ObjectUtils from '../../utils/object/objectUtils';

type BoxProps = Omit<React.ComponentProps<typeof Box<'input'>>, 'ref' | 'tag'>;
type BoxTagProps = Required<BoxProps>['props'];

const tagProps = [
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
] as const;
type TagPropsType = (typeof tagProps)[number];

type RadioButtonTagProps = Omit<BoxTagProps, TagPropsType | 'type'>;

interface Props extends Omit<BoxProps, 'props'> {
  name?: string;
  props?: RadioButtonTagProps;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  required?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  native?: boolean;
}

function RadioButton(props: Props, ref: Ref<HTMLInputElement>) {
  const { native } = props;
  const newProps = ObjectUtils.buildProps(props, tagProps, { type: 'radio' });

  return <Box ref={ref} tag="input" inline b={1} p={2} component="radioButton" {...newProps} appearance={native ? undefined : 'none'} />;
}

export default forwardRef(RadioButton);
