import { motion } from 'framer-motion';
import { CircleAlert, Layers, Server, Zap } from 'lucide-react';
import { ReactNode } from 'react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import useTableOfContents from '../hooks/useTableOfContents';

export default function ServerComponentsPage() {
  useTableOfContents(sidebarLinks);

  return (
    <Box>
      <PageHeader
        icon={Server}
        title="React Server Components"
        description="Box renders on the server with no 'use client', no provider and no stylesheet to import. Its CSS is part of the HTML."
        badge="React 19"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={10}>
          <Section id="how-it-works" title="How it works">
            <Box>
              A Server Component cannot inject styles: there is no effect to run and no document to write to. In this mode Box does not
              inject anything — each rule it needs comes back as a <Mono>&lt;style href precedence&gt;</Mono> element rendered next to the
              markup, and React 19 hoists those into <Mono>&lt;head&gt;</Mono> and dedupes them by <Mono>href</Mono>. Styling becomes
              rendering, which is why it also streams: nothing waits for a commit that Suspense may split.
            </Box>
            <Flex d="column" gap={3} mt={5}>
              <Note icon={Zap} title="Nothing to configure">
                The <Mono>react-server</Mono> export condition resolves to a build of Box that calls no hook, schedules no effect and never
                touches the DOM. Importing the package from a Server Component is the whole setup.
              </Note>
              <Note icon={Layers} title="Deduped by content">
                Every <Mono>href</Mono> is a hash of the rule text, and class names are content hashes too — so the class the server
                resolved is the class the browser bundle resolves, and two Boxes with <Mono>p={'{4}'}</Mono> produce one style element.
              </Note>
            </Flex>
          </Section>

          <Code
            id="server-component"
            label="A page with no 'use client'"
            language="jsx"
            code={`// app/page.tsx — a Server Component.
import Box from '@cronocode/react-box';

export default function Page() {
  return (
    <Box p={6} bgColor="slate-50" borderRadius={2} theme={{ dark: { bgColor: 'slate-900' } }}>
      <Box tag="h1" fontSize={24} fontWeight={600}>
        Rendered on the server
      </Box>
      <Box tag="p" mt={2} color="slate-600" md={{ fontSize: 16 }} hover={{ color: 'sky-500' }}>
        Pseudo-classes, breakpoints and themes all work — they are just more rules.
      </Box>
    </Box>
  );
}`}
          />

          <Code
            id="client-components"
            label="Client components: one line, once"
            language="jsx"
            code={`// app/elementMode.ts — imported by every 'use client' module in the app.
'use client';
import Box from '@cronocode/react-box';

// The client bundle resolves the client Box, which inserts rules through the CSSOM after
// hydration — so an island's CSS would be missing from the server-rendered HTML. This puts
// it back in the markup, on the same emission path the server used.
Box.configure({ sink: 'element' });`}
          />

          <Section id="theming" title="Theming without a provider">
            <Box>
              <Mono>Box.Theme</Mono> needs state, storage and a media-query listener, so it stays client-only — but theme <em>rules</em> are
              ancestor-scoped (<Mono>.dark .someClass</Mono>
              ), which means a server component only has to put the theme name on <Mono>&lt;html&gt;</Mono>. Switching it later is a DOM
              write, and <Mono>createThemeController()</Mono> is that state machine with no React in it.
            </Box>
          </Section>

          <Code
            label="The server decides the theme, the browser can change it"
            language="jsx"
            code={`// app/layout.tsx — a Server Component.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}

// app/themeToggle.tsx — the island that changes it.
'use client';
import { createThemeController } from '@cronocode/react-box/core';

const controller = createThemeController({ storageKey: 'theme', theme: 'dark' });

export default function ThemeToggle() {
  return <button onClick={() => controller.set(controller.theme === 'dark' ? 'light' : 'dark')}>Theme</button>;
}`}
          />

          <Section id="cascade" title="The cascade comes from @layer">
            <Box>
              React hoists elements in render order, and atomic rules are shared between Boxes — so element order can never be relied on to
              keep <Mono>p</Mono> losing against <Mono>px</Mono>. Every rule is therefore wrapped in a cascade layer, and the base element
              declares the full layer order once, up front. Layer order beats source order, so this mode is exactly as deterministic as the
              CSSOM one. Two consequences are worth knowing:
            </Box>
            <Flex d="column" gap={3} mt={5}>
              <Note icon={CircleAlert} title="Your own unlayered CSS wins">
                Unlayered CSS beats every layer, so a plain stylesheet of yours overrides Box props here — which matches where the library
                puts its <Mono>&lt;style&gt;</Mono> element in the other modes.
              </Note>
              <Note icon={CircleAlert} title="Call Box.extend() before the first render">
                CSS appends a layer the first time it meets it, after every layer already named, so a prop registered mid-render sorts after
                the built-ins.
              </Note>
            </Flex>
          </Section>

          <Section id="limits" title="What stays on the client">
            <Flex tag="ul" d="column" gap={2}>
              <Bullet>
                Hover-callback children (<Mono>{'{({ isHover }) => …}'}</Mono>) — they need state. The server Box throws a message saying
                so.
              </Bullet>
              <Bullet>
                <Mono>Box.Theme</Mono>, for the same reason. Theme <em>styles</em> are unaffected.
              </Bullet>
              <Bullet>
                The pre-built components (<Mono>Flex</Mono>, <Mono>Button</Mono>, <Mono>Dropdown</Mono>, <Mono>DataGrid</Mono>, …) are
                client components today: import them from a <Mono>'use client'</Mono> module and use <Mono>Box</Mono> with a{' '}
                <Mono>tag</Mono> in server components.
              </Bullet>
              <Bullet>React 19 only. On React 18 the elements cannot be hoisted; keep the default sink there.</Bullet>
            </Flex>
          </Section>

          <Section id="example" title="The example app">
            <Box>
              <Mono>examples/next-app</Mono> in the repository is a Next.js App Router app whose pages are Server Components, with a
              streamed Suspense boundary, a client island and the theme toggle above. Its smoke test starts the production server and
              asserts on the HTML that the base element was hoisted, that every class in the markup has its rule in the response, and that
              the streamed section brought its own CSS with it.
            </Box>
            <Box mt={5}>
              <Code
                language="shell"
                codeOnly
                code={`npm run build            # the library itself
npm run build:next-app   # packs dist/, installs it, builds the app
npm run smoke:next-app   # 10 assertions against the served HTML`}
              />
            </Box>
          </Section>
        </Flex>
      </motion.div>
    </Box>
  );
}

