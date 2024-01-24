import React, { forwardRef, Ref } from 'react';
import Box from '../box';
import ObjectUtils from '../utils/object/objectUtils';
import Flex from './flex';

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
  native?: boolean;
}

function Checkbox(props: Props, ref: Ref<HTMLInputElement>) {
  const { native } = props;
  const newProps = ObjectUtils.buildProps(props, tagProps, { type: 'checkbox' });

  return (
    <Flex inline position="relative">
      <Box ref={ref} tag="input" component="checkbox" {...newProps} appearance={native ? undefined : 'none'} />
      {!native && (
        <Box position="absolute" pointerEvents="none">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 20 20">
            <g fill="none" fillRule="evenodd">
              <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6 10.15L8.5 13 14 7" />
            </g>
          </svg>
        </Box>
      )}
    </Flex>
  );
}

export default forwardRef(Checkbox);
