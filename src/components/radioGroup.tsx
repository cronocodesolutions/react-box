import { createContext, Ref, RefAttributes, useContext, useMemo, useRef } from 'react';
import { BoxProps, BoxTagProps } from '../box';
import { useEventCallback } from '../react/a11y/callbacks';
import useControllableState, { ChangeHandler } from '../react/a11y/useControllableState';
import useIdentifier from '../react/a11y/useIdentifier';
import { ComponentsAndVariants } from '../types';
import Flex from './flex';
import RadioButton from './radioButton';
import { Span } from './semantics';

/** Why the selection changed — `onChange` gets this alongside the event that did it. */
export type RadioGroupReason = 'click' | 'keyboard';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  select(value: string, event: React.SyntheticEvent): void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

type RadioGroupBoxProps<TKey extends keyof ComponentsAndVariants> = Omit<BoxProps<'div', TKey>, 'tag' | 'onChange' | 'children'>;

interface Props<TKey extends keyof ComponentsAndVariants> extends RadioGroupBoxProps<TKey> {
  /** The group's name, rendered above it and used as the group's accessible name. */
  label?: React.ReactNode;
  /** The `name` every radio in the group submits under. Generated when left out. */
  name?: string;
  /** Controlled selection. Leave it out and the group owns it. */
  value?: string;
  defaultValue?: string;
  onChange?: ChangeHandler<string | undefined, RadioGroupReason>;
  /** Which way the radios stack. Both arrow pairs navigate either way, as APG specifies. */
  orientation?: 'vertical' | 'horizontal';
  children?: React.ReactNode;
}

interface ItemProps extends Omit<BoxProps<'input', 'radioButton'>, 'tag' | 'props' | 'onChange' | 'checked'> {
  /** What this radio submits, and what the group reports when it is chosen. */
  value: string;
  /** Only for an item rendered outside a group — inside one, the group supplies the name. */
  name?: string;
  /** The text beside the radio, rendered inside a label that wraps the input. */
  label?: React.ReactNode;
  labelProps?: BoxProps<'label'>;
  props?: BoxTagProps<'input'>;
  ref?: Ref<HTMLInputElement>;
}

interface RadioGroupType {
  <TKey extends keyof ComponentsAndVariants = never>(props: Props<TKey>): React.ReactNode;
  Item: (props: ItemProps & RefAttributes<HTMLInputElement>) => React.ReactNode;
  displayName?: string;
}

/** The radios in a group, in the order the user meets them, skipping the ones they cannot reach. */
function radiosIn(group: HTMLElement | null): HTMLInputElement[] {
  const all = group?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? [];

  return [...all].filter((radio) => !radio.disabled);
}

/** Which way an arrow key moves, or 0 for a key that is not one. */
function directionOf(key: string): number {
  if (key === 'ArrowDown' || key === 'ArrowRight') return 1;
  if (key === 'ArrowUp' || key === 'ArrowLeft') return -1;

  return 0;
}

/**
 * The APG radio group: one label over a set of radios, with the arrow keys moving between them and
 * choosing as they go. Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 *
 * ```tsx
 * <RadioGroup label="Plan" defaultValue="free" onChange={(plan) => setPlan(plan)}>
 *   <RadioGroup.Item value="free" label="Free" />
 *   <RadioGroup.Item value="pro" label="Pro" />
 * </RadioGroup>
 * ```
 *
 * What the group owns: `role="radiogroup"` named by its own label — a set of radios with nothing
 * over it is a flat list of unrelated controls to a screen reader — the shared `name` the items
 * submit under, the selected value, and the arrow keys.
 *
 * What it deliberately does not own is the tab order. A native radio set is already a single tab
 * stop with the checked member holding it: the platform's own roving tabindex, which a `tabIndex`
 * of ours would only fight. The arrow keys are the half worth owning — the browser implements them
 * too, so the handler calls `preventDefault` to stop the move happening twice, and activates the
 * radio it lands on with a real click, which is what the browser's own implementation does.
 *
 * `RadioGroup.Item` is a `RadioButton` wired to the group. A plain `RadioButton` nested inside
 * still gets the role, the label and the arrow keys, but carries its own `name` and `checked`.
 */
function RadioGroupImpl<TKey extends keyof ComponentsAndVariants = never>(props: Props<TKey>) {
  const { label, name, value, defaultValue, onChange, orientation = 'vertical', children, props: tagProps, ...restProps } = props;

  const identifier = useIdentifier('radiogroup');
  const groupRef = useRef<HTMLDivElement>(null);
  // What the *next* change was caused by, read by an item's `onChange`. The group activates a
  // radio with a real click, so by the time the change arrives the keystroke behind it is gone.
  const source = useRef<RadioGroupReason>('click');

  const [selected, setSelected] = useControllableState<string | undefined, RadioGroupReason>({ value, defaultValue, onChange });

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    const direction = directionOf(event.key);
    if (direction === 0 || event.defaultPrevented) return;

    const radios = radiosIn(groupRef.current);
    const current = radios.indexOf(document.activeElement as HTMLInputElement);
    if (current === -1) return;

    // The browser moves focus between same-name radios itself. Letting both run moves it twice.
    event.preventDefault();

    const next = radios[(current + direction + radios.length) % radios.length];
    if (next === radios[current]) return;

    source.current = 'keyboard';
    next.focus();
    // A click, not an assignment to `checked`: it is what tells React, an uncontrolled radio and a
    // surrounding form all at once, and it is what the browser does for this keystroke natively.
    next.click();
    source.current = 'click';
  });

  const labelId = `${identifier}-label`;
  const hasLabel = label !== undefined && label !== null;

  const context = useMemo<RadioGroupContextValue>(
    () => ({
      name: name ?? identifier,
      value: selected,
      select: (itemValue, event) => setSelected(itemValue, { reason: source.current, event }),
    }),
    [identifier, name, selected, setSelected],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <Flex
        ref={groupRef}
        d={orientation === 'horizontal' ? 'row' : 'column'}
        gap={2}
        {...(restProps as BoxProps<'div'>)}
        props={{ role: 'radiogroup', 'aria-labelledby': hasLabel ? labelId : undefined, ...tagProps, onKeyDown: handleKeyDown }}
      >
        {hasLabel && <Span id={labelId}>{label}</Span>}
        {children}
      </Flex>
    </RadioGroupContext.Provider>
  );
}

/**
 * A radio that reads its group: the shared `name`, whether it is the selected one, and what to
 * report when it is chosen. Outside a `RadioGroup` it is a plain `RadioButton`.
 */
function RadioGroupItem(props: ItemProps) {
  const group = useContext(RadioGroupContext);
  const { value, ...restProps } = props;
  const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => group?.select(value, event));

  if (!group) return <RadioButton value={value} {...restProps} />;

  return <RadioButton name={group.name} value={value} checked={group.value === value} onChange={handleChange} {...restProps} />;
}

RadioGroupItem.displayName = 'RadioGroup.Item';

const RadioGroup = RadioGroupImpl as RadioGroupType;
RadioGroup.Item = RadioGroupItem;
RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
