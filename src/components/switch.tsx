import { forwardRef, Ref, RefAttributes } from 'react';
import { BoxProps, BoxTagProps } from '../box';
import { useEventCallback } from '../react/a11y/callbacks';
import { ComponentsAndVariants } from '../types';
import Checkbox from './checkbox';

type SwitchProps<TKey extends keyof ComponentsAndVariants> = Omit<BoxProps<'input', TKey>, 'tag' | 'props' | 'indeterminate'>;

interface Props<TKey extends keyof ComponentsAndVariants> extends SwitchProps<TKey> {
  name?: string;
  props?: Omit<BoxTagProps<'input'>, 'type'>;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  defaultChecked?: boolean;
  /** The text beside the switch, rendered inside a label that wraps the input. */
  label?: React.ReactNode;
  labelProps?: BoxProps<'label'>;
}

/**
 * The APG switch: an on/off control, drawn as a track and a thumb.
 * Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 *
 * ```tsx
 * <Switch label="Email notifications" name="notify" defaultChecked />
 * ```
 *
 * Underneath it is the same `<input type="checkbox">` a `Checkbox` renders, with `role="switch"`
 * over it. That role is the whole difference to a screen reader — "on"/"off" rather than
 * "checked"/"not checked" — and keeping the native input is what keeps focus, Space, the disabled
 * state and form submission working without reimplementing any of them. A switch built from a
 * `<div>` submits nothing.
 *
 * The one behaviour the platform does not supply is Enter. APG lists it as optional for a switch,
 * and a native checkbox ignores it — inside a form Enter submits instead. This toggles on Enter
 * and stops the submission, which is the reading a user who pressed Enter *on the switch* meant.
 * There is no mixed state: a switch is on or off, which is why `indeterminate` is not accepted.
 */
function SwitchImpl<TKey extends keyof ComponentsAndVariants>(props: Props<TKey>, ref: Ref<HTMLInputElement>) {
  const { props: tagProps, ...restProps } = props;
  const consumerKeyDown = useEventCallback(tagProps?.onKeyDown);

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    consumerKeyDown(event);
    if (event.key !== 'Enter' || event.defaultPrevented) return;

    event.preventDefault();
    event.currentTarget.click();
  });

  return (
    <Checkbox
      ref={ref}
      component={'switch' as TKey}
      {...(restProps as SwitchProps<TKey>)}
      props={{ ...tagProps, role: 'switch', onKeyDown: handleKeyDown }}
    />
  );
}

const Switch = forwardRef(SwitchImpl);
Switch.displayName = 'Switch';

export default Switch as <TKey extends keyof ComponentsAndVariants = 'switch'>(
  props: Props<TKey> & RefAttributes<HTMLInputElement>,
) => React.ReactNode;
