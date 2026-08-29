import { useCallback } from 'react';
import Flex from '../flex';
import Textbox from '../textbox';

interface Props {
  /** The combobox's own id. `aria-labelledby` on the listbox falls back to it. */
  id: string;
  /** What the field shows: the query while one is being typed, the value the rest of the time. */
  value: string;
  onValueChange: (value: string) => void;
  /** Only while the listbox is open — a closed field shows the value, not an invitation to type. */
  placeholder?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Everything that makes this input the combobox: the ARIA, the keys, the consumer's own props. */
  comboboxProps: Record<string, unknown>;
  /** A press on the field opens the listbox. It never closes it — the caret has to be placeable. */
  onOpen: (event: React.MouseEvent) => void;
}

/**
 * The textbox half of the APG editable combobox.
 *
 * It *is* the combobox: the role, the ARIA and the consumer's own props live on this input rather
 * than on something wrapped around it. That is what stops one focusable element from containing
 * another (bug #47) and what makes the pattern legal — `aria-autocomplete="list"` says the listbox
 * offers completions for what is typed here, and `aria-activedescendant` says which option the
 * arrows are on while DOM focus stays in the field.
 *
 * Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
export default function DropdownSearch({ id, value, onValueChange, placeholder, inputRef, comboboxProps, onOpen }: Props) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value), [onValueChange]);
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // The popup is a React child of the shell, so a press here also reaches the shell's own
      // toggle. Stopping it is what keeps a click on an open field from shutting it again.
      e.stopPropagation();
      onOpen(e);
    },
    [onOpen],
  );

  return (
    <Flex ai="center" position="absolute" inset={0} p={3}>
      <Textbox
        clean
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        ref={inputRef}
        color="currentColor"
        width="fit"
        props={{
          role: 'combobox',
          'aria-autocomplete': 'list',
          // The browser's own autofill list would cover the listbox this input controls.
          autoComplete: 'off',
          spellCheck: false,
          ...comboboxProps,
          onClick: handleClick,
        }}
      />
    </Flex>
  );
}
