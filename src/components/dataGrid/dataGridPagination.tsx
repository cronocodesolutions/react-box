import Button from '../button';
import Flex from '../flex';
import { GridData } from './useGridData';

interface Props {
  pagination: GridData['pagination'];
}

export default function DataGridPagination(props: Props) {
  const { pagination } = props;

  return (
    <Flex gap={3}>
      <Button clean onClick={() => pagination.changePage(0)}>
        {'<<'}
      </Button>
      <Button clean onClick={() => pagination.changePage(pagination.page - 1)}>
        {'<'}
      </Button>
      {pagination.page + 1} of {pagination.totalPages}
      <Button clean onClick={() => pagination.changePage(pagination.page + 1)}>
        {'>'}
      </Button>
      <Button clean onClick={() => pagination.changePage(pagination.totalPages - 1)}>
        {'>>'}
      </Button>
    </Flex>
  );
}
