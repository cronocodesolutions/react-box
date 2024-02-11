import React, { forwardRef, Ref, useEffect, useRef } from 'react';
import Box, { BoxTagProps, BoxProps } from '../box';

const tagProps = [
  'name',
  'onInput',
  'onChange',
  'autoFocus',
  'readOnly',
  'required',
  'value',
  'checked',
  'defaultChecked',
  'disabled',
] as const;
type TagPropsType = (typeof tagProps)[number];

type CheckboxProps = Omit<BoxProps<'input'>, 'tag' | 'props'>;
type CheckboxTagProps = Omit<BoxTagProps<'input'>, TagPropsType | 'type'>;

interface Props extends CheckboxProps {
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
  indeterminate?: boolean;
}

function Checkbox(props: Props, ref: Ref<HTMLInputElement> | null) {
  const {
    name,
    onInput,
    onChange,
    value,
    autoFocus,
    readOnly,
    required,
    checked,
    defaultChecked,
    indeterminate,
    props: tagProps,
    ...restProps
  } = props;

  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.indeterminate = Boolean(indeterminate);
    } else if (checkboxRef.current) {
      checkboxRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [ref, checkboxRef, indeterminate]);

  return (
    <Box
      tag="input"
      ref={ref || checkboxRef}
      component="checkbox"
      props={{ ...tagProps, type: 'checkbox', name, onInput, onChange, value, autoFocus, readOnly, required, checked, defaultChecked }}
      {...restProps}
    />
  );
}

export default forwardRef(Checkbox);
