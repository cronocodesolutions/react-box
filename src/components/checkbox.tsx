import { forwardRef, Ref, useEffect, useRef, useImperativeHandle } from 'react';
import Box, { BoxTagProps, BoxProps } from '../box';
import ObjectUtils from '../utils/object/objectUtils';

const tagProps = ['name', 'onInput', 'onChange', 'autoFocus', 'readOnly', 'required', 'value', 'checked', 'defaultChecked'] as const;
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
  // checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
}

function Checkbox(props: Props, ref: Ref<HTMLInputElement>) {
  const { indeterminate } = props;
  const newProps = ObjectUtils.buildProps(props, tagProps, { type: 'checkbox' });

  const checkboxRef = useRef<HTMLInputElement>(null);
  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => checkboxRef.current);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [checkboxRef, indeterminate]);

  return <Box tag="input" ref={checkboxRef} component="checkbox" {...newProps} />;
}

export default forwardRef(Checkbox);
