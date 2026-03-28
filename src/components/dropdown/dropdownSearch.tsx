import { useCallback } from 'react';
import Flex from '../flex';
import Textbox from '../textbox';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchBoxRef: React.RefObject<HTMLInputElement>;
}

export default function DropdownSearch({ search, onSearchChange, searchPlaceholder, searchBoxRef }: Props) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value), [onSearchChange]);
  const handleClick = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <Flex ai="center" position="absolute" inset={0} p={3}>
      <Textbox
        clean
        placeholder={searchPlaceholder}
        value={search}
        onChange={handleChange}
        ref={searchBoxRef}
        color="currentColor"
        width="fit"
        props={{ onClick: handleClick }}
      />
    </Flex>
  );
}
