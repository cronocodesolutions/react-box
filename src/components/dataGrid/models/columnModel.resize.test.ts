import { afterEach, describe, expect, it } from 'vitest';
import { ignoreLogs } from '../../../../dev/tests';
import ArrayUtils from '../../../utils/array/arrayUtils';
import { GridDefinition } from '../contracts/dataGridContract';
import GridModel from './gridModel';

interface Person {
  firstName: string;
  lastName: string;
}

const data: Person[] = [{ firstName: 'A', lastName: 'X' }];

function getGrid(def: GridDefinition<Person>) {
  return new GridModel<Person>({ data, def });
}

describe('ColumnModel resize (headless)', () => {
  ignoreLogs();

  afterEach(() => {
    document.body.innerHTML = '';
  });

  /**
   * The grid reads its direction off the element the widths are written to. A `dir` attribute is not
   * enough here — the test environment resolves none — so the style says it instead.
   */
  function rtlSizingElement(grid: GridModel<Person>) {
    document.body.innerHTML = '<div style="direction: rtl"></div>';
    grid.setSizingElement(document.body.firstElementChild as HTMLElement);
  }

  describe('in a right-to-left grid', () => {
    it('widens a column as the pointer drags *left*, because that is where its inline end is', () => {
      const grid = getGrid({ columns: [{ key: 'firstName', width: 200 }] });
      rtlSizingElement(grid);
      const col = ArrayUtils.findOrThrow(grid.columns.value.leafs, (c) => c.key === 'firstName');

      col.beginResize(100);
      col.resizeTo(40); // 60px to the left

      expect(col.inlineWidth).toBe(260);
    });

    it('resizes an end-pinned column the way an unpinned one goes, both flips having cancelled', () => {
      const grid = getGrid({ columns: [{ key: 'firstName', width: 200, pin: 'END' }] });
      rtlSizingElement(grid);
      const col = ArrayUtils.findOrThrow(grid.columns.value.leafs, (c) => c.key === 'firstName');

      col.beginResize(100);
      col.resizeTo(160); // +60px, and an end-pinned column in a right-to-left grid grows with it

      expect(col.inlineWidth).toBe(260);
    });

    it('lands on an exact width from either direction', () => {
      const grid = getGrid({ columns: [{ key: 'firstName', width: 200 }] });
      rtlSizingElement(grid);
      const col = ArrayUtils.findOrThrow(grid.columns.value.leafs, (c) => c.key === 'firstName');

      col.resizeWidthTo(320);

      expect(col.inlineWidth).toBe(320);
    });
  });

  it('widens a column as the pointer drags right', () => {
    const grid = getGrid({ columns: [{ key: 'firstName', width: 200 }] });
    const col = ArrayUtils.findOrThrow(grid.columns.value.leafs, (c) => c.key === 'firstName');

    col.beginResize(100);
    col.resizeTo(160); // +60px

    expect(col.inlineWidth).toBe(260);
  });

  it('narrows a column as the pointer drags left, clamped to MIN_COLUMN_WIDTH_PX', () => {
    const grid = getGrid({ columns: [{ key: 'firstName', width: 200 }] });
    const col = ArrayUtils.findOrThrow(grid.columns.value.leafs, (c) => c.key === 'firstName');

    col.beginResize(100);
    col.resizeTo(-1000); // far past the minimum

    expect(col.inlineWidth).toBe(grid.MIN_COLUMN_WIDTH_PX);
  });

  it('inverts drag direction for RIGHT-pinned columns', () => {
    const grid = getGrid({ columns: [{ key: 'firstName', width: 200, pin: 'END' }] });
    const col = ArrayUtils.findOrThrow(grid.columns.value.leafs, (c) => c.key === 'firstName');

    col.beginResize(100);
    col.resizeTo(160); // pointer moves right → right-pinned column shrinks

    expect(col.inlineWidth).toBe(140);
  });

  it('notifies subscribers on each resizeTo and on endResize', () => {
    const grid = getGrid({ columns: [{ key: 'firstName', width: 200 }] });
    const col = ArrayUtils.findOrThrow(grid.columns.value.leafs, (c) => c.key === 'firstName');

    const before = grid.getSnapshot();
    col.beginResize(100);
    col.resizeTo(120);
    col.resizeTo(140);
    col.endResize();

    expect(grid.getSnapshot()).toBe(before + 3);
  });

  /**
   * The keyboard's half of the same model. A drag is a gesture with a beginning and an end; a key
   * press is a whole one on its own, so each call starts from the widths as they are.
   */
  describe('by keyboard', () => {
    it('accumulates one press onto the next', () => {
      const grid = getGrid({ columns: [{ key: 'firstName', width: 200 }] });
      const col = ArrayUtils.findOrThrow(grid.columns.value.leafs, (c) => c.key === 'firstName');

      col.moveResizer(16);
      col.moveResizer(16);

      expect(col.inlineWidth).toBe(232);
    });

    it('moves the separator, so rightwards narrows a RIGHT-pinned column', () => {
      const grid = getGrid({ columns: [{ key: 'firstName', width: 200, pin: 'END' }] });
      const col = ArrayUtils.findOrThrow(grid.columns.value.leafs, (c) => c.key === 'firstName');

      col.moveResizer(16);

      expect(col.inlineWidth).toBe(184);
    });

    it('lands on an exact width from either side, pinned or not', () => {
      const grid = getGrid({
        columns: [
          { key: 'firstName', width: 200 },
          { key: 'lastName', width: 200, pin: 'END' },
        ],
      });
      const [first, last] = ['firstName', 'lastName'].map((key) => ArrayUtils.findOrThrow(grid.columns.value.leafs, (c) => c.key === key));

      first.resizeWidthTo(320);
      last.resizeWidthTo(64);

      expect(first.inlineWidth).toBe(320);
      expect(last.inlineWidth).toBe(64);
    });

    it('spreads an exact width across the leafs a grouped header covers', () => {
      const grid = getGrid({
        columns: [
          {
            key: 'name',
            columns: [
              { key: 'firstName', width: 200 },
              { key: 'lastName', width: 100 },
            ],
          },
        ],
      });
      const group = ArrayUtils.findOrThrow(grid.columns.value.flat, (c) => c.key === 'name');

      group.resizeWidthTo(150);

      // Shared out in proportion to the room each leaf has above the minimum, as a drag does.
      expect(group.leafs.map((c) => c.inlineWidth)).toEqual([88, 62]);
      expect(group.inlineWidth).toBe(150);
    });
  });
});
