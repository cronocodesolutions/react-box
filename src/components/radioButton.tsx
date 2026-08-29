import { forwardRef, Ref, RefAttributes } from 'react';
import Box, { BoxProps, BoxTagProps } from '../box';
import LabelledControl from '../react/forms/labelledControl';
import { ComponentsAndVariants } from '../types';
import ObjectUtils from '../utils/object/objectUtils';

const tagProps = ['name', 'onInput', 'onChange', 'value', 'autoFocus', 'readOnly', 'defaultChecked'] as const;
type TagPropsType = (typeof tagProps)[number];

type RadioButtonProps<TKey extends keyof ComponentsAndVariants> = Omit<BoxProps<'input', TKey>, 'tag' | 'props'>;
type RadioButtonTagProps = Omit<BoxTagProps<'input'>, TagPropsType | 'type'>;

interface Props<TKey extends keyof ComponentsAndVariants> extends RadioButtonProps<TKey> {
  name?: string;
  props?: RadioButtonTagProps;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  defaultChecked?: boolean;
  /** The text beside the radio, rendered inside a `<label>` that wraps the input. */
  label?: React.ReactNode;
  /** Styles for the wrapping `<label>`: the row's layout, not the radio's own appearance. */
  labelProps?: BoxProps<'label'>;
}

/**
 * One radio button — a real `<input type="radio">`, so the platform supplies the checked state,
 * the shared-`name` grouping and form submission.
 *
 * A radio on its own is not a pattern: APG's radio group is a *set* with one name, one label and
 * arrow keys between the members, which is `RadioGroup`. This renders inside one, or stands alone
 * in a plain form. It reads nothing from a context and calls no hook, which is deliberate: it is
 * one of the components a Server Component can render with no client boundary at all.
 */
function RadioButtonImpl<TKey extends keyof ComponentsAndVariants>(props: Props<TKey>, ref: Ref<HTMLInputElement>) {
  const { label, labelProps, ...controlProps } = props;
  const newProps = ObjectUtils.buildProps(controlProps, tagProps, { type: 'radio' });

  return (
    <LabelledControl label={label} labelProps={labelProps}>
      <Box ref={ref} tag="input" component={'radioButton' as TKey} {...newProps} />
    </LabelledControl>
  );
}

const RadioButton = forwardRef(RadioButtonImpl);
RadioButton.displayName = 'RadioButton';

export default RadioButton as <TKey extends keyof ComponentsAndVariants = 'radioButton'>(
  props: Props<TKey> & RefAttributes<HTMLInputElement>,
) => React.ReactNode;
