import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box from '../../../box';
import Checkbox from '../../checkbox';
import Dropdown from '../../dropdown';
import Flex from '../../flex';
import Textbox from '../../textbox';
import { ColumnFilterConfig, NumberFilterValue } from '../contracts/dataGridContract';
import ColumnModel from '../models/columnModel';
import GridModel from '../models/gridModel';

interface Props<TRow> {
  column: ColumnModel<TRow>;
  grid: GridModel<TRow>;
}

interface FilterOption {
  label: string;
  value: string | number | boolean | null;
}

/**
 * Text filter with fuzzy search support
 */
function TextFilter<TRow>({ column, grid }: Props<TRow>) {
  const currentFilter = grid.columnFilters[column.key as keyof TRow];
  const initialValue = currentFilter?.type === 'text' ? currentFilter.value : '';
  const [localValue, setLocalValue] = useState(initialValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounced update
      timeoutRef.current = setTimeout(() => {
        if (value.trim()) {
          grid.setColumnFilter(column.key, { type: 'text', value });
        } else {
          grid.setColumnFilter(column.key, undefined);
        }
        timeoutRef.current = null;
      }, 300);
    },
    [grid, column.key],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    grid.setColumnFilter(column.key, undefined);
  }, [grid, column.key]);

  const config: ColumnFilterConfig = typeof column.def.filterable === 'object' ? column.def.filterable : { type: 'text' };

  return (
    <Flex ai="center" position="relative" width="fit">
      <Textbox
        variant="compact"
        // component="datagrid.filter.text"
        placeholder={config.placeholder ?? 'Filter...'}
        value={localValue}
        onChange={handleChange}
        // height={7}
        // width="fit"
        // minWidth={20}
        // px={2}
        // fontSize={13}
      />
      {localValue && (
        <Flex position="absolute" right={2} top="1/2" translateY="-1/2" cursor="pointer" props={{ onClick: handleClear }}>
          <Box fontSize={10} color="gray-400" hover={{ color: 'gray-600' }}>
            ✕
          </Box>
        </Flex>
      )}
    </Flex>
  );
}

/**
 * Number filter with comparison operators
 */
