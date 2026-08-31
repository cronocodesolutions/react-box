import { forwardRef, Ref, useEffect, useRef, useImperativeHandle, RefAttributes } from 'react';
import Box, { BoxTagProps, BoxProps } from '../box';
import LabelledControl from '../react/forms/labelledControl';
import { ComponentsAndVariants } from '../types';
import ObjectUtils from '../utils/object/objectUtils';

const tagProps = ['name', 'onInput', 'onChange', 'autoFocus', 'readOnly', 'value', 'defaultChecked'] as const;
type TagPropsType = (typeof tagProps)[number];

type CheckboxProps<TKey extends keyof ComponentsAndVariants> = Omit<BoxProps<'input', TKey>, 'tag' | 'props'>;
type CheckboxTagProps = Omit<BoxTagProps<'input'>, TagPropsType | 'type'>;

interface Props<TKey extends keyof ComponentsAndVariants> extends CheckboxProps<TKey> {
  name?: string;
  props?: CheckboxTagProps;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  defaultChecked?: boolean;
  /**
   * The text beside the checkbox — rendered inside a `<label>` that wraps the input, so the
   * association is the component's job. Without it a consumer has to wire `htmlFor`/`id` by hand,
   * and a checkbox with no label is the single most common accessibility failure there is.
   */
  label?: React.ReactNode;
  /** Styles for the wrapping `<label>`: the row's layout, not the box's own appearance. */
  labelProps?: BoxProps<'label'>;
}

/**
 * The APG checkbox — which is to say, a real `<input type="checkbox">`. Almost nothing here is behaviour:
 * the platform supplies focus, Space, the checked state and form submission, and every custom-drawn
 * checkbox gets some of those wrong. What the component owes is the label and the mixed state.
 * Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 */
function CheckboxImpl<TKey extends keyof ComponentsAndVariants>(props: Props<TKey>, ref: Ref<HTMLInputElement>) {
  const { label, labelProps, ...controlProps } = props;
  // `indeterminate` is a pseudo-class style prop (`:indeterminate`) as well as a state, so it
  // arrives as a boolean or as `[state, styles]`. Only a boolean says anything about the control's
  // value — anything else is styles a JavaScript caller passed on their own, and `Boolean(styles)`
  // would have pinned the checkbox in the state those styles were only meant to describe.
  const flag = Array.isArray(props.indeterminate) ? props.indeterminate[0] : props.indeterminate;
  const indeterminate = typeof flag === 'boolean' ? flag : false;

  const newProps = ObjectUtils.buildProps(controlProps, tagProps, {
    type: 'checkbox',
    // The DOM property alone is what the browser draws from; assistive technology reads the
    // accessibility tree, where a checkbox with no `aria-checked` is either checked or not.
    ...(indeterminate ? { 'aria-checked': 'mixed' } : {}),
  });

  const checkboxRef = useRef<HTMLInputElement>(null);
  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => checkboxRef.current);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [checkboxRef, indeterminate]);

  return (
    <LabelledControl label={label} labelProps={labelProps}>
      <Box tag="input" ref={checkboxRef} component={'checkbox' as TKey} {...newProps} />
    </LabelledControl>
  );
}

const Checkbox = forwardRef(CheckboxImpl);
Checkbox.displayName = 'Checkbox';

export default Checkbox as <TKey extends keyof ComponentsAndVariants = 'checkbox'>(
  props: Props<TKey> & RefAttributes<HTMLInputElement>,
) => React.ReactNode;
