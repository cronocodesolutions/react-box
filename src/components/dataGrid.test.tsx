import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ignoreLogs } from '../../dev/tests';
import Box from '../box';
import DataGrid from './dataGrid';
import { DataGridProps, GridDefinition } from './dataGrid/contracts/dataGridContract';

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
  const renderDataGrid = (props?: { gridDef: Partial<GridDefinition<Person>>; data?: Person[] }) => {
    const defaultProps: DataGridProps<Person> = {
      data: props?.data ?? sampleData,
      def: { ...basicGridDef, ...props?.gridDef },
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
    renderDataGrid({ gridDef: { bottomBar: true } });
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
    renderDataGrid({ gridDef: { bottomBar: true }, data: [] });
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

    renderDataGrid({ gridDef: nestedGridDef });
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

    renderDataGrid({ gridDef: alignedGridDef });
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
        { key: 'status', header: 'Status', width: 90 },
        { key: 'progress', header: 'Progress', width: 120 },
      ],
    };

    renderDataGrid({ gridDef: widthGridDef });
    expect(screen.getByRole('presentation')).toBeTruthy();

    [
      ['First Name', 150],
      ['Last Name', 150],
      ['Age', 80],
      ['Visits', 100],
      ['Status', 90],
      ['Progress', 120],
    ].forEach(([title, width]) => {
      const el = screen.getByText(title).closest('[role="columnheader"]')!;
      expect(el).toBeDefined();

      const styles = window.getComputedStyle(el);
      expect(styles.width).toBe(`${width}px`);
    });
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

    renderDataGrid({ gridDef: pinnedGridDef });

    expect(screen.getByRole('presentation')).toBeTruthy();

    const firstNameEl = screen.getByText('First Name').closest('[role="columnheader"]')!;
    expect(firstNameEl).toBeDefined();

    const firstNameStyles = window.getComputedStyle(firstNameEl);
    expect(firstNameStyles.position).toBe('sticky');
    expect(firstNameStyles.left).toBe('0px');
    expect(firstNameStyles.right).toBe('');

    const progressEl = screen.getByText('Progress').closest('[role="columnheader"]')!;
    expect(progressEl).toBeDefined();

    const progressStyles = window.getComputedStyle(progressEl);
    expect(progressStyles.position).toBe('sticky');
    expect(progressStyles.left).toBe('');
    expect(progressStyles.right).toBe('0px');
  });
});
