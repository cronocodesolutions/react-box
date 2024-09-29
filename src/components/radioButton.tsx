import { forwardRef, Ref } from 'react';
import Box, { BoxProps } from '../box';
import ObjectUtils from '../utils/object/objectUtils';

type RadioButtonProps = Omit<BoxProps<'input'>, 'ref' | 'tag'>;
type BoxTagProps = Required<RadioButtonProps>['props'];

const tagProps = ['name', 'onInput', 'onChange', 'value', 'autoFocus', 'readOnly', 'defaultChecked'] as const;
type TagPropsType = (typeof tagProps)[number];

type RadioButtonTagProps = Omit<BoxTagProps, TagPropsType | 'type'>;

interface Props extends Omit<RadioButtonProps, 'props'> {
  name?: string;
  props?: RadioButtonTagProps;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  defaultChecked?: boolean;
}

function RadioButton(props: Props, ref: Ref<HTMLInputElement>) {
  const newProps = ObjectUtils.buildProps(props, tagProps, { type: 'radio' });

  return <Box ref={ref} tag="input" component="radioButton" {...newProps} />;
}

export default forwardRef(RadioButton);
