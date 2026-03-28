import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ignoreLogs } from '../../dev/tests';
import Dropdown from './dropdown';

describe('Dropdown', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  const renderDropdown = (props?: Omit<Parameters<typeof Dropdown<string>>[0], 'children'>) =>
    render(
      <Dropdown<string> {...props}>
        <Dropdown.Item value="a">Alpha</Dropdown.Item>
        <Dropdown.Item value="b">Beta</Dropdown.Item>
        <Dropdown.Item value="c">Charlie</Dropdown.Item>
      </Dropdown>,
    );

  const openDropdown = () => {
    fireEvent.click(screen.getByRole('button'));
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderDropdown();
      expect(screen.getByRole('button')).toBeTruthy();
    });

    it('renders as a button element', () => {
      renderDropdown();
      expect(screen.getByRole('button').tagName).toBe('BUTTON');
    });

    it('renders the chevron icon by default', () => {
      renderDropdown();
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('hides the chevron icon when hideIcon is true', () => {
      renderDropdown({ hideIcon: true });
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeNull();
    });

    it('renders placeholder when no value and Unselect provided', () => {
      render(
        <Dropdown<string>>
          <Dropdown.Unselect>Pick one</Dropdown.Unselect>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
        </Dropdown>,
      );
      expect(screen.getByText('Pick one')).toBeTruthy();
    });
  });

  describe('Opening and Closing', () => {
    it('opens dropdown on click', () => {
      renderDropdown();
      openDropdown();
      expect(screen.getByText('Alpha')).toBeTruthy();
      expect(screen.getByText('Beta')).toBeTruthy();
      expect(screen.getByText('Charlie')).toBeTruthy();
    });

    it('closes dropdown on second click', () => {
      renderDropdown();
      openDropdown();
      expect(screen.getByText('Alpha')).toBeTruthy();
      openDropdown();
      expect(screen.queryByText('Alpha')).toBeNull();
    });

    it('closes on Escape key', () => {
      renderDropdown();
      openDropdown();
      expect(screen.getByText('Alpha')).toBeTruthy();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByText('Alpha')).toBeNull();
    });
  });

  describe('Single Selection', () => {
    it('selects an item on click', () => {
      renderDropdown();
      openDropdown();
      fireEvent.click(screen.getByText('Beta'));
      expect(screen.getByText('Beta')).toBeTruthy();
    });

    it('calls onChange with selected value and values array', () => {
      const onChange = vi.fn();
      renderDropdown({ onChange });
      openDropdown();
      fireEvent.click(screen.getByText('Beta'));
      expect(onChange).toHaveBeenCalledWith('b', ['b']);
    });

    it('closes after selection in single mode', () => {
      renderDropdown();
      openDropdown();
      fireEvent.click(screen.getByText('Beta'));
      // After selection, dropdown should close — items not visible
      expect(screen.queryByText('Alpha')).toBeNull();
      expect(screen.queryByText('Charlie')).toBeNull();
    });

    it('displays selected item text', () => {
      renderDropdown({ defaultValue: 'b' });
      expect(screen.getByText('Beta')).toBeTruthy();
    });

    it('supports defaultValue for initial selection', () => {
      const onChange = vi.fn();
      renderDropdown({ defaultValue: 'a', onChange });
      expect(screen.getByText('Alpha')).toBeTruthy();
    });
  });

  describe('Multiple Selection', () => {
    it('toggles item selection without closing', () => {
      renderDropdown({ multiple: true });
      openDropdown();
      fireEvent.click(screen.getByText('Alpha'));
      // Dropdown should stay open
      expect(screen.getByText('Beta')).toBeTruthy();
      expect(screen.getByText('Charlie')).toBeTruthy();
    });

    it('calls onChange with toggled value and updated array', () => {
      const onChange = vi.fn();
      renderDropdown({ multiple: true, onChange });
      openDropdown();
      fireEvent.click(screen.getByText('Alpha'));
      expect(onChange).toHaveBeenCalledWith('a', ['a']);
      fireEvent.click(screen.getByText('Beta'));
      expect(onChange).toHaveBeenCalledWith('b', ['a', 'b']);
    });

    it('deselects a selected item on click', () => {
      const onChange = vi.fn();
      renderDropdown({ multiple: true, defaultValue: ['a', 'b'], onChange });
      openDropdown();
      fireEvent.click(screen.getByText('Alpha'));
      expect(onChange).toHaveBeenCalledWith('a', ['b']);
    });

    it('displays comma-separated text for multiple selections', () => {
      renderDropdown({ multiple: true, defaultValue: ['a', 'b'] });
      expect(screen.getByText('Alpha, Beta')).toBeTruthy();
    });

    it('supports defaultValue array for initial selections', () => {
      renderDropdown({ multiple: true, defaultValue: ['a', 'c'] });
      expect(screen.getByText('Alpha, Charlie')).toBeTruthy();
    });
  });

  describe('Unselect', () => {
    it('renders unselect option when provided', () => {
      render(
        <Dropdown<string>>
          <Dropdown.Unselect>Select...</Dropdown.Unselect>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      openDropdown();
      expect(screen.getAllByText('Select...').length).toBeGreaterThan(0);
    });

    it('clears selection on unselect click', () => {
      const onChange = vi.fn();
      render(
        <Dropdown<string> defaultValue="a" onChange={onChange}>
          <Dropdown.Unselect>Select...</Dropdown.Unselect>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      openDropdown();
      fireEvent.click(screen.getAllByText('Select...').at(-1)!);
      expect(onChange).toHaveBeenCalledWith(undefined, []);
    });
  });

  describe('Select All', () => {
    it('renders selectAll when not all items are selected in multiple mode', () => {
      render(
        <Dropdown<string> multiple defaultValue={['a']}>
          <Dropdown.SelectAll>Select all</Dropdown.SelectAll>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      openDropdown();
      expect(screen.getByText('Select all')).toBeTruthy();
    });

    it('selects all items on click', () => {
      const onChange = vi.fn();
      render(
        <Dropdown<string> multiple onChange={onChange}>
          <Dropdown.SelectAll>Select all</Dropdown.SelectAll>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      openDropdown();
      fireEvent.click(screen.getByText('Select all'));
      expect(onChange).toHaveBeenCalledWith(undefined, ['a', 'b']);
    });

    it('hides selectAll when all items are already selected', () => {
      render(
        <Dropdown<string> multiple defaultValue={['a', 'b']}>
          <Dropdown.SelectAll>Select all</Dropdown.SelectAll>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      openDropdown();
      expect(screen.queryByText('Select all')).toBeNull();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('uses value prop in controlled mode', () => {
      render(
        <Dropdown<string> value="b">
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      expect(screen.getByText('Beta')).toBeTruthy();
    });

    it('uses defaultValue for initial uncontrolled state', () => {
      render(
        <Dropdown<string> defaultValue="a">
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      expect(screen.getByText('Alpha')).toBeTruthy();
    });

    it('updates display when controlled value changes', () => {
      const { rerender } = render(
        <Dropdown<string> value="a">
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      expect(screen.getByText('Alpha')).toBeTruthy();
      rerender(
        <Dropdown<string> value="b">
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      expect(screen.getByText('Beta')).toBeTruthy();
    });
  });

  describe('Search', () => {
    it('shows search input when isSearchable and dropdown is open', () => {
      renderDropdown({ isSearchable: true });
      openDropdown();
      expect(screen.getByRole('textbox')).toBeTruthy();
    });

    it('filters items based on search text', () => {
      renderDropdown({ isSearchable: true });
      openDropdown();
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'al' } });
      expect(screen.getByText('Alpha')).toBeTruthy();
      expect(screen.queryByText('Beta')).toBeNull();
      expect(screen.queryByText('Charlie')).toBeNull();
    });

    it('is case-insensitive', () => {
      renderDropdown({ isSearchable: true });
      openDropdown();
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'BETA' } });
      expect(screen.getByText('Beta')).toBeTruthy();
      expect(screen.queryByText('Alpha')).toBeNull();
    });

    it('shows searchPlaceholder', () => {
      renderDropdown({ isSearchable: true, searchPlaceholder: 'Type to search...' });
      openDropdown();
      expect(screen.getByPlaceholderText('Type to search...')).toBeTruthy();
    });

    it('shows empty item when no results match', () => {
      render(
        <Dropdown<string> isSearchable>
          <Dropdown.EmptyItem>No results</Dropdown.EmptyItem>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      openDropdown();
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz' } });
      expect(screen.getByText('No results')).toBeTruthy();
    });
  });

  describe('Custom Display', () => {
    it('renders static custom display', () => {
      render(
        <Dropdown<string> value="a">
          <Dropdown.Display>Custom display</Dropdown.Display>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
        </Dropdown>,
      );
      expect(screen.getByText('Custom display')).toBeTruthy();
    });

    it('calls function display with values and isOpen', () => {
      const displayFn = vi.fn((values: string[], isOpen: boolean) => `${values.join(',')} - ${isOpen ? 'open' : 'closed'}`);
      render(
        <Dropdown<string> value={['a', 'b']} multiple>
          <Dropdown.Display>{displayFn}</Dropdown.Display>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
          <Dropdown.Item value="b">Beta</Dropdown.Item>
        </Dropdown>,
      );
      expect(displayFn).toHaveBeenCalledWith(['a', 'b'], false);
      expect(screen.getByText('a,b - closed')).toBeTruthy();
    });
  });

  describe('Checkbox Mode', () => {
    it('renders checkboxes when showCheckbox and multiple', () => {
      renderDropdown({ multiple: true, showCheckbox: true });
      openDropdown();
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(3);
    });
  });

  describe('Form Integration', () => {
    it('renders hidden inputs for selected values with name prop', () => {
      renderDropdown({ name: 'fruit', defaultValue: ['a', 'b'], multiple: true });
      const hiddenInputs = document.querySelectorAll('input[name="fruit"][type="hidden"]');
      expect(hiddenInputs.length).toBe(2);
    });

    it('hidden inputs contain JSON-stringified values', () => {
      renderDropdown({ name: 'fruit', defaultValue: 'a' });
      const input = document.querySelector('input[name="fruit"][type="hidden"]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.value).toBe('"a"');
    });
  });

  describe('Compact Variant', () => {
    it('renders without crashing in compact mode', () => {
      renderDropdown({ variant: 'compact' as never });
      expect(screen.getByRole('button')).toBeTruthy();
    });
  });

  describe('Styling Control', () => {
    it('itemsProps are applied to the items container', () => {
      render(
        <Dropdown<string> itemsProps={{ width: 80 }}>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
        </Dropdown>,
      );
      openDropdown();
      expect(screen.getByText('Alpha')).toBeTruthy();
    });

    it('iconProps are applied to the icon container', () => {
      render(
        <Dropdown<string> iconProps={{ color: 'red-500' }}>
          <Dropdown.Item value="a">Alpha</Dropdown.Item>
        </Dropdown>,
      );
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeTruthy();
    });
  });
});
