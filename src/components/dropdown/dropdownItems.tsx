import { FunctionComponent, Ref, useCallback, useState } from 'react';
import Box from '../../box';
import { BoxStyleProps } from '../../types';
import Overlay from '../overlay';
import { DropdownRow, useDropdownContext } from './dropdownContext';
import DropdownRowRenderer from './dropdownRowRenderer';

interface Props<TVal> {
  /** Every row the listbox shows, already in keyboard order. */
  rows: DropdownRow<TVal>[];
  emptyItem?: React.ReactElement;
  /** The shell the popup hangs off: a button in select-only mode, the field's wrapper otherwise. */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** The layer element — what the dismissal hook treats as *inside* the popup. */
  popupRef: Ref<HTMLDivElement>;
  /** `aria-controls` on the trigger names this. */
  listboxId: string;
  /** What names the listbox: the dropdown's own label when it has one, else its trigger. */
  labelledBy: string;
  itemsProps?: BoxStyleProps;
}

/** The popup the trigger controls: a `listbox` while it has options, a status message when it does not. */
function rolesFor(hasOptions: boolean, multiple: boolean, labelledBy: string): Record<string, unknown> {
  if (!hasOptions) {
    // A listbox owns options. With none left — a search that matched nothing — the popup holds one
    // message instead, and a message is announced rather than offered as something to choose.
    return { role: 'status' };
  }

  return {
    role: 'listbox',
    'aria-labelledby': labelledBy,
    // Only when it is true: `false` is the default, and saying it on every single-select listbox
    // is noise in the accessibility tree.
    ...(multiple ? { 'aria-multiselectable': true } : {}),
  };
}

export default function DropdownItems<TVal>(props: Props<TVal>) {
  const { rows, emptyItem, triggerRef, popupRef, listboxId, labelledBy, itemsProps } = props;
  const { multiple, variant } = useDropdownContext<TVal>();

  const [openUp, setOpenUp] = useState(false);
  // Read the trigger height synchronously for the initial downward offset before the Overlay
  // reports its measured position via onPositionChange; a deferred read would flash at the wrong spot.
  // eslint-disable-next-line react-hooks/refs
  const translateY = openUp ? 0 : (triggerRef.current?.getBoundingClientRect().height ?? 0);

  const handlePositionChange = useCallback((data: { top: number; windowScrollY: number }) => {
    const shouldOpenUp = data.top - data.windowScrollY > window.innerHeight / 2;
    setOpenUp((prev) => (prev === shouldOpenUp ? prev : shouldOpenUp));
  }, []);

  return (
    <Box position="absolute" inset={0}>
      <Overlay
        ref={popupRef}
        minWidth="fit-content"
        style={{ transform: openUp ? `translateY(calc(-100% - 2px))` : `translateY(${translateY}px)` }}
        onPositionChange={handlePositionChange}
      >
        <Box
          component="dropdown.items"
          variant={variant as never}
          {...itemsProps}
          id={listboxId}
          props={rolesFor(rows.length > 0, multiple, labelledBy)}
        >
          {rows.map((row, index) => (
            <DropdownRowRenderer<TVal> key={rowKey(row, index)} row={row} index={index} />
          ))}

          {rows.length === 0 && emptyItem && (
            <Box component="dropdown.emptyItem" variant={variant as never} {...(emptyItem as React.ReactElement<object>).props} />
          )}
        </Box>
      </Overlay>
    </Box>
  );
}

function rowKey<TVal>(row: DropdownRow<TVal>, index: number): React.Key {
  return row.kind === 'item' ? (row.element.props.value as React.Key) : `${row.kind}-${index}`;
}

(DropdownItems as FunctionComponent).displayName = 'DropdownItems';
