import Box from '@cronocode/react-box';
import Button from '@cronocode/react-box/components/button';
import Checkbox from '@cronocode/react-box/components/checkbox';
import Flex from '@cronocode/react-box/components/flex';
import Grid from '@cronocode/react-box/components/grid';
import { H2, Label, Link, P, Span } from '@cronocode/react-box/components/semantics';
import Textbox from '@cronocode/react-box/components/textbox';

/**
 * The pre-built components, imported straight into a Server Component.
 *
 * There is no `'use client'` in this file. `Flex`, `Grid`, `Button`, `Textbox` and the semantic
 * tags are hook-free wrappers around Box, and their published chunks import the package by its own
 * name rather than by a relative path — so the `react-server` condition applies to them too and
 * they resolve the same hook-free Box this page does. They render on the server, with their CSS in
 * the HTML and no JavaScript behind them.
 *
 * `Checkbox` is the other case. It holds a ref and runs an effect (for the indeterminate state), so
 * it cannot render on a server. Its chunk ships a `'use client'` banner, which is what lets a
 * Server Component import it at all: the bundler opens a client boundary around it instead of
 * compiling `useRef` into the server graph. Its markup is server-rendered like any client
 * component's, but its *rules* arrive with the client bundle — element mode is a client-bundle
 * setting, and only the app can make it (see `elementMode.ts`).
 */
export default function ComponentsPage() {
  return (
    <Flex d="column" gap={8} maxWidth={240} mx="auto">
      <Box p={6} borderRadius={3} b={1} borderColor="slate-200" theme={{ dark: { borderColor: 'slate-800' } }}>
        <H2 fontSize={18} fontWeight={600}>
          Server-rendered components
        </H2>
        <P mt={3} color="slate-600" theme={{ dark: { color: 'slate-400' } }}>
          Every element below came from <Span fontWeight={600}>@cronocode/react-box/components/*</Span>, imported by a Server Component.
          None of them is a client boundary.
        </P>

        <Grid gridTemplateColumns={1} gap={4} mt={5} md={{ gridTemplateColumns: 2 }}>
          <Flex d="column" gap={2}>
            <Label fontSize={13} fontWeight={600} color="slate-500">
              Textbox
            </Label>
            <Textbox
              name="email"
              type="email"
              placeholder="you@example.com"
              px={3}
              py={2}
              b={1}
              borderRadius={2}
              borderColor="slate-300"
              theme={{ dark: { borderColor: 'slate-700' } }}
            />
          </Flex>
          <Flex d="column" gap={2}>
            <Label fontSize={13} fontWeight={600} color="slate-500">
              Button
            </Label>
            <Button
              type="submit"
              px={4}
              py={2}
              borderRadius={2}
              bgColor="sky-500"
              color="white"
              fontSize={14}
              fontWeight={600}
              hover={{ bgColor: 'sky-600' }}
            >
              A button with no onClick needs no client
            </Button>
          </Flex>
        </Grid>
      </Box>

      <Box p={6} borderRadius={3} b={1} borderColor="slate-200" theme={{ dark: { borderColor: 'slate-800' } }}>
        <H2 fontSize={18} fontWeight={600}>
          A stateful component, imported the same way
        </H2>
        <P mt={3} color="slate-600" theme={{ dark: { color: 'slate-400' } }}>
          <Span fontWeight={600}>Checkbox</Span> runs an effect, so it ships a <code>&apos;use client&apos;</code> banner and the bundler
          makes it a client boundary. Importing it here used to fail the build outright.
        </P>
        <Flex ai="center" gap={3} mt={4}>
          <Checkbox name="agree" defaultChecked />
          <Label fontSize={14}>Rendered from a Server Component</Label>
        </Flex>
      </Box>

      <Link props={{ href: '/' }} fontSize={14} color="sky-600" theme={{ dark: { color: 'sky-400' } }}>
        ← Back to the Box page
      </Link>
    </Flex>
  );
}
