import { cleanup, render } from '@testing-library/react';
import { HTMLDivElement, HTMLStyleElement } from 'happy-dom';
import { afterEach, describe, expect, it, suite } from 'vitest';
import { ignoreLogs } from '../../dev/tests';
import Box from '../box';
import { BoxStyleProps } from '../types';

const testElementId = 'testElementId';

describe('useStyles', () => {
  ignoreLogs();

  afterEach(cleanup);

  function act(styles: BoxStyleProps) {
    render(
      <Box>
        <Box id={testElementId} {...styles} />
      </Box>,
    );

    const element = document.getElementById(testElementId)!;

    expect(element).not.toBeNull();
    expect(element).toBeInstanceOf(HTMLDivElement);

    const styleElement = document.getElementById('crono-styles')! as unknown as HTMLStyleElement;

    return { element, parent: element.parentElement!, styleElement };
  }

  it('applies margin styles', async () => {
    const { element, styleElement } = act({
      m: 8,
      hover: { m: 5 },
    });

    expect(styleElement.innerText).toContain('.m-8{margin:2rem}');
    expect(styleElement.innerText).toContain('.hover-m-5:hover{margin:1.25rem}');

    expect(element.classList).toContain('m-8');
    expect(element.classList).toContain('hover-m-5');
  });

  it('applies padding and border styles', () => {
    const { element, styleElement } = act({ p: 4, b: 1 });
    expect(styleElement.innerText).toContain('.p-4{padding:1rem}');
    expect(styleElement.innerText).toContain('.b-1{border-width:1px}');
    expect(element.classList).toContain('p-4');
    expect(element.classList).toContain('b-1');
  });

  it('applies hover and focus styles', () => {
    const { element, styleElement } = act({
      hover: { bgColor: 'gray-100' },
      focus: { bgColor: 'gray-200' },
    });
    expect(styleElement.innerText).toContain('.hover-bgColor-gray-100:hover{background-color:var(--gray-100)}');
    expect(styleElement.innerText).toContain('.focus-bgColor-gray-200:focus-within{background-color:var(--gray-200)}');
    expect(element.classList).toContain('hover-bgColor-gray-100');
    expect(element.classList).toContain('focus-bgColor-gray-200');
  });

  it('applies active and disabled styles', () => {
    const { element, styleElement } = act({
      active: { opacity: 0.8 },
      disabled: [true, { opacity: 0.4 }],
    });
    expect(styleElement.innerText).toContain('.active-opacity-0.8:active{opacity:0.8}');
    expect(styleElement.innerText).toContain('.disabled-opacity-0.4[disabled]{opacity:0.4}');
    expect(element.classList).toContain('active-opacity-0.8');
    expect(element.classList).toContain('disabled-opacity-0.4');
  });

  it('applies selected and checked styles', () => {
    const { element, styleElement } = act({
      selected: [true, { borderColor: 'blue-300' }],
      checked: [true, { bgColor: 'green-100' }],
    });
    expect(styleElement.innerText).toContain('.selected-borderColor-blue-300[aria-selected="true"]{border-color:var(--blue-300)}');
    expect(styleElement.innerText).toContain('.checked-bgColor-green-100:checked{background-color:var(--green-100)}');
    expect(element.classList).toContain('selected-borderColor-blue-300');
    expect(element.classList).toContain('checked-bgColor-green-100');
  });

  it('applies required styles', () => {
    const { element, styleElement } = act({
      required: [true, { borderColor: 'red-500' }],
    });
    expect(styleElement.innerText).toContain('.required-borderColor-red-500:required{border-color:var(--red-500)}');
    expect(element.classList).toContain('required-borderColor-red-500');
  });

  it('applies multiple combinations of styles', () => {
    const { element, styleElement } = act({
      m: 2,
      hover: { m: 3 },
      focus: { m: 4 },
      active: { m: 5 },
    });
    expect(styleElement.innerText).toContain('.m-2{margin:0.5rem}');
    expect(styleElement.innerText).toContain('.hover-m-3:hover{margin:0.75rem}');
    expect(styleElement.innerText).toContain('.focus-m-4:focus-within{margin:1rem}');
    expect(styleElement.innerText).toContain('.active-m-5:active{margin:1.25rem}');
    expect(element.classList).toContain('m-2');
    expect(element.classList).toContain('hover-m-3');
    expect(element.classList).toContain('focus-m-4');
    expect(element.classList).toContain('active-m-5');
  });

  suite('when use selectedGroup', () => {
    it('applies selected selector over parent element', () => {
      const { element, styleElement } = act({
        selectedGroup: {
          parent: {
            bgColor: 'blue-100',
            hover: {
              bgColor: 'blue-200',
            },
          },
        },
      });

      expect(styleElement.innerText).toContain(
        '.parent[aria-selected="true"] .selected-parent-bgColor-blue-100{background-color:var(--blue-100)}',
      );
      expect(styleElement.innerText).toContain(
        '.parent:hover[aria-selected="true"] .hover-selected-parent-bgColor-blue-200{background-color:var(--blue-200)}',
      );

      expect(element.classList).toContain('selected-parent-bgColor-blue-100');
      expect(element.classList).toContain('hover-selected-parent-bgColor-blue-200');
    });
  });
});
