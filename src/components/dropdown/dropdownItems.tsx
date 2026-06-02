import { FunctionComponent, useCallback, useRef, useState } from 'react';
import Box from '../../box';
import { BoxStyleProps } from '../../types';
import Tooltip from '../tooltip';
import { DropdownItemProps, useDropdownContext } from './dropdownContext';
import DropdownItemRenderer from './dropdownItemRenderer';

interface Props<TVal> {
  filteredItems: React.ReactElement<DropdownItemProps<TVal>>[];
  items: React.ReactElement<DropdownItemProps<TVal>>[];
  unselectItem?: React.ReactElement;
  selectAllItem?: React.ReactElement;
  emptyItem?: React.ReactElement;
  showUnselect: boolean;
  showSelectAll: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  itemsProps?: BoxStyleProps;
}

export default function DropdownItems<TVal>(props: Props<TVal>) {
  const { filteredItems, items, unselectItem, selectAllItem, emptyItem, showUnselect, showSelectAll, buttonRef, itemsProps } = props;
  const { valueToUse, variant, itemSelectHandler } = useDropdownContext<TVal>();

  // React 19 types ReactElement.props as `unknown`; these dropdown markers carry an optional `props` bag.
  const unselect = unselectItem as React.ReactElement<{ props?: object }> | undefined;
  const selectAll = selectAllItem as React.ReactElement<{ props?: object }> | undefined;

  const itemsRef = useRef<HTMLDivElement>(null);
  const [openUp, setOpenUp] = useState(false);
  // Read the button height synchronously for the initial downward offset before the Tooltip
  // reports its measured position via onPositionChange; a deferred read would flash at the wrong spot.
  // eslint-disable-next-line react-hooks/refs
  const translateY = openUp ? 0 : (buttonRef.current?.getBoundingClientRect().height ?? 0);

  const handlePositionChange = useCallback((data: { top: number; windowScrollY: number }) => {
    const shouldOpenUp = data.top - data.windowScrollY > window.innerHeight / 2;
    setOpenUp((prev) => (prev === shouldOpenUp ? prev : shouldOpenUp));
  }, []);

  return (
    <Box position="absolute" inset={0}>
      <Tooltip
        ref={itemsRef}
        minWidth="fit-content"
        style={{ transform: openUp ? `translateY(calc(-100% - 2px))` : `translateY(${translateY}px)` }}
        onPositionChange={handlePositionChange}
      >
        {(filteredItems.length > 0 || emptyItem) && (
          <Box component="dropdown.items" variant={variant as never} {...itemsProps}>
            {showUnselect && unselect && (
              <Box
                component="dropdown.unselect"
                variant={variant as never}
                selected={valueToUse.length === 0}
                {...{
                  ...unselect.props,
                  props: { ...unselect.props.props, onClick: (e: React.MouseEvent) => itemSelectHandler(e) },
                }}
              />
            )}
            {showSelectAll && selectAll && (
              <Box
                component="dropdown.selectAll"
                variant={variant as never}
                {...{
                  ...selectAll.props,
                  props: {
                    ...selectAll.props.props,
                    onClick: (e: React.MouseEvent) => itemSelectHandler(e, ...(items as React.ReactElement<DropdownItemProps<TVal>>[])),
                  },
                }}
              />
            )}
            {filteredItems.map((item) => (
              <DropdownItemRenderer<TVal> key={item.props.value as React.Key} item={item} />
            ))}

            {filteredItems.length === 0 && emptyItem && (
              <Box
                component="dropdown.emptyItem"
                variant={variant as never}
                {...(emptyItem as React.ReactElement<{ props?: object }>).props}
              />
            )}
          </Box>
        )}
      </Tooltip>
    </Box>
  );
}

(DropdownItems as FunctionComponent).displayName = 'DropdownItems';
