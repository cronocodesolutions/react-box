import { describe, expect, it } from 'vitest';
import BoxExtends from './boxExtends';

describe('BoxExtends.components — extends', () => {
  it('should inherit styles from the base component', () => {
    BoxExtends.components({
      testBase: { styles: { bgColor: 'red-500', p: 4 } },
      testChild: { extends: 'testBase', styles: { p: 2 } },
    });

    const child = BoxExtends.componentsStyles['testChild'];
    expect(child.styles).toEqual(expect.objectContaining({ bgColor: 'red-500', p: 2 }));
  });

  it('should inherit children from the base component', () => {
    BoxExtends.components({
      testBase2: {
        styles: { bgColor: 'blue-500' },
        children: {
          header: { styles: { fontSize: 14 } },
          body: { styles: { p: 2 }, children: { cell: { styles: { b: 1 } } } },
        },
      },
      testChild2: {
        extends: 'testBase2',
        styles: { bgColor: 'green-500' },
        children: {
          header: { styles: { fontWeight: 600 } },
        },
      },
    });

    const child = BoxExtends.componentsStyles['testChild2'];
    expect(child.styles?.bgColor).toBe('green-500');
    // header styles are merged
    expect(child.children?.header?.styles).toEqual(expect.objectContaining({ fontSize: 14, fontWeight: 600 }));
    // body is inherited untouched
    expect(child.children?.body?.styles?.p).toBe(2);
    expect(child.children?.body?.children?.cell?.styles?.b).toBe(1);
  });

  it('should inherit variants from the base component', () => {
    BoxExtends.components({
      testBase3: {
        styles: { bgColor: 'white' },
        variants: { active: { bgColor: 'blue-500' }, disabled: { bgColor: 'gray-300' } },
      },
      testChild3: {
        extends: 'testBase3',
        variants: { active: { color: 'white' } },
      },
    });

    const child = BoxExtends.componentsStyles['testChild3'];
    expect(child.variants?.active).toEqual(expect.objectContaining({ bgColor: 'blue-500', color: 'white' }));
    expect(child.variants?.disabled).toEqual(expect.objectContaining({ bgColor: 'gray-300' }));
  });

  it('should not affect components without extends', () => {
    BoxExtends.components({
      testStandalone: { styles: { p: 4 } },
    });

    const standalone = BoxExtends.componentsStyles['testStandalone'];
    expect(standalone.styles).toEqual(expect.objectContaining({ p: 4 }));
    expect(standalone.extends).toBeUndefined();
  });

  it('should handle missing base component gracefully', () => {
    BoxExtends.components({
      testOrphan: { extends: 'nonExistent', styles: { p: 4 } },
    });

    const orphan = BoxExtends.componentsStyles['testOrphan'];
    expect(orphan.styles?.p).toBe(4);
  });

  it('should strip the extends key from the resolved component', () => {
    BoxExtends.components({
      testBase5: { styles: { bgColor: 'red-500' } },
      testChild5: { extends: 'testBase5', styles: { p: 2 } },
    });

    const child = BoxExtends.componentsStyles['testChild5'];
    expect(child.extends).toBeUndefined();
  });

  it('should extend built-in datagrid component', () => {
    BoxExtends.components({
      testSubgrid: {
        extends: 'datagrid',
        styles: { b: 0, borderRadius: 0 },
      },
    });

    const subgrid = BoxExtends.componentsStyles['testSubgrid'];
    // Should have overridden styles
    expect(subgrid.styles?.b).toBe(0);
    expect(subgrid.styles?.borderRadius).toBe(0);
    // Should have inherited children from datagrid
    expect(subgrid.children?.header).toBeDefined();
    expect(subgrid.children?.body).toBeDefined();
    expect(subgrid.children?.header?.children?.cell).toBeDefined();
    expect(subgrid.children?.body?.children?.cell).toBeDefined();
    // Should inherit header cell variants (pinning, sorting, etc.)
    expect(subgrid.children?.header?.children?.cell?.variants?.isPinned).toBeDefined();
    expect(subgrid.children?.header?.children?.cell?.variants?.isSortable).toBeDefined();
  });

  it('should allow clean:true on a child to prevent inheritance for that subtree', () => {
    BoxExtends.components({
      testBase6: {
        styles: { bgColor: 'red-500' },
        children: {
          header: { styles: { fontSize: 14, fontWeight: 600 } },
        },
      },
      testChild6: {
        extends: 'testBase6',
        children: {
          header: { clean: true, styles: { fontSize: 12 } },
        },
      },
    });

    const child = BoxExtends.componentsStyles['testChild6'];
    // clean:true replaces the entire header subtree
    expect(child.children?.header?.styles?.fontSize).toBe(12);
    expect(child.children?.header?.styles?.fontWeight).toBeUndefined();
  });
});
