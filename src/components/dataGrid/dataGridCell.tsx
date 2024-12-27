import { useEffect, useMemo, useState } from 'react';
import Box from '../../box';
import useVisibility from '../../hooks/useVisibility';
import Button from '../button';
import Flex from '../flex';
import Tooltip from '../tooltip';
import { EMPTY_CELL_KEY, GridData } from './useGridData';
import { GridCell, GridRow } from './dataGridContract';
import BaseSvg from '../baseSvg';
import ArrowSvg from '../../../pages/svgs/arrowSvg';

interface Props<TRow> {
  grid: GridData<TRow>;
  row: GridRow;
  cell: GridCell;
}

export default function DataGridCell<TRow>(props: Props<TRow>) {
  const { grid, row, cell } = props;
  const isEmptyCell = cell.key === EMPTY_CELL_KEY;
  const isPinned = !!cell.pinned;
  const isSticky = cell.isHeader || isPinned;

  const [isOpen, setOpen, refToUse] = useVisibility<HTMLButtonElement>({ hideOnScroll: true });
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const openLeft = useMemo(() => tooltipPosition.left > window.innerWidth / 2, [tooltipPosition.left]);

  return (
    <Flex
      zIndex={cell.isHeader && isPinned ? 2 : isSticky ? 1 : undefined}
      position={isSticky ? 'sticky' : undefined}
      top={cell.isHeader ? cell.top : undefined}
      bgColor={cell.isHeader ? 'slate-300' : 'white'}
      height={cell.height}
      bb={1}
      hoverParent={{ 'grid-row': { bgColor: cell.isHeader ? undefined : 'gray-200' } }}
      jc="space-between"
      ai="center"
      transition="none"
      colSpan={cell.colSpan}
      gridRow={cell.rowSpan}
      style={{ left: cell.left, right: cell.right, width: `var(--${cell.key}-${cell.pinned ?? ''}-width)` }}
      br={cell.pinned === 'LEFT' && cell.edge ? 1 : 0}
      bl={cell.pinned === 'RIGHT' && cell.edge ? 1 : 0}
    >
      {!isEmptyCell && (
        <>
          {cell.isHeader && cell.pinned === 'RIGHT' && (
            <Box cursor="col-resize" px={0.25} className="resizer" props={{ onMouseDown: cell.resizeColumn }}>
              <Box width={0.5} height={4} bgColor="gray-400" hoverParent={{ resizer: { bgColor: 'gray-600' } }}></Box>
            </Box>
          )}
          <Flex
            position={(cell.colSpan ?? 0) > 1 ? 'sticky' : undefined}
            left={(cell.colSpan ?? 0) > 1 ? 0 : undefined}
            overflow="hidden"
            props={{ onClick: cell.sortColumn }}
            flex1
            height="fit"
            ai="center"
            cursor={cell.isHeader ? 'pointer' : undefined}
          >
            {cell.isExpandableCell && (
              <Button
                inline
                clean
                onClick={() => grid.toggleExpandRow(row.key, cell.key)}
                p={2}
                cursor="pointer"
                pl={2 + (cell.expandableCellLevel ?? 0) * 5}
              >
                <ArrowSvg width="12" rotate={cell.isExpanded ? 0 : -90} />
              </Button>
            )}
            <Box overflow="hidden" textOverflow="ellipsis" textWrap="nowrap" pl={cell.isExpandableCell ? 0 : 2}>
              {cell.value as string} {row.isGrouped && cell.isExpandableCell ? `(${row.count})` : ''}
            </Box>
            {cell.sortDirection && (
              <Box ml={2}>
                <BaseSvg viewBox="0 0 512 512" width="16" fill="currentColor" rotate={cell.sortDirection === 'ASC' ? 0 : 180}>
                  <path d="m156.092 156.092 76.636-76.634v409.27C232.727 501.58 243.147 512 256 512c12.853 0 23.273-10.42 23.273-23.273V79.458l76.636 76.634a23.188 23.188 0 0 0 16.455 6.817 23.186 23.186 0 0 0 16.455-6.817c9.089-9.089 9.089-23.824 0-32.912L272.46 6.82a23.46 23.46 0 0 0-1.713-1.547c-.261-.216-.538-.402-.807-.604-.34-.254-.67-.515-1.021-.751-.327-.219-.667-.408-1.001-.608-.316-.189-.625-.388-.953-.562-.343-.183-.694-.338-1.046-.504-.338-.16-.67-.329-1.016-.472-.341-.141-.689-.256-1.035-.379-.369-.133-.737-.276-1.116-.389-.346-.104-.694-.18-1.043-.268-.388-.098-.771-.206-1.167-.285-.399-.079-.802-.126-1.202-.183-.349-.051-.694-.116-1.049-.152a23.262 23.262 0 0 0-2.225-.112C256.045.003 256.025 0 256 0s-.045.003-.07.003c-.743.002-1.485.039-2.225.112-.354.036-.7.101-1.049.152-.402.057-.805.104-1.202.183-.396.078-.779.186-1.167.285-.349.088-.697.163-1.043.268-.379.115-.745.256-1.116.389-.346.124-.694.237-1.035.379-.348.143-.68.312-1.016.472-.352.164-.703.321-1.046.504-.327.174-.636.372-.953.562-.335.2-.675.389-1.001.608-.352.236-.681.496-1.021.751-.268.202-.546.388-.807.604a23.929 23.929 0 0 0-1.713 1.547L123.181 123.181c-9.089 9.089-9.089 23.824 0 32.912 9.087 9.087 23.824 9.087 32.911-.001z" />
                </BaseSvg>
              </Box>
            )}
          </Flex>
          <Flex pl={2} gap={2}>
            {cell.isHeader && (
              <Button
                clean
                onClick={() => setOpen(!isOpen)}
                ref={refToUse}
                width={5}
                height={5}
                cursor="pointer"
                userSelect="none"
                borderRadius={1}
                borderColor="gray-200"
                display="flex"
                jc="center"
                ai="center"
              >
                <BaseSvg viewBox="0 0 16 16" width="18">
                  <path
                    fill="#1D1D1D"
                    strokeWidth={4}
                    d="M7.936 12.128a.936.936 0 1 1 0 1.872.936.936 0 0 1 0-1.872ZM7.936 7.052a.936.936 0 1 1 0 1.873.936.936 0 0 1 0-1.873ZM7.936 1.977a.936.936 0 1 1 0 1.872.936.936 0 0 1 0-1.872Z"
                  />
                </BaseSvg>
                {isOpen && (
                  <Tooltip
                    bgColor="white"
                    width={40}
                    b={1}
                    borderRadius={1}
                    display="flex"
                    d="column"
                    mt={6}
                    overflow="hidden"
                    translateX={openLeft ? -39 : -4}
                    onPositionChange={setTooltipPosition}
                  >
                    <Button clean height={10} textAlign="left" px={3} hover={{ bgColor: 'gray-200' }} onClick={() => cell.pinColumn?.()}>
                      Unpin
                    </Button>
                    <Button
                      clean
                      height={10}
                      textAlign="left"
                      px={3}
                      hover={{ bgColor: 'gray-200' }}
                      onClick={() => cell.pinColumn?.('LEFT')}
                    >
                      Pin Left
                    </Button>
                    <Button
                      clean
                      height={10}
                      textAlign="left"
                      px={3}
                      hover={{ bgColor: 'gray-200' }}
                      onClick={() => cell.pinColumn?.('RIGHT')}
                    >
                      Pin Right
                    </Button>
                    <Button clean height={10} textAlign="left" px={3} hover={{ bgColor: 'gray-200' }} onClick={cell.toggleGroupColumn}>
                      Group by: {cell.key}
                    </Button>
                  </Tooltip>
                )}
              </Button>
            )}
            {cell.isHeader && cell.pinned !== 'RIGHT' && (
              <Box cursor="col-resize" px={0.25} className="resizer" props={{ onMouseDown: cell.resizeColumn }}>
                <Box width={0.5} height="fit" bgColor="gray-400" hoverParent={{ resizer: { bgColor: 'gray-600' } }}></Box>
              </Box>
            )}
          </Flex>
        </>
      )}
    </Flex>
  );
}
