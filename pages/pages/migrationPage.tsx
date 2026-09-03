import { ArrowRight, Package } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import { Li, Ul } from '../../src/components/semantics';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import Reveal from '../components/reveal';

/** One row of the "what changed" table: the old string and the new one, nothing else. */
function Renamed({ was, now }: { was: string; now: string }) {
  return (
    <Flex ai="center" gap={4} py={3} bb={1} theme={{ dark: { borderColor: 'slate-800' }, light: { borderColor: 'slate-200' } }}>
      <Box tag="code" fontSize={13} flex1 theme={{ dark: { color: 'slate-500' }, light: { color: 'slate-500' } }}>
        {was}
      </Box>
      <Box color="slate-500" flexShrink={0}>
        <ArrowRight size={14} />
      </Box>
      <Box tag="code" fontSize={13} flex1 theme={{ dark: { color: 'emerald-400' }, light: { color: 'emerald-600' } }}>
        {now}
      </Box>
    </Flex>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <Box tag="h2" fontSize={22} fontWeight={600} mb={4} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
      {children}
    </Box>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <Box fontSize={15} lineHeight={24} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
      {children}
    </Box>
  );
}

export default function MigrationPage() {
  return (
    <Box>
      <PageHeader
        icon={Package}
        title="Migrating to Box Kite"
        badge="1.0.0"
        description="The library was published as @cronocode/react-box until 1.0.0. Same API, new name — for most projects the move is one find-and-replace."
      />

      <Reveal delay={0.1}>
        <Flex d="column" gap={6} mb={12}>
          <Heading>The move</Heading>
          <Code language="shell" label="Install the new package" code={'npm uninstall @cronocode/react-box\nnpm install @box-kite/react'} />
          <Prose>
            Then replace the specifier across your source. Every subpath keeps its name, so only the prefix changes — <code>/rsc</code>,{' '}
            <code>/a11y</code>, <code>/core</code>, <code>/ssg</code>, <code>/types</code> and every <code>/components/*</code> import
            resolve exactly as before.
          </Prose>
          <Box py={2}>
            <Renamed was="@cronocode/react-box" now="@box-kite/react" />
            <Renamed was="@cronocode/react-box/components/flex" now="@box-kite/react/components/flex" />
          </Box>
          <Prose>
            <strong>You do not have to do it today.</strong> <code>@cronocode/react-box@3.4.0</code> is a compatibility bridge: every entry
            re-exports the new package, so an <code>npm update</code> cannot break a build that has not migrated. It is deprecated on npm
            and receives no further changes.
          </Prose>
        </Flex>
      </Reveal>

      <Reveal delay={0.2}>
        <Flex d="column" gap={6} mb={12}>
          <Heading>Three things the bridge cannot forward</Heading>
          <Prose>
            If your project does any of these, the find-and-replace is not enough — these are the whole of the breaking surface in 1.0.0.
          </Prose>

          <Box>
            <Box fontSize={15} fontWeight={600} mb={2} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
              1. Type augmentation
            </Box>
            <Prose>
              TypeScript augments the module you name, and a re-export cannot pass that through. If you extend the prop types with{' '}
              <code>Box.extend()</code>, change the <code>declare module</code> string by hand:
            </Prose>
            <Box mt={4}>
              <Code
                language="jsx"
                check={false}
                code={
                  "// before\ndeclare module '@cronocode/react-box/types' { … }\n\n// after\ndeclare module '@box-kite/react/types' { … }"
                }
              />
            </Box>
          </Box>

          <Box>
            <Box fontSize={15} fontWeight={600} mb={2} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
              2. Two DOM ids
            </Box>
            <Prose>
              Both are documented debugging landmarks, so anything selecting them — a test, a global stylesheet, a screenshot script — needs
              updating.
            </Prose>
            <Box mt={2}>
              <Renamed was='<style id="crono-styles">' now='<style id="box-kite-styles">' />
              <Renamed was="#crono-box" now="#box-kite-portal" />
            </Box>
          </Box>

          <Box>
            <Box fontSize={15} fontWeight={600} mb={2} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
              3. The warning prefix
            </Box>
            <Prose>
              The runtime logs <code>[box-kite]</code> where it logged <code>[react-box]</code>. It matters only if you assert on it.
            </Prose>
          </Box>
        </Flex>
      </Reveal>

      <Reveal delay={0.3}>
        <Flex d="column" gap={4}>
          <Heading>What did not change</Heading>
          <Prose>Everything else. The rename is a name, not a redesign:</Prose>
          <Ul fontSize={15} lineHeight={26} pl={6} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
            <Li>
              <code>Box</code> and every API on it — <code>Box.extend()</code>, <code>Box.components()</code>, <code>Box.keyframes()</code>,{' '}
              <code>Box.spring()</code>, <code>Box.Theme</code>, <code>Box.configure()</code>
            </Li>
            <Li>all 212 props, their values and their numeric dividers</Li>
            <Li>every pre-built component, and the entry each one is imported from</Li>
            <Li>the generated class names and the atomic prefixes, so a snapshot of your CSS is unaffected</Li>
            <Li>
              the React peer range, the exports map and the <code>react-server</code> condition
            </Li>
          </Ul>
        </Flex>
      </Reveal>
    </Box>
  );
}
