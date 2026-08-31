import Box from '@cronocode/react-box';
import Button from '@cronocode/react-box/components/button';
import Checkbox from '@cronocode/react-box/components/checkbox';
import Flex from '@cronocode/react-box/components/flex';
import Grid from '@cronocode/react-box/components/grid';
import { H2, Label, Link, P, Span } from '@cronocode/react-box/components/semantics';
import Textbox from '@cronocode/react-box/components/textbox';

/**
 * The pre-built components, imported straight into a Server Component — no `'use client'` here. The
 * hook-free ones are wrappers around Box whose chunks import the package by name, so the `react-server`
 * condition reaches them and they render on the server. `Checkbox` holds a ref, so its chunk ships a
 * `use client` banner: its markup is still server-rendered, its *rules* arrive with the client bundle.
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
        <Box mt={4}>
          <Checkbox name="agree" label="Rendered from a Server Component" labelProps={{ fontSize: 14 }} defaultChecked />
        </Box>
      </Box>

      <Link props={{ href: '/' }} fontSize={14} color="sky-600" theme={{ dark: { color: 'sky-400' } }}>
        ← Back to the Box page
      </Link>
    </Flex>
  );
}
