import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Box from './box';
import Flex from './components/flex';
import { DEFAULT_STYLE_ELEMENT_ID } from './core/engine/styleEngine';
import { StylesContext } from './core/useStyles';

/**
 * The server and the client run the same engine but write through different sinks: the server
 * builds a CSS string, the browser inserts into a stylesheet. If the two ever diverge, an app gets
 * styles at first paint that the client then contradicts — invisible in any test that only renders
 * one of the two. Each case below renders the same tree through both paths and compares.
 */
function splitRules(css: string): string[] {
  const rules: string[] = [];
  let depth = 0;
  let current = '';

  for (const char of css) {
    if (char === '\n' && depth === 0) continue;
    current += char;

    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) {
        rules.push(current);
        current = '';
      }
    }
  }

  return rules;
}

// `ssg` installs its own minimal document as an import-time side effect, so it only happens once
// per module registry. Later renders have to put that document back themselves.
let ssgDocument: Document | undefined;

/** Render through `ssg`, with its document swapped in, then hand the real one back. */
async function renderOnServer(element: React.ReactElement) {
  const realDocument = globalThis.document;

  try {
    const { renderToStaticMarkup } = await import('./ssg');
    ssgDocument ??= globalThis.document;
    globalThis.document = ssgDocument;

    return renderToStaticMarkup(element, false);
  } finally {
    globalThis.document = realDocument;
  }
}

function renderOnClient(element: React.ReactElement) {
  const { container } = render(element);
  const styleElement = document.getElementById(DEFAULT_STYLE_ELEMENT_ID);

  return { html: container.innerHTML, styles: styleElement?.textContent ?? '' };
}

async function roundTrip(element: React.ReactElement) {
  const server = await renderOnServer(element);
  // `renderToStaticMarkup` clears the engine when it is done, so the client render starts from the
  // same blank slate a browser would.
  const client = renderOnClient(element);

  return { server, client };
}

describe('SSR round-trip', () => {
  afterEach(() => {
    StylesContext.clear();
    const styleElement = document.getElementById(DEFAULT_STYLE_ELEMENT_ID);
    if (styleElement) styleElement.textContent = '';
  });

  it('produces the same markup and the same CSS for a simple tree', async () => {
    const { server, client } = await roundTrip(
      <Box p={4} bgColor="red-500">
        hello
      </Box>,
    );

    expect(client.html).toBe(server.html);
    expect(splitRules(client.styles)).toEqual(splitRules(server.styles));
  });

  it('agrees on breakpoints, pseudo classes and groups', async () => {
    const { server, client } = await roundTrip(
      <Flex className="parent" d="column" gap={2} hover={{ bgColor: 'blue-500' }} sm={{ gap: 4 }}>
        <Box hoverGroup={{ parent: { display: 'grid' } }} focus={{ b: 1 }}>
          child
        </Box>
      </Flex>,
    );

    expect(client.html).toBe(server.html);
    expect(splitRules(client.styles)).toEqual(splitRules(server.styles));
    expect(client.styles).toContain('@media(min-width: 640px)');
    expect(client.styles).toContain('.parent:hover .hover-parent-display-grid{display:grid}');
  });

  it('agrees on theme-scoped rules', async () => {
    const { server, client } = await roundTrip(
      <Box theme={{ dark: { bgColor: 'gray-900', hover: { bgColor: 'gray-800' } } }} bgColor="white">
        themed
      </Box>,
    );

    expect(client.html).toBe(server.html);
    expect(splitRules(client.styles)).toEqual(splitRules(server.styles));
    expect(client.styles).toContain('.dark .theme-dark-bgColor-gray-900{background-color:var(--gray-900)}');
  });

  it('declares the same :root variables on both sides', async () => {
    const { server, client } = await roundTrip(
      <Box color="violet-500" bgColor="violet-50" shadow="medium">
        tokens
      </Box>,
    );

    const rootBlocks = (css: string) => splitRules(css).filter((rule) => rule.startsWith(':root{'));

    expect(rootBlocks(client.styles)).toEqual(rootBlocks(server.styles));
    expect(client.styles).toContain('--violet-500:');
    expect(client.styles).toContain('--medium:');
  });

  it('does not carry rules from one server render into the next', async () => {
    const first = await renderOnServer(<Box p={4}>first</Box>);
    const second = await renderOnServer(<Box m={4}>second</Box>);

    expect(first.styles).toContain('.p-4{padding:1rem}');
    expect(second.styles).toContain('.m-4{margin:1rem}');
    expect(second.styles).not.toContain('.p-4{');
  });
});
