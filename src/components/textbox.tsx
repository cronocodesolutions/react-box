import { forwardRef, Ref } from 'react';
import Box from '../box';
import ObjectUtils from '../utils/object/objectUtils';

type BoxProps = Omit<React.ComponentProps<typeof Box<'input'>>, 'ref' | 'tag'>;
type BoxTagProps = Required<BoxProps>['props'];

const tagProps = [
  'name',
  'onInput',
  'onChange',
  'type',
  'placeholder',
  'defaultValue',
  'autoFocus',
  'readOnly',
  'required',
  'value',
  'pattern',
] as const;
type TagPropsType = (typeof tagProps)[number];

type TextboxTagProps = Omit<BoxTagProps, TagPropsType>;
type TextboxType =
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
  props?: TextboxTagProps;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: TextboxType;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  pattern?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  step?: number | string;
}

function Textbox(props: Props, ref: Ref<HTMLInputElement>) {
  const newProps = ObjectUtils.buildProps(props, tagProps);

  return <Box ref={ref} tag="input" component="textbox" {...newProps} />;
}

export default forwardRef(Textbox);
