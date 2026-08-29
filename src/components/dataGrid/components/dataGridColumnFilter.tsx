import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '../../../box';
import Dropdown from '../../dropdown';
import Flex from '../../flex';
import Textbox from '../../textbox';
import { NumberFilterValue } from '../contracts/dataGridContract';
import ColumnModel from '../models/columnModel';

interface Props<TRow> {
  column: ColumnModel<TRow>;
}

/**
 * Text filter with fuzzy search support.
 * Local input + debounce stay here; config/parsing/commit live on ColumnModel.
 */
function TextFilter<TRow>({ column }: Props<TRow>) {
  const { currentFilter } = column;
  const { componentName } = column.grid;
  const initialValue = currentFilter?.type === 'text' ? currentFilter.value : '';
  const [localValue, setLocalValue] = useState(initialValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        column.setTextFilter(value);
        timeoutRef.current = null;
      }, 300);
    },
    [column],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    column.clearFilter();
  }, [column]);

  return (
    <Flex component={`${componentName}.filter.cell.input` as never}>
      <Textbox
        width="fit"
        variant="compact"
        placeholder={column.filterConfig?.placeholder ?? 'Filter...'}
        value={localValue}
        onChange={handleChange}
        b={0}
        bgColor="transparent"
        focus={{ outline: 0 }}
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
 * Number filter with comparison operators.
 */
function NumberFilter<TRow>({ column }: Props<TRow>) {
  const { currentFilter } = column;
  const { componentName } = column.grid;
  const initialValue = currentFilter?.type === 'number' ? currentFilter.value : '';
  const initialOperator = currentFilter?.type === 'number' ? currentFilter.operator : 'eq';
  const initialValueTo = currentFilter?.type === 'number' ? currentFilter.valueTo : '';

  const [localValue, setLocalValue] = useState<string | number>(initialValue);
  const [operator, setOperator] = useState<NumberFilterValue['operator']>(initialOperator);
  const [valueTo, setValueTo] = useState<string | number>(initialValueTo ?? '');
  const valueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueToTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (valueTimeoutRef.current) clearTimeout(valueTimeoutRef.current);
      if (valueToTimeoutRef.current) clearTimeout(valueToTimeoutRef.current);
    };
  }, []);

  const config = column.filterConfig;

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);

      if (valueTimeoutRef.current) clearTimeout(valueTimeoutRef.current);

      valueTimeoutRef.current = setTimeout(() => {
        column.setNumberFilter(operator, value, valueTo);
        valueTimeoutRef.current = null;
      }, 300);
    },
    [column, operator, valueTo],
  );

  const handleOperatorChange = useCallback(
    (op: NumberFilterValue['operator']) => {
      setOperator(op);
      column.setNumberFilter(op, localValue, valueTo);
    },
    [column, localValue, valueTo],
  );

  const handleValueToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValueTo(value);

      if (valueToTimeoutRef.current) clearTimeout(valueToTimeoutRef.current);

      valueToTimeoutRef.current = setTimeout(() => {
        column.setNumberFilter(operator, localValue, value);
        valueToTimeoutRef.current = null;
      }, 300);
    },
    [column, operator, localValue],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    setValueTo('');
    setOperator('eq');
    column.clearFilter();
  }, [column]);

  return (
    <Flex component={`${componentName}.filter.cell.input` as never} ai={operator === 'between' ? 'start' : 'center'} gap={1}>
      <Dropdown<NumberFilterValue['operator']>
        value={operator}
        variant="compact"
        onChange={(val) => val && handleOperatorChange(val)}
        minWidth={6}
        hideIcon
        b={0}
        bgColor="transparent"
        focus={{ outline: 0 }}
        // The trigger's content is a mathematical symbol, and a combobox is not named by its
        // content anyway — without this the control announces as nothing at all.
        props={{ 'aria-label': 'Comparison' }}
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
        <Flex d="column" gap={1} flex1>
          <Flex ai="center" position="relative" flex1>
            <Textbox
              type="number"
              variant="compact"
              placeholder={config?.placeholder ?? 'From'}
              value={localValue}
              onChange={handleValueChange}
              width="fit"
              step={config?.step}
              b={0}
              bgColor="transparent"
              focus={{ outline: 0 }}
            />
            {(localValue !== '' || valueTo !== '') && (
              <Flex position="absolute" right={2} top="1/2" translateY="-1/2" cursor="pointer" props={{ onClick: handleClear }}>
                <Box fontSize={10} color="gray-400" hover={{ color: 'gray-600' }}>
                  ✕
                </Box>
              </Flex>
            )}
          </Flex>
          <Flex ai="center" flex1>
            <Textbox
              type="number"
              variant="compact"
              placeholder="To"
              value={valueTo}
              onChange={handleValueToChange}
              width="fit"
              step={config?.step}
              b={0}
              bgColor="transparent"
              focus={{ outline: 0 }}
            />
          </Flex>
        </Flex>
      ) : (
        <Flex ai="center" position="relative" flex1>
          <Textbox
            type="number"
            variant="compact"
            placeholder={config?.placeholder ?? 'Value'}
            value={localValue}
            onChange={handleValueChange}
            width="fit"
            step={config?.step}
            b={0}
            bgColor="transparent"
            focus={{ outline: 0 }}
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
 * Multi-select filter with checkbox list.
 */
function MultiselectFilter<TRow>({ column }: Props<TRow>) {
  const { currentFilter } = column;
  const { componentName } = column.grid;
  const selectedValues = currentFilter?.type === 'multiselect' ? currentFilter.values : [];
  const options = column.filterOptions;

  const handleChange = useCallback(
    (_value: string | number | boolean | null | undefined, values: (string | number | boolean | null)[]) => {
      column.setMultiselectFilter(values);
    },
    [column],
  );

  return (
    <Flex component={`${componentName}.filter.cell.input` as never}>
      <Dropdown<string | number | boolean | null>
        multiple
        showCheckbox
        isSearchable
        searchPlaceholder="Search..."
        value={selectedValues}
        width="fit"
        minWidth={0}
        bgColor="transparent"
        onChange={handleChange}
        variant="compact"
        b={0}
        focus={{ outline: 0 }}
        props={{ 'aria-label': 'Filter' }}
      >
        <Dropdown.Display>
          {(vals: (string | number | boolean | null)[]) => {
            if (vals.length === 0)
              return (
                <Box tag="span" color="gray-400">
                  {column.filterConfig?.placeholder ?? 'Select...'}
                </Box>
              );
            if (vals.length === 1) {
              const opt = options.find((o) => o.value === vals[0]);
              return opt?.label ?? String(vals[0]);
            }
            return `${vals.length} selected`;
          }}
        </Dropdown.Display>
        <Dropdown.Unselect>Clear</Dropdown.Unselect>
        <Dropdown.SelectAll>Select All</Dropdown.SelectAll>
        {options.map((option) => (
          <Dropdown.Item<string | number | boolean | null> key={String(option.value)} value={option.value} ai="center" gap={2}>
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </Flex>
  );
}

/**
 * Renders the appropriate filter input for the column's resolved filter type.
 */
export default function DataGridColumnFilter<TRow>(props: Props<TRow>) {
  const { column } = props;
  const config = column.filterConfig;

  if (!config) return null;

  switch (config.type) {
    case 'number':
      return <NumberFilter column={column} />;
    case 'multiselect':
      return <MultiselectFilter column={column} />;
    case 'text':
    default:
      return <TextFilter column={column} />;
  }
}

(DataGridColumnFilter as React.FunctionComponent).displayName = 'DataGridColumnFilter';
