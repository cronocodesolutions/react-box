import Box from '../../src/box';
import DataGrid from '../../src/components/dataGrid';
import Data from '../data/MOCK_DATA.json';
import Data1 from '../data/MOCK_DATA_1.json';
import Data2 from '../data/MOCK_DATA_2.json';
import Data3 from '../data/MOCK_DATA_3.json';
import Data4 from '../data/MOCK_DATA_4.json';
import Data5 from '../data/MOCK_DATA_5.json';
import Data6 from '../data/MOCK_DATA_6.json';
import Data7 from '../data/MOCK_DATA_7.json';
import usePageContext from '../hooks/usePageContext';
import { H3 } from '../../src/components/semantics';
import Code from '../components/code';

const data = [...Data, ...Data1, ...Data2, ...Data3, ...Data4, ...Data5, ...Data6, ...Data7];

export default function DataGridPage() {
  usePageContext(<RightSidebar />);

  return (
    <Box>
      <Box tag="h1" fontSize={24}>
        DataGrid (⚠️ WIP)
      </Box>

      <Code
        label="Basic"
        mt={10}
        code={`<DataGrid
  data={data}
  def={{
    rowHeight: 40,
    visibleRows: 5,
    columns: [
      { key: 'first_name', header: 'First name' },
      { key: 'last_name', header: 'Last name' },
      { key: 'age', header: 'Age', width: 90 },
      { key: 'email', header: 'Email', width: 300 },
      { key: 'street_address' },
      { key: 'city' },
      { key: 'country' },
      { key: 'favorite_color' },
      { key: 'gender' },
      { key: 'ssn' },
      { key: 'birthdate' },
      { key: 'phone_number' },
      { key: 'username' },
      { key: 'credit_card_number' },
      { key: 'salary' },
      { key: 'company_name' },
      { key: 'language' },
      { key: 'currency_code' },
    ],
  }}
/>`}
      >
        <DataGrid
          data={data}
          def={{
            columns: [
              { key: 'first_name', header: 'First name' },
              { key: 'last_name', header: 'Last name' },
              { key: 'age', header: 'Age', width: 90 },
              { key: 'email', header: 'Email', width: 300 },
              { key: 'street_address' },
              { key: 'city' },
              { key: 'country' },
              { key: 'favorite_color' },
              { key: 'gender' },
              { key: 'ssn' },
              { key: 'birthdate' },
              { key: 'phone_number' },
              { key: 'username' },
              { key: 'credit_card_number' },
              { key: 'salary' },
              { key: 'company_name' },
              { key: 'language' },
              { key: 'currency_code' },
            ],
            rowHeight: 40,
            visibleRows: 5,
          }}
        />
      </Code>

      <Code
        mt={10}
        label="Data grid default styles"
        code={`export const components = Box.components({
  datagrid: {
    styles: {
      b: 1,
      borderColor: 'gray-400',
      overflow: 'hidden',
      borderRadius: 1,
    },
    children: {
      topBar: {
        styles: {
          p: 2,
          bb: 1,
          borderColor: 'gray-400',
          color: 'gray-400',
          gap: 2,
          ai: 'center',
        },
        children: {
          contextMenu: {
            clean: true,
            styles: {
              cursor: 'pointer',
              p: 1,
              hover: { bgColor: 'gray-200', borderRadius: 1 },
            },
            children: {
              tooltip: {
                styles: {
                  bgColor: 'white',
                  width: 56,
                  b: 1,
                  borderColor: 'gray-300',
                  borderRadius: 1,
                  display: 'flex',
                  d: 'column',
                  mt: 4,
                  py: 2,
                  translateX: -1,
                  shadow: 'medium-shadow',
                  overflow: 'auto',
                  maxHeight: 100,
                },
                children: {
                  item: {
                    clean: true,
                    styles: {
                      display: 'flex',
                      gap: 2,
                      p: 3,
                      cursor: 'pointer',
                      hover: { bgColor: 'gray-200' },
                    },
                  },
                },
              },
            },
          },
          columnGroups: {
            styles: {
              gap: 2,
              ai: 'center',
            },
            children: {
              icon: {
                styles: {
                  color: 'violet-950',
                  width: 4,
                },
              },
              separator: {
                styles: {},
              },
              item: {
                styles: {
                  gap: 2,
                  ai: 'center',
                  b: 1,
                  borderColor: 'gray-400',
                  bgColor: 'gray-100',
                  borderRadius: 1,
                  py: 1,
                  pl: 2,
                  pr: 1,
                  color: 'violet-950',
                },
                children: {
                  icon: {
                    styles: {
                      width: 3,
                      color: 'gray-400',
                      cursor: 'pointer',
                    },
                  },
                },
              },
            },
          },
        },
      },
      header: {
        styles: {
          position: 'sticky',
          top: 0,
          width: 'max-content',
          minWidth: 'fit',
          zIndex: 1,
          bgColor: 'gray-200',
        },
        variants: {
          isResizeMode: { userSelect: 'none' },
        },
        children: {
          cell: {
            styles: {
              borderColor: 'gray-400',
              bb: 1,
              position: 'relative',
              transition: 'none',
            },
            variants: {
              isRowNumber: {},
              isRowSelection: {},
              isPinned: { position: 'sticky', zIndex: 2, bgColor: 'gray-200' },
              isFirstLeftPinned: {},
              isLastLeftPinned: { br: 1 },
              isFirstRightPinned: { bl: 1 },
              isLastRightPinned: {},
              isSortable: { cursor: 'pointer' },
            },
            children: {
              contextMenu: {
                clean: true,
                styles: {
                  width: 6,
                  height: 6,
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderRadius: 1,
                  borderColor: 'gray-200',
                  display: 'flex',
                  jc: 'center',
                  ai: 'center',
                  transition: 'none',
                  bgColor: 'gray-200',
                  hover: { bgColor: 'gray-300' },
                },
                children: {
                  icon: {
                    styles: {},
                  },
                  tooltip: {
                    styles: {
                      bgColor: 'white',
                      width: 56,
                      b: 1,
                      borderColor: 'gray-300',
                      borderRadius: 1,
                      display: 'flex',
                      d: 'column',
                      mt: 4,
                      py: 2,
                      overflow: 'hidden',
                      translateX: -5,
                      shadow: 'medium-shadow',
                    },
                    variants: {
                      openLeft: { translateX: -55 },
                    },
                    children: {
                      item: {
                        clean: true,
                        styles: {
                          display: 'flex',
                          gap: 2,
                          p: 3,
                          cursor: 'pointer',
                          hover: { bgColor: 'gray-200' },
                        },
                        children: {
                          icon: {
                            styles: {
                              width: 4,
                              color: 'violet-950',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              resizer: {
                styles: {
                  width: 0.5,
                  height: 'fit',
                  bgColor: 'gray-400',
                  hoverGroup: { resizer: { bgColor: 'gray-600' } },
                },
              },
            },
          },
        },
      },
      cell: {
        styles: {
          bb: 1,
          borderColor: 'gray-400',
          transition: 'none',
          ai: 'center',
          overflow: 'hidden',
          minHeight: 12,
          hoverGroup: { 'grid-row': { bgColor: 'gray-200' } },
        },
        variants: {
          isRowNumber: { bgColor: 'gray-200' },
          isRowSelection: {},
          isPinned: { position: 'sticky', bgColor: 'gray-100', zIndex: 1 },
          isFirstLeftPinned: {},
          isLastLeftPinned: { br: 1 },
          isFirstRightPinned: { bl: 1 },
          isLastRightPinned: {},
        },
      },
      bottomBar: {
        styles: {
          p: 3,
          bgColor: 'gray-200',
          bt: 1,
          borderColor: 'gray-400',
          gap: 4,
        },
      },
    },
  },
});`}
      >
        <DataGrid
          data={data}
          def={{
            columns: [
              {
                key: 'person',
                header: 'Person',
                columns: [
                  { key: 'first_name', header: 'First name' },
                  { key: 'last_name', header: 'Last name' },
                ],
              },
              {
                key: 'person2',
                header: 'Person 2',
                columns: [
                  { key: 'age', header: 'Age', width: 120 },
                  { key: 'email', header: 'Email', width: 300 },
                ],
              },
              {
                key: 'test',
                header: 'Test',
                columns: [
                  { key: 'test_single', columns: [{ key: 'job_title' }] },
                  { key: 'test_double', header: 'Test double', columns: [{ key: 'street_address' }, { key: 'city' }] },
                ],
              },
              { key: 'country' },
              { key: 'favorite_color' },
              { key: 'gender' },
              { key: 'ssn' },
              { key: 'birthdate' },
              { key: 'phone_number' },
              { key: 'username' },
              { key: 'credit_card_number' },
              { key: 'salary' },
              { key: 'company_name' },
              { key: 'language' },
              { key: 'currency_code' },
            ],
            rowSelection: { pinned: true },
            showRowNumber: { pinned: true },
          }}
        />
      </Code>
    </Box>
  );
}

function RightSidebar() {
  return (
    <Box pt={10}>
      <H3 mb={2}>Columns</H3>
      <Box pl={4}>
        <Box>Column definition</Box>
        <Box>Column definition</Box>
        <Box>Column definition</Box>
      </Box>
    </Box>
  );
}
