import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../dev/a11y/axe';
import { ignoreLogs } from '../../dev/tests';
import { StylesContext } from '../react/useStyles';
import Button from './button';
import VisuallyHidden from './visuallyHidden';

describe('VisuallyHidden', () => {
  ignoreLogs();

  afterEach(() => {
    cleanup();
  });

  const styles = () => {
    StylesContext.flushSync();

    return (document.getElementById(StylesContext.styleElementId()) as unknown as HTMLStyleElement).innerText;
  };

  it('keeps its content in the accessibility tree', () => {
    render(
      <Button>
        <VisuallyHidden tag="span">Delete the invoice</VisuallyHidden>
        <span aria-hidden>🗑</span>
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Delete the invoice');
  });

  it('renders the tag it is given, defaulting to a div', () => {
    const { rerender } = render(<VisuallyHidden id="hidden">Skip to content</VisuallyHidden>);
    expect(document.getElementById('hidden')!.tagName).toBe('DIV');

    rerender(
      <VisuallyHidden tag="span" id="hidden">
        Skip to content
      </VisuallyHidden>,
    );
    expect(document.getElementById('hidden')!.tagName).toBe('SPAN');
  });

  it('clips itself away rather than hiding, which would take it out of the tree', () => {
    render(<VisuallyHidden>Loading</VisuallyHidden>);

    const css = styles();

    expect(css).toContain('clip-path:inset(50%)');
    expect(css).toContain('position:absolute');
    expect(css).toContain('overflow:hidden');
    // One pixel — a zero-sized element is skipped by some screen readers.
    expect(css).toContain('.width-0\\.25{width:0.0625rem}');
    expect(css).toContain('.height-0\\.25{height:0.0625rem}');
    expect(css).toContain('white-space:nowrap');
  });

  it('lets a prop override a default, like any other Box', () => {
    render(<VisuallyHidden id="hidden" position="relative" />);

    expect(document.getElementById('hidden')!.className).toContain('position-relative');
    expect(document.getElementById('hidden')!.className).not.toContain('position-absolute');
  });

  it('has no axe violations', async () => {
    render(
      <Button>
        <VisuallyHidden tag="span">Delete the invoice</VisuallyHidden>
        <span aria-hidden>🗑</span>
      </Button>,
    );

    await expectNoAxeViolations(document.body);
  });
});
