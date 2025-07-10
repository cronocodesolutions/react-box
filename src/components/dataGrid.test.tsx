import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import DataGrid from './dataGrid';
import Box from '../box';
import { DataGridProps, GridDefinition } from './dataGrid/contracts/dataGridContract';
import { ignoreLogs } from '../../dev/tests';

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
}

describe('DataGrid', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  // Sample data for testing
  const sampleData: Person[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      visits: 10,
      status: 'Active',
      progress: 50,
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      age: 25,
      visits: 5,
      status: 'Inactive',
      progress: 30,
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Johnson',
      age: 45,
      visits: 20,
      status: 'Active',
      progress: 80,
    },
  ];

  // Basic grid definition
  const basicGridDef = {
    rowKey: 'id' as keyof Person,
    columns: [
      { key: 'firstName', header: 'First Name' },
      { key: 'lastName', header: 'Last Name' },
      { key: 'age', header: 'Age' },
      { key: 'visits', header: 'Visits' },
      { key: 'status', header: 'Status' },
      { key: 'progress', header: 'Progress' },
    ],
  };

  // Helper function to render the DataGrid with props
  const renderDataGrid = (props: Partial<DataGridProps<Person>> = {}) => {
    const defaultProps: DataGridProps<Person> = {
      data: sampleData,
      def: basicGridDef as GridDefinition<Person>,
      ...props,
    };

    return render(<DataGrid {...defaultProps} />);
  };

  it('renders the name', () => {
    render(<Box>Hello, Maxim!</Box>);

    expect(screen.getByText('Hello, Maxim!')).toBeTruthy();
  });

  it('renders without crashing', () => {
    renderDataGrid();
    // Check if the component renders without throwing
    expect(screen.getByRole('presentation')).toBeTruthy();
  });

  it('renders correct number of rows', () => {
    renderDataGrid();
    // Check if the footer shows the correct number of rows
    expect(screen.getByText(`Rows: ${sampleData.length}`)).toBeTruthy();
  });

  it('renders column headers correctly', () => {
    renderDataGrid();
    // Check if column headers are rendered
    expect(screen.getByText('First Name')).not.toBeNull();
    expect(screen.getByText('First Name')).toBeDefined();
    expect(screen.getByText('Last Name')).toBeTruthy();
    expect(screen.getByText('Age')).toBeTruthy();
    expect(screen.getByText('Visits')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Progress')).toBeTruthy();
  });

  it('renders with empty data', () => {
    renderDataGrid({ data: [] });
    // Check if the footer shows 0 rows
    expect(screen.getByText('Rows: 0')).toBeTruthy();
  });

  it('renders with nested columns', () => {
    const nestedGridDef = {
      rowKey: 'id' as keyof Person,
      columns: [
        {
          key: 'name',
          header: 'Name',
          columns: [
            { key: 'firstName', header: 'First Name' },
            { key: 'lastName', header: 'Last Name' },
          ],
        },
        { key: 'age', header: 'Age' },
        { key: 'visits', header: 'Visits' },
        { key: 'status', header: 'Status' },
        { key: 'progress', header: 'Progress' },
      ],
    };

    renderDataGrid({ def: nestedGridDef });
    // Check if parent and child column headers are rendered
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('First Name')).toBeTruthy();
    expect(screen.getByText('Last Name')).toBeTruthy();
  });

  it('renders with aligned columns', () => {
    const alignedGridDef = {
      rowKey: 'id' as keyof Person,
      columns: [
        { key: 'firstName', header: 'First Name' },
        { key: 'lastName', header: 'Last Name' },
        { key: 'age', header: 'Age', align: 'right' as const },
        { key: 'visits', header: 'Visits', align: 'center' as const },
        { key: 'status', header: 'Status' },
        { key: 'progress', header: 'Progress' },
      ],
    };

    renderDataGrid({ def: alignedGridDef });
    // We can't easily test the alignment visually, but we can check if the component renders
    expect(screen.getByRole('presentation')).toBeTruthy();
  });

  it('renders with custom column widths', () => {
    const widthGridDef = {
      rowKey: 'id' as keyof Person,
      columns: [
        { key: 'firstName', header: 'First Name', width: 150 },
        { key: 'lastName', header: 'Last Name', width: 150 },
        { key: 'age', header: 'Age', width: 80 },
        { key: 'visits', header: 'Visits', width: 100 },
        { key: 'status', header: 'Status', width: 120 },
        { key: 'progress', header: 'Progress', width: 120 },
      ],
    };

    renderDataGrid({ def: widthGridDef });
    // We can't easily test the widths visually, but we can check if the component renders
    expect(screen.getByRole('presentation')).toBeTruthy();
  });

  it('renders with pinned columns', () => {
    const pinnedGridDef = {
      rowKey: 'id' as keyof Person,
      columns: [
        { key: 'firstName', header: 'First Name', pin: 'LEFT' as const },
        { key: 'lastName', header: 'Last Name' },
        { key: 'age', header: 'Age' },
        { key: 'visits', header: 'Visits' },
        { key: 'status', header: 'Status' },
        { key: 'progress', header: 'Progress', pin: 'RIGHT' as const },
      ],
    };

    renderDataGrid({ def: pinnedGridDef });
    // We can't easily test the pinning visually, but we can check if the component renders
    expect(screen.getByRole('presentation')).toBeTruthy();
  });

  // Test for scroll handling would require more complex setup with mocking
  // the DOM elements and their scroll behavior, which is beyond the scope of this test
});
