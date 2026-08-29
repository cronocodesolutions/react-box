import { memo } from 'react';
import Box from '../../box';
import Checkbox from '../checkbox';
import { DropdownRow, useDropdownContext } from './dropdownContext';

interface Props<TVal> {
  row: DropdownRow<TVal>;
  /** Position in the listbox — what `aria-activedescendant`, the arrow keys and the ref share. */
  index: number;
}

/** The component style a row draws itself with. All three are options; only the styling differs. */
const componentOf = { item: 'dropdown.item', unselect: 'dropdown.unselect', selectAll: 'dropdown.selectAll' } as const;

/**
 * One `role="option"` in the listbox.
 *
 * The role is what makes the `aria-selected` beside it legal — on a plain `<div>` the attribute is
 * not defined at all, which is what axe was reporting (bug #46) and what a screen reader was
 * ignoring. It also makes the row addressable: an option needs an id for the combobox's
 * `aria-activedescendant` to point at, since DOM focus never leaves the trigger.
 */
function DropdownRowRendererImpl<TVal>({ row, index }: Props<TVal>) {
  const { valueToUse, multiple, variant, showCheckbox, selectRow, optionId, activeIndex, rowRef, isRowDisabled } =
    useDropdownContext<TVal>();

  const isItem = row.kind === 'item';
  const disabled = isRowDisabled(index);
  const isSelected = isItem ? valueToUse.includes(row.element.props.value) : row.kind === 'unselect' && valueToUse.length === 0;

  // React 19 types `ReactElement.props` as `unknown`; a row's element is one of the marker
  // components, whose props are Box props plus the item's own `value`/`onClick`.
  const {
    value: _value,
    onClick,
    children,
    ...elementProps
  } = row.element.props as {
    value?: TVal;
    onClick?: (e: React.MouseEvent) => void;
    children?: React.ReactNode;
    props?: Record<string, unknown>;
  };

  const checkbox = showCheckbox && multiple && isItem;

  return (
    <Box
      ref={rowRef(index)}
      component={componentOf[row.kind]}
      // `highlighted` is where the keyboard is, and a listbox driven by `aria-activedescendant` has
      // to draw that itself: nothing in it ever holds DOM focus, so `:focus-within` never fires.
      variant={[variant, isItem ? { multiple, highlighted: index === activeIndex } : { highlighted: index === activeIndex }] as never}
      selected={isSelected}
      {...{
        ...elementProps,
        id: optionId(index),
        children: checkbox ? (
          <>
            {/* Decoration, not a control: `aria-selected` on the option already carries the state,
                and a real focusable input inside an option is one interactive widget inside another. */}
            <Checkbox readOnly checked={isSelected} mr={2} props={{ tabIndex: -1, 'aria-hidden': true }} />
            {children}
          </>
        ) : (
          children
        ),
        props: {
          role: 'option',
          ...(disabled ? { 'aria-disabled': true } : {}),
          ...elementProps.props,
          onClick: disabled
            ? undefined
            : (e: React.MouseEvent) => {
                onClick?.(e);
                selectRow(index, e);
              },
        },
      }}
    />
  );
}

const DropdownRowRenderer = memo(
  DropdownRowRendererImpl,
  (prev, next) => prev.row.element === next.row.element && prev.index === next.index,
) as <TVal>(props: Props<TVal>) => React.ReactNode;

export default DropdownRowRenderer;
