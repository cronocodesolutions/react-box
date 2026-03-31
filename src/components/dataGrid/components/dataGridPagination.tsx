import { useCallback } from 'react';
import Box from '../../../box';
import BaseSvg from '../../baseSvg';
import Button from '../../button';
import Flex from '../../flex';
import GridModel from '../models/gridModel';

interface Props<TRow> {
  grid: GridModel<TRow>;
}

export default function DataGridPagination<TRow>(props: Props<TRow>) {
  const { grid } = props;
  const state = grid.paginationState;

  const page = state?.page ?? 1;
  const totalPages = state?.totalPages ?? 1;
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const goFirst = useCallback(() => !isFirst && grid.changePage(1), [grid, isFirst]);
  const goPrev = useCallback(() => !isFirst && grid.changePage(page - 1), [grid, page, isFirst]);
  const goNext = useCallback(() => !isLast && grid.changePage(page + 1), [grid, page, isLast]);
  const goLast = useCallback(() => !isLast && grid.changePage(totalPages), [grid, totalPages, isLast]);

  if (!state) return null;

  return (
    <Flex component={`${grid.componentName}.bottomBar.pagination` as never} gap={0.5} ai="center">
      <PaginationButton componentName={grid.componentName} onClick={goFirst} disabled={isFirst}>
        <ChevronDoubleLeft />
      </PaginationButton>
      <PaginationButton componentName={grid.componentName} onClick={goPrev} disabled={isFirst}>
        <ChevronLeft />
      </PaginationButton>
      <Box component={`${grid.componentName}.bottomBar.pagination.info` as never} fontSize={12} px={3} userSelect="none">
        {page} of {totalPages}
      </Box>
      <PaginationButton componentName={grid.componentName} onClick={goNext} disabled={isLast}>
        <ChevronRight />
      </PaginationButton>
      <PaginationButton componentName={grid.componentName} onClick={goLast} disabled={isLast}>
        <ChevronDoubleRight />
      </PaginationButton>
    </Flex>
  );
}

(DataGridPagination as React.FunctionComponent).displayName = 'DataGridPagination';

function PaginationButton(props: { componentName: string; onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  const { componentName, onClick, disabled, children } = props;

  return (
    <Button
      component={`${componentName}.bottomBar.pagination.button` as never}
      clean
      onClick={onClick}
      cursor={disabled ? 'default' : 'pointer'}
      p={1}
      borderRadius={4}
      opacity={disabled ? 0.3 : 0.7}
      hover={disabled ? undefined : { opacity: 1, bgColor: 'gray-100' }}
      theme={{ dark: { hover: disabled ? undefined : { bgColor: 'gray-700' } } }}
      transitionDuration={150}
    >
      {children}
    </Button>
  );
}

function ChevronLeft() {
  return (
    <BaseSvg viewBox="0 0 24 24" width="14" height="14">
      <Box
        tag="path"
        props={{ d: 'M15 18l-6-6 6-6', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }}
      />
    </BaseSvg>
  );
}

function ChevronRight() {
  return (
    <BaseSvg viewBox="0 0 24 24" width="14" height="14">
      <Box
        tag="path"
        props={{ d: 'M9 18l6-6-6-6', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }}
      />
    </BaseSvg>
  );
}

function ChevronDoubleLeft() {
  return (
    <BaseSvg viewBox="0 0 24 24" width="14" height="14">
      <Box
        tag="path"
        props={{
          d: 'M18 18l-6-6 6-6M11 18l-6-6 6-6',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      />
    </BaseSvg>
  );
}

function ChevronDoubleRight() {
  return (
    <BaseSvg viewBox="0 0 24 24" width="14" height="14">
      <Box
        tag="path"
        props={{
          d: 'M6 18l6-6-6-6M13 18l6-6-6-6',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      />
    </BaseSvg>
  );
}
