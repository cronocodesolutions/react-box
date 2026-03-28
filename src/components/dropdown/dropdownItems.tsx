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
  buttonRef: React.RefObject<HTMLButtonElement>;
  itemsProps?: BoxStyleProps;
}

export default function DropdownItems<TVal>(props: Props<TVal>) {
  const { filteredItems, items, unselectItem, selectAllItem, emptyItem, showUnselect, showSelectAll, buttonRef, itemsProps } = props;
  const { valueToUse, variant, itemSelectHandler } = useDropdownContext<TVal>();

  const itemsRef = useRef<HTMLDivElement>(null);
  const [openUp, setOpenUp] = useState(false);
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
            {showUnselect && unselectItem && (
              <Box
                component="dropdown.unselect"
                variant={variant as never}
                selected={valueToUse.length === 0}
                {...{
                  ...unselectItem.props,
                  props: { ...unselectItem.props.props, onClick: (e: React.MouseEvent) => itemSelectHandler(e) },
                }}
              />
            )}
            {showSelectAll && selectAllItem && (
              <Box
                component="dropdown.selectAll"
                variant={variant as never}
                {...{
                  ...selectAllItem.props,
                  props: {
                    ...selectAllItem.props.props,
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