function NumberFilter<TRow>({ column, grid }: Props<TRow>) {
  const currentFilter = grid.columnFilters[column.key as keyof TRow];
  const initialValue = currentFilter?.type === 'number' ? currentFilter.value : '';
  const initialOperator = currentFilter?.type === 'number' ? currentFilter.operator : 'eq';
  const initialValueTo = currentFilter?.type === 'number' ? currentFilter.valueTo : '';

  const [localValue, setLocalValue] = useState<string | number>(initialValue);
  const [operator, setOperator] = useState<NumberFilterValue['operator']>(initialOperator);
  const [valueTo, setValueTo] = useState<string | number>(initialValueTo ?? '');
  const valueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueToTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (valueTimeoutRef.current) {
        clearTimeout(valueTimeoutRef.current);
      }
      if (valueToTimeoutRef.current) {
        clearTimeout(valueToTimeoutRef.current);
      }
    };
  }, []);

  const config: ColumnFilterConfig = typeof column.def.filterable === 'object' ? column.def.filterable : { type: 'number' };

  const applyFilter = useCallback(
    (op: NumberFilterValue['operator'], val: string | number, valTo?: string | number) => {
      const numVal = typeof val === 'number' ? val : parseFloat(val);

      if (isNaN(numVal) || val === '') {
        grid.setColumnFilter(column.key, undefined);
        return;
      }

      const filter: NumberFilterValue = {
        type: 'number',
        operator: op,
        value: numVal,
      };

      if (op === 'between' && valTo !== undefined && valTo !== '') {
        const numValTo = typeof valTo === 'number' ? valTo : parseFloat(String(valTo));
        if (!isNaN(numValTo)) {
          filter.valueTo = numValTo;
        }
      }

      grid.setColumnFilter(column.key, filter);
    },
    [grid, column.key],
  );

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);

      // Clear previous timeout
      if (valueTimeoutRef.current) {
        clearTimeout(valueTimeoutRef.current);
      }

      valueTimeoutRef.current = setTimeout(() => {
        applyFilter(operator, value, valueTo);
        valueTimeoutRef.current = null;
      }, 300);
    },
    [operator, valueTo, applyFilter],
  );

  const handleOperatorChange = useCallback(
    (op: NumberFilterValue['operator']) => {
      setOperator(op);
      applyFilter(op, localValue, valueTo);
    },
    [localValue, valueTo, applyFilter],
  );

  const handleValueToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValueTo(value);

      // Clear previous timeout
      if (valueToTimeoutRef.current) {
        clearTimeout(valueToTimeoutRef.current);
      }

      valueToTimeoutRef.current = setTimeout(() => {
        applyFilter(operator, localValue, value);
        valueToTimeoutRef.current = null;
      }, 300);
    },
    [operator, localValue, applyFilter],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    setValueTo('');
    setOperator('eq');
    grid.setColumnFilter(column.key, undefined);
  }, [grid, column.key]);

  return (
    <Flex ai="center" gap={1} width="fit">
      <Dropdown<NumberFilterValue['operator']>
        value={operator}
        variant="compact"
        onChange={(val) => val && handleOperatorChange(val)}
        height={7}
        px={2}
        py={0}
        minWidth={0}
        hideIcon
        b={1}
        borderColor="gray-300"
        bgColor="white"
        borderRadius={2}
        fontSize={13}
        theme={{
          dark: {
            bgColor: 'gray-800',
            borderColor: 'gray-700',
            color: 'gray-100',
          },
        }}
      >
        <Dropdown.Item value="eq">=</Dropdown.Item>
        <Dropdown.Item value="ne">≠</Dropdown.Item>
        <Dropdown.Item value="gt">&gt;</Dropdown.Item>
        <Dropdown.Item value="gte">≥</Dropdown.Item>
        <Dropdown.Item value="lt">&lt;</Dropdown.Item>
        <Dropdown.Item value="lte">≤</Dropdown.Item>
        <Dropdown.Item value="between">↔</Dropdown.Item>
      </Dropdown>
      {operator === 'between' ? (
        <>
          <Textbox
            type="number"
            component="datagrid.filter.number"
            placeholder={config.placeholder ?? 'From'}
            value={localValue}
            onChange={handleValueChange}
            height={7}
            width={20}
            px={2}
            fontSize={13}
            step={config.step}
          />
          <Box fontSize={13} color="gray-500" theme={{ dark: { color: 'gray-400' } }}>
            -
          </Box>
          <Flex ai="center" position="relative">
            <Textbox
              type="number"
              component="datagrid.filter.number"
              placeholder="To"
              value={valueTo}
              onChange={handleValueToChange}
              height={7}
              width={20}
              px={2}
              fontSize={13}
              step={config.step}
            />
            {(localValue !== '' || valueTo !== '') && (
              <Flex position="absolute" right={2} top="1/2" translateY="-1/2" cursor="pointer" props={{ onClick: handleClear }}>
                <Box fontSize={10} color="gray-400" hover={{ color: 'gray-600' }}>
                  ✕
                </Box>
              </Flex>
            )}
          </Flex>
        </>
      ) : (
        <Flex ai="center" position="relative">
          <Textbox
            type="number"
            component="datagrid.filter.number"
            placeholder={config.placeholder ?? 'Value'}
            value={localValue}
            onChange={handleValueChange}
            height={7}
            width={20}
            px={2}
            fontSize={13}
            step={config.step}
          />
          {localValue !== '' && (
            <Flex position="absolute" right={2} top="1/2" translateY="-1/2" cursor="pointer" props={{ onClick: handleClear }}>
              <Box fontSize={10} color="gray-400" hover={{ color: 'gray-600' }}>
                ✕
              </Box>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
}

/**
 * Multi-select filter with checkbox list
 */
function MultiselectFilter<TRow>({ column, grid }: Props<TRow>) {
  const currentFilter = grid.columnFilters[column.key as keyof TRow];
  const selectedValues = currentFilter?.type === 'multiselect' ? currentFilter.values : [];

  const config: ColumnFilterConfig = typeof column.def.filterable === 'object' ? column.def.filterable : { type: 'multiselect' };

  // Get options from config or compute unique values
  const options: FilterOption[] = useMemo(() => {
    if (config.options) {
      return config.options;
    }

    const uniqueValues = grid.getColumnUniqueValues(column.key);
    return uniqueValues.map((value) => ({
      label: value === null ? '(empty)' : String(value),
      value,
    }));
  }, [config.options, grid, column.key]);

  const handleChange = useCallback(
    (_value: string | number | boolean | null | undefined, values: (string | number | boolean | null)[]) => {
      if (values.length === 0) {
        grid.setColumnFilter(column.key, undefined);
      } else {
        grid.setColumnFilter(column.key, { type: 'multiselect', values });
      }
    },
    [grid, column.key],
  );

  return (
    <Dropdown<string | number | boolean | null>
      multiple
      isSearchable
      searchPlaceholder="Search..."
      value={selectedValues}
      onChange={handleChange}
      variant="compact"
    >
      <Dropdown.Unselect>Clear</Dropdown.Unselect>
      <Dropdown.SelectAll>Select All</Dropdown.SelectAll>
      {options.map((option) => (
        <Dropdown.Item<string | number | boolean | null> key={String(option.value)} value={option.value} ai="center" gap={2}>
          <Checkbox readOnly checked={selectedValues.includes(option.value)} />

          {option.label}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}

/**
 * Main column filter component that renders the appropriate filter type
 */
export default function DataGridColumnFilter<TRow>(props: Props<TRow>) {
  const { column, grid } = props;
  const { filterable } = column.def;

  if (!filterable) return null;

  const config: ColumnFilterConfig = typeof filterable === 'object' ? filterable : { type: 'text' };

  switch (config.type) {
    case 'text':
      return <TextFilter column={column} grid={grid} />;
    case 'number':
      return <NumberFilter column={column} grid={grid} />;
    case 'multiselect':
      return <MultiselectFilter column={column} grid={grid} />;
    default:
      return <TextFilter column={column} grid={grid} />;
  }
}

(DataGridColumnFilter as React.FunctionComponent).displayName = 'DataGridColumnFilter';
