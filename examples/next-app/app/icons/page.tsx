import Flex from '@cronocode/react-box/components/flex';
import Icon from '@cronocode/react-box/components/icon';
import { H2, Link, P, Span } from '@cronocode/react-box/components/semantics';
import RuntimeIcon from './runtimeIcon';

/**
 * The two ways an icon somebody else drew reaches this page, and what each costs on a server.
 *
 * `Icon` styles an element it did not render, by putting the engine's class on it — so whether the
 * icon *exists* during the server render is entirely the icon source's business, not the library's.
 * The two cards below are the same `<Icon>` over two different sources:
 *
 *   - an `<svg>` written out here (or pasted from a design tool) is markup, so it renders on the
 *     server like any other element and needs no dependency and no bundler plugin;
 *   - `@iconify/react` looks its icon up at *runtime*, over the network, in the browser — so it is
 *     a client boundary and the server sends no icon at all. `smoke.mjs` asserts exactly that.
 *
 * The recipe missing from this page is the build-time one — `unplugin-icons`, which turns
 * `~icons/<set>/<name>` into a component while bundling. It is the one to reach for, and it cannot
 * run here: Next 16 builds with Turbopack, which runs no unplugin (the `webpack()` hook in
 * `next.config.mjs` never fires), so `~icons/...` fails to resolve. `next build --webpack` does
 * work — verified, and the icon lands in the prerendered HTML — but pinning this example to the
 * bundler Next is moving away from would cost more than the recipe is worth here. The docs site is
 * a Vite app and runs that recipe for real.
 */
export default function IconsPage() {
  return (
    <Flex d="column" gap={8} maxWidth={240} mx="auto">
      <Flex d="column" gap={4} p={6} borderRadius={3} b={1} borderColor="slate-200" theme={{ dark: { borderColor: 'slate-800' } }}>
        <H2 fontSize={18} fontWeight={600}>
          An inline icon renders on the server
        </H2>
        <P color="slate-600" theme={{ dark: { color: 'slate-400' } }}>
          The <Span fontWeight={600}>&lt;svg&gt;</Span> below is written into this file, so it is in the HTML the server sent — with the
          class <Span fontWeight={600}>&lt;Icon&gt;</Span> generated for the size and the colour, and no JavaScript behind it.
        </P>
        <Icon size={10} color="sky-600" theme={{ dark: { color: 'sky-400' } }} label="A rocket">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        </Icon>
      </Flex>

      <Flex d="column" gap={4} p={6} borderRadius={3} b={1} borderColor="slate-200" theme={{ dark: { borderColor: 'slate-800' } }}>
        <H2 fontSize={18} fontWeight={600}>
          A runtime icon does not
        </H2>
        <P color="slate-600" theme={{ dark: { color: 'slate-400' } }}>
          <Span fontWeight={600}>@iconify/react</Span> fetches the icon it was named from the Iconify API in the browser. View source and
          there is no icon here — only an empty placeholder — and the styling class arrives with it, once it loads.
        </P>
        <RuntimeIcon />
      </Flex>

      <Link props={{ href: '/' }} fontSize={14} color="sky-600" theme={{ dark: { color: 'sky-400' } }}>
        ← Back to the Box page
      </Link>
    </Flex>
  );
}
