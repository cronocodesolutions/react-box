import { useMemo } from 'react';
import Box from '../../../box';
import BaseSvg from '../../baseSvg';
import Dropdown from '../../dropdown';
import Flex from '../../flex';
import GridModel, { EMPTY_CELL_KEY, GROUPING_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY } from '../models/gridModel';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridTopBarContextMenu<TRow>(props: Props<TRow>) {
  const { grid } = props;

  const leafsToHide = useMemo(
    () =>
      grid.columns.value.leafs.filter(
        (l) => ![EMPTY_CELL_KEY, ROW_NUMBER_CELL_KEY, ROW_SELECTION_CELL_KEY, GROUPING_CELL_KEY].includes(l.key),
      ),
    [grid.columns.value.leafs],
  );

  const columnEntries = leafsToHide.map((leaf) => ({
    id: String(leaf.key),
    label: leaf.header ?? leaf.key,
    leaf,
  }));

  const selectedEntries = columnEntries.filter((entry) => entry.leaf.isVisible).map((entry) => entry.id);
  const totalColumns = columnEntries.length;
  const hiddenCount = totalColumns - selectedEntries.length;
  const hasHidden = hiddenCount > 0;

  const handleChange = (_value: string | undefined, values: string[]) => {
    const nextValues = new Set(values);
    columnEntries.forEach((entry) => {
      const shouldBeVisible = nextValues.has(entry.id);
      if (entry.leaf.isVisible !== shouldBeVisible) {
        entry.leaf.toggleVisibility();
      }
    });
  };

  return (
    <Dropdown<string>
      multiple
      showCheckbox
      hideIcon
      variant="compact"
      value={selectedEntries}
      onChange={handleChange}
      isSearchable={columnEntries.length > 6}
      searchPlaceholder="Search columns..."
      display="inline-flex"
    >
      <Dropdown.Display<string>>
        {(selected) => {
          const noneSelected = selected.length === 0;

          return (
            <Flex ai="center" gap={2}>
              {/* Columns icon - vertical bars representing table columns */}
              <BaseSvg viewBox="0 0 20 20" width="18" height="18">
                <rect x="2" y="3" width="4" height="14" rx="1" fill="currentColor" opacity={0.9} />
                <rect x="8" y="3" width="4" height="14" rx="1" fill="currentColor" opacity={0.6} />
                <rect x="14" y="3" width="4" height="14" rx="1" fill="currentColor" opacity={0.3} />
              </BaseSvg>
              {hasHidden && (
                <Box
                  tag="span"
                  fontSize={11}
                  lineHeight={16}
                  fontWeight={500}
                  px={2}
                  py={0.5}
                  borderRadius={1}
                  bgColor={noneSelected ? 'red-100' : 'amber-100'}
                  color={noneSelected ? 'red-700' : 'amber-700'}
                  theme={{
                    dark: {
                      bgColor: noneSelected ? 'red-900' : 'amber-900',
                      color: noneSelected ? 'red-300' : 'amber-300',
                    },
                  }}
                >
                  {selected.length}/{totalColumns}
                </Box>
              )}
            </Flex>
          );
        }}
      </Dropdown.Display>

      <Dropdown.SelectAll>Show All</Dropdown.SelectAll>
      <Dropdown.Unselect>Hide All</Dropdown.Unselect>

      {columnEntries.map((entry) => (
        <Dropdown.Item<string> key={entry.id} value={entry.id} textWrap="nowrap">
          {entry.label}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}

(DataGridTopBarContextMenu as React.FunctionComponent).displayName = 'DataGridTopBarContextMenu';
