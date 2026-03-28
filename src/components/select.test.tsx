import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ignoreLogs } from '../../dev/tests';
import Select from './select';

interface Fruit {
  id: string;
  name: string;
  color: string;
}

const fruits: Fruit[] = [
  { id: 'apple', name: 'Apple', color: 'red' },
  { id: 'banana', name: 'Banana', color: 'yellow' },
  { id: 'cherry', name: 'Cherry', color: 'red' },
];

describe('Select', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSelect = (overrides?: Record<string, any>) => {
    const { data = fruits, def = { valueKey: 'id', displayKey: 'name' }, ...rest } = overrides ?? {};
    return render(<Select<Fruit, string> data={data} def={def} {...rest} />);
  };

  const openSelect = () => fireEvent.click(screen.getByRole('button'));

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderSelect();
      expect(screen.getByRole('button')).toBeTruthy();
    });

    it('renders items from data using displayKey', () => {
      renderSelect();
      openSelect();
      expect(screen.getByText('Apple')).toBeTruthy();
      expect(screen.getByText('Banana')).toBeTruthy();
      expect(screen.getByText('Cherry')).toBeTruthy();
    });

    it('uses valueKey as display when no displayKey', () => {
      render(<Select<Fruit, string> data={fruits} def={{ valueKey: 'id' }} />);
      openSelect();
      expect(screen.getByText('apple')).toBeTruthy();
      expect(screen.getByText('banana')).toBeTruthy();
    });
  });

  describe('Selection', () => {
    it('calls onChange with the value from valueKey', () => {
      const onChange = vi.fn();
      renderSelect({ onChange });
      openSelect();
      fireEvent.click(screen.getByText('Banana'));
      expect(onChange).toHaveBeenCalledWith('banana', ['banana']);
    });

    it('displays selected item text', () => {
      renderSelect({ defaultValue: 'apple' });
      expect(screen.getByText('Apple')).toBeTruthy();
    });
  });

  describe('Multiple Selection', () => {
    it('supports multiple selection', () => {
      const onChange = vi.fn();
      renderSelect({ multiple: true, onChange });
      openSelect();
      fireEvent.click(screen.getByText('Apple'));
      expect(onChange).toHaveBeenCalledWith('apple', ['apple']);
      fireEvent.click(screen.getByText('Banana'));
      expect(onChange).toHaveBeenCalledWith('banana', ['apple', 'banana']);
    });

    it('displays comma-separated text for multiple selections', () => {
      renderSelect({ multiple: true, defaultValue: ['apple', 'banana'] });
      expect(screen.getByText('Apple, Banana')).toBeTruthy();
    });
  });

  describe('Def Options', () => {
    it('renders placeholder from def', () => {
      renderSelect({ def: { valueKey: 'id', displayKey: 'name', placeholder: 'Pick a fruit...' } });
      expect(screen.getByText('Pick a fruit...')).toBeTruthy();
    });

    it('renders selectAllText in multiple mode', () => {
      renderSelect({
        multiple: true,
        def: { valueKey: 'id', displayKey: 'name', selectAllText: 'Select all fruits' },
      });
      openSelect();
      expect(screen.getByText('Select all fruits')).toBeTruthy();
    });

    it('renders emptyText when search yields no results', () => {
      renderSelect({
        isSearchable: true,
        def: { valueKey: 'id', displayKey: 'name', emptyText: 'No fruits found' },
      });
      openSelect();
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz' } });
      expect(screen.getByText('No fruits found')).toBeTruthy();
    });

    it('uses custom display function for items', () => {
      renderSelect({
        def: {
          valueKey: 'id',
          display: (row: Fruit) => `${row.name} (${row.color})`,
        },
      });
      openSelect();
      expect(screen.getByText('Apple (red)')).toBeTruthy();
      expect(screen.getByText('Banana (yellow)')).toBeTruthy();
    });

    it('uses selectedDisplay function for the trigger', () => {
      const selectedDisplay = vi.fn((rows: Fruit[]) => `${rows.length} fruits`);
      renderSelect({
        multiple: true,
        defaultValue: ['apple', 'banana'],
        def: {
          valueKey: 'id',
          displayKey: 'name',
          selectedDisplay,
        },
      });
      expect(selectedDisplay).toHaveBeenCalled();
      expect(screen.getByText('2 fruits')).toBeTruthy();
    });
  });

  describe('Passthrough Props', () => {
    it('passes isSearchable to Dropdown', () => {
      renderSelect({ isSearchable: true, searchPlaceholder: 'Search...' });
      openSelect();
      expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
    });

    it('passes showCheckbox to Dropdown', () => {
      renderSelect({ multiple: true, showCheckbox: true });
      openSelect();
      expect(screen.getAllByRole('checkbox').length).toBe(3);
    });

    it('passes name for form integration', () => {
      renderSelect({ name: 'fruit', defaultValue: 'apple' });
      const input = document.querySelector('input[name="fruit"][type="hidden"]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.value).toBe('"apple"');
    });
  });
});
