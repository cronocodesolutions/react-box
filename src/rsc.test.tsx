import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Box from './box';
import RscBox from './rsc';

/**
 * The `react-server` entry. Its contract is what it does *not* do: no hook, no effect, no DOM. The
 * CI check `npm run check:boundaries` proves that for the whole module graph; these tests prove the
 * consequence — that the component renders, and carries its CSS, with nothing but React.
 */
describe('Box for Server Components', () => {
  it('renders when called as a plain function, so it uses no hooks', () => {
    // A component that touched a hook would throw here: there is no renderer, so there is no
    // dispatcher. This is the same shape a Server Component render has for anything client-only.
    const element = RscBox({ p: 4 }) as React.ReactElement;

    expect(React.isValidElement(element)).toBe(true);
  });

  it('server-renders its CSS along with its markup, with no configuration', () => {
    const html = renderToStaticMarkup(<RscBox p={4} tag="section" />);

    expect(html).toContain('<section class="_b p-4"></section>');
    expect(html).toContain('.p-4{padding:1rem}');
    expect(html).toContain('data-precedence="rb-base"');
  });

  it('lets React hoist the CSS into the head of a document', () => {
    const html = renderToStaticMarkup(
      <html>
        <head />
        <body>
          <RscBox m={2} />
        </body>
      </html>,
    );

    expect(html.slice(html.indexOf('<head>'), html.indexOf('</head>'))).toContain('.m-2{margin:0.5rem}');
  });

  it('resolves the same classes as the client Box', () => {
    // Both entries talk to the same engine, so a client component and a server component that
    // share props share their class names — and, in element mode, their `<style>` elements.
    const server = renderToStaticMarkup(<RscBox b={2} />);
    const client = renderToStaticMarkup(<Box b={2} />);

    expect(server).toContain('class="_b b-2"');
    expect(client).toContain('class="_b b-2"');
  });

  it('says so instead of silently dropping hover-callback children', () => {
    expect(() => renderToStaticMarkup(<RscBox>{() => 'hovered'}</RscBox>)).toThrow(/needs the client Box/);
  });

  it('keeps the extension API', () => {
    expect(RscBox.getVariableValue('red-500')).toBe('var(--red-500)');
    expect(typeof RscBox.extend).toBe('function');
    expect(typeof RscBox.components).toBe('function');
    expect(typeof RscBox.configure).toBe('function');
  });
});
