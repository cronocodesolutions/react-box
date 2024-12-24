import Button from '../button';
import Flex from '../flex';
import { GridData } from './useGridData';

interface Props {
  grid: GridData;
}

export default function DataGridPagination(props: Props) {
  const { grid } = props;

  return (
    <Flex gap={3}>
      <Button clean onClick={() => grid.changePage(0)}>
        {'<<'}
      </Button>
      <Button clean onClick={() => grid.changePage(grid.pagination.page - 1)}>
        {'<'}
      </Button>
      {grid.pagination.page + 1} of {grid.pagination.totalPages}
      <Button clean onClick={() => grid.changePage(grid.pagination.page + 1)}>
        {'>'}
      </Button>
      <Button clean onClick={() => grid.changePage(grid.pagination.totalPages - 1)}>
        {'>>'}
      </Button>
    </Flex>
  );
}
