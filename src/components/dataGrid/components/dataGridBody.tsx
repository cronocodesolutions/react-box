import { useCallback, useMemo, useState } from 'react';
import Box from '../../../box';
import Grid from '../../grid';
import GridModel from '../models/gridModel';
import DataGridHeaderCell from './dataGridHeaderCell';
import FnUtils from '../../../utils/fn/fnUtils';
import { DEFAULT_REM_DIVIDER } from '../../../core/boxConstants';
import GroupRowModel from '../models/groupRowModel';
import DataGridGroupRow from './dataGridGroupRow';
import DataGridRow from './dataGridRow';

const visibleRows = 10;
const rowsOffset = 25;
const take = visibleRows + rowsOffset * 2;

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridBody<TRow>(props: Props<TRow>) {
  const { grid } = props;
  const { isResizeMode } = grid;

  const [scrollTop, setScrollTop] = useState(0);
  const rowsCount = grid.flatRows.value.length;
  const rowHeight = DEFAULT_REM_DIVIDER * grid.ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - rowsOffset);

  const headers = useMemo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render headers');

    return grid.headerRows.value.map((row) => {
      return row.map((cell) => {
        return <DataGridHeaderCell key={cell.uniqueKey} column={cell} />;
      });
    });
  }, [grid.headerRows.value]);

  const rows = useMemo(() => {
    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: DataGrid render rows');

    const rowsToRender = grid.flatRows.value.take(take, startIndex).map((row) => {
      if (row instanceof GroupRowModel) {
        return <DataGridGroupRow key={row.rowKey} row={row} />;
      } else {
        return <DataGridRow key={row.rowKey} row={row} />;
      }
    });

    return rowsToRender;
  }, [grid.flatRows.value, startIndex]);

  const handleScroll = useCallback(
    FnUtils.throttle((event: React.UIEvent) => {
      setScrollTop((event.target as HTMLDivElement).scrollTop);
    }, 100),
    [],
  );

  return (
    <Box overflowX="scroll" props={{ onScroll: handleScroll }}>
      <Grid component="datagrid.header" variant={{ isResizeMode }} style={{ gridTemplateColumns: grid.gridTemplateColumns.value }}>
        {headers}
      </Grid>

      <Box height={grid.ROW_HEIGHT * visibleRows + 4}>
        <Box
          style={{
            height: `${rowsCount * rowHeight}px`,
          }}
        >
          <Grid
            width="max-content"
            minWidth="fit"
            transition="none"
            style={{
              transform: `translateY(${startIndex * rowHeight}px)`,
              gridTemplateColumns: grid.gridTemplateColumns.value,
            }}
          >
            {rows}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

(DataGridBody as React.FunctionComponent).displayName = 'DataGridBody';