const sidebarLinks = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'server-component', label: "A page with no 'use client'" },
  { id: 'client-components', label: 'Client components' },
  { id: 'theming', label: 'Theming without a provider' },
  { id: 'cascade', label: 'The cascade comes from @layer' },
  { id: 'limits', label: 'What stays on the client' },
  { id: 'example', label: 'The example app' },
] as const;

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Box id={id}>
      <Box tag="h2" fontSize={20} fontWeight={600} mb={4} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
        {title}
      </Box>
      <Box fontSize={15} lineHeight={26} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
        {children}
      </Box>
    </Box>
  );
}

function Note({ icon: Icon, title, children }: { icon: typeof Zap; title: string; children: ReactNode }) {
  return (
    <Flex
      gap={3}
      p={4}
      borderRadius={2}
      b={1}
      theme={{
        dark: { bgColor: 'slate-900', borderColor: 'slate-800' },
        light: { bgColor: 'slate-50', borderColor: 'slate-200' },
      }}
    >
      <Box theme={{ dark: { color: 'indigo-400' }, light: { color: 'indigo-500' } }} pt={0.5}>
        <Icon size={16} />
      </Box>
      <Box>
        <Box fontSize={14} fontWeight={600} mb={1} theme={{ dark: { color: 'slate-200' }, light: { color: 'slate-800' } }}>
          {title}
        </Box>
        <Box fontSize={14}>{children}</Box>
      </Box>
    </Flex>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <Flex tag="li" gap={3} ai="baseline">
      <Box width={1} height={1} borderRadius={10} bgColor="indigo-400" />
      <Box flex1>{children}</Box>
    </Flex>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return (
    <Box
      tag="code"
      px={1}
      borderRadius={1}
      fontSize={13}
      theme={{ dark: { bgColor: 'slate-800', color: 'slate-200' }, light: { bgColor: 'slate-100', color: 'slate-800' } }}
    >
      {children}
    </Box>
  );
}
