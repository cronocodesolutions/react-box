import { memo } from 'react';
import Box from '../../box';
import Checkbox from '../checkbox';
import { DropdownItemProps, useDropdownContext } from './dropdownContext';

interface Props<TVal> {
  item: React.ReactElement<DropdownItemProps<TVal>>;
}

function DropdownItemRendererImpl<TVal>({ item }: Props<TVal>) {
  const { valueToUse, multiple, variant, showCheckbox, itemSelectHandler } = useDropdownContext<TVal>();
  const { value, onClick, children: itemChildren, ...itemProps } = item.props;
  const isSelected = valueToUse.includes(value);

  return (
    <Box
      key={value as React.Key}
      component="dropdown.item"
      variant={[variant, { multiple }] as never}
      selected={isSelected}
      {...{
        ...itemProps,
        children:
          showCheckbox && multiple ? (
            <>
              <Checkbox readOnly checked={isSelected} mr={2} />
              {itemChildren}
            </>
          ) : (
            itemChildren
          ),
        props: {
          ...itemProps.props,
          'aria-selected': isSelected,
          onClick: (e: React.MouseEvent) => {
            onClick?.(e);
            itemSelectHandler(e, item);
          },
        },
      }}
    />
  );
}

const DropdownItemRenderer = memo(DropdownItemRendererImpl, (prev, next) => prev.item === next.item) as <TVal>(
  props: Props<TVal>,
) => React.ReactNode;

export default DropdownItemRenderer;
