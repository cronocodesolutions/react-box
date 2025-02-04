import { useEffect, useMemo, useState } from 'react';
import Box from '../../box';
import useVisibility from '../../hooks/useVisibility';
import Button from '../button';
import Flex from '../flex';
import Tooltip from '../tooltip';
import { EMPTY_CELL_KEY, GridData } from './useGridData2';
import { GridCell2, GridRow2 } from './dataGridContract';
import BaseSvg from '../baseSvg';
import ArrowSvg from '../../../pages/svgs/arrowSvg';
import Column from './models/column';
import Textbox from '../textbox';
import Row from './models/row';

interface Props<TRow> {
  row: Row<TRow>;
  column: Column<TRow>;
}

export default function DataGridCell<TRow>(props: Props<TRow>) {
  const { column, row } = props;

  const isEmptyCell = column.key === EMPTY_CELL_KEY;
  const value = isEmptyCell ? null : (row.row[column.key as keyof TRow] as string);

  return (
    <Flex
      hoverParent={{ 'grid-row': { bgColor: 'gray-200' } }}
      textOverflow="ellipsis"
      overflow="hidden"
      textWrap="nowrap"
      width={40}
      height={12}
      px={2}
      ai="center"
      bb={1}
    >
      {value}
    </Flex>
  );
}
