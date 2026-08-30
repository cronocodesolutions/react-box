import { motion } from 'framer-motion';
import { Bell, ChartLine, Compass, Download, Heart, Search, Shapes, Star, Sun, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Icon from '../../src/components/icon';
import { H2 } from '../../src/components/semantics';
import { Circle, Path, Svg } from '../../src/components/svg';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import useTableOfContents from '../hooks/useTableOfContents';

export default function IconPage() {
  useTableOfContents(sidebarLinks);

  return (
    <Box>
      <PageHeader
        icon={Shapes}
        title="Icon"
        description="Box props on an icon somebody else drew. One adapter for lucide, Tabler, react-icons and the <svg> a designer sent you — sized on the same scale as everything else, themed, and named or hidden on purpose."
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={10}>
          <Code
            id="icons"
            label="Icons"
            language="jsx"
            code={`import { Sun } from 'lucide-react';

<Icon size={7} color="amber-500" hover={{ color: 'amber-300' }}>
  <Sun />
</Icon>`}
          >
            <Flex gap={6} ai="center" flexWrap="wrap">
              {swatches.map(({ icon, color, dark }) => (
                <Icon key={color} size={7} theme={{ dark: { color: dark }, light: { color } }} hover={{ rotate: 90 }} cursor="pointer">
                  {icon}
                </Icon>
              ))}
            </Flex>
          </Code>

          <Section id="channel" title="An icon set has exactly one styling channel">
            <Box>
              An icon component is somebody else&apos;s. There is no <Mono>tag</Mono> that renders one, so Box cannot wrap it, and the only
              thing it reliably accepts is the <Mono>className</Mono> it spreads onto its own <Mono>&lt;svg&gt;</Mono>.{' '}
              <Mono>&lt;Icon&gt;</Mono> fills that channel with a class the engine generated. Everything else follows from that: the icon
              takes the props every other component here takes, and none of them are handed to the icon as props it would have to
              understand.
            </Box>
            <Box mt={4}>
              That is why one component is enough for every set. <Mono>&lt;Icon&gt;</Mono> knows no icon library&apos;s API — it knows CSS.
            </Box>
          </Section>

          <Code
            id="size"
            label="Size"
            language="jsx"
            code={`import { Star } from 'lucide-react';

<Flex gap={6} ai="flex-end">
  <Icon size={4}><Star /></Icon>{/* 1rem — 16px */}
  <Icon size={6}><Star /></Icon>{/* 1.5rem — 24px, the default */}
  <Icon size={10}><Star /></Icon>{/* 2.5rem — 40px */}
</Flex>`}
          >
            <Flex gap={6} ai="flex-end">
              {[4, 6, 10, 16].map((size) => (
                <Flex key={size} d="column" ai="center" gap={2}>
                  <Icon size={size} color="indigo-500" theme={{ dark: { color: 'indigo-400' } }}>
                    <Star />
                  </Icon>
                  <Mono>size={`{${size}}`}</Mono>
                </Flex>
              ))}
            </Flex>
          </Code>

          <Section id="scale" title="The size is a number of fours, and it is CSS">
            <Box>
              <Mono>size</Mono> is one number for both axes on the ÷4 spacing scale the whole library uses — <Mono>size={'{5}'}</Mono> is
              1.25rem, <Mono>size={'{6}'}</Mono> is the 24px an icon set draws at, and that is the default. A <Mono>width</Mono> or{' '}
              <Mono>height</Mono> of your own replaces it; a <Mono>size</Mono> beats both.
            </Box>
            <Box mt={4}>
              <strong>Careful when porting:</strong> an icon set&apos;s own <Mono>size</Mono> prop counts in pixels.{' '}
              <Mono>&lt;Sun size={'{20}'} /&gt;</Mono> becomes <Mono>&lt;Icon size={'{5}'}&gt;</Mono>, not <Mono>size={'{20}'}</Mono>.
            </Box>
            <Box mt={4}>
              Nothing is passed down as a prop. The size lands in the class, and a CSS declaration outranks the <Mono>width</Mono> and{' '}
              <Mono>height</Mono> <em>presentation attributes</em> the icon writes for itself — so the set keeps rendering exactly what it
              always did and the class decides. The same is true of <Mono>strokeWidth</Mono>: it is an ordinary Box prop, so unlike a
              passthrough it can change on hover or at a breakpoint.
            </Box>
          </Section>

          <Code
            id="states"
            label="States"
            language="jsx"
            code={`import { Heart } from 'lucide-react';

<Icon
  size={7}
  strokeWidth={1.5}
  color="slate-400"
  hover={{ color: 'rose-500', strokeWidth: 2.5 }}
  theme={{ dark: { color: 'slate-500' } }}
>
  <Heart />
</Icon>`}
          >
            <Flex gap={6} ai="center">
              <Icon
                size={7}
                strokeWidth={1.5}
                color="slate-400"
                hover={{ color: 'rose-500', strokeWidth: 2.5 }}
                theme={{ dark: { color: 'slate-500' } }}
                cursor="pointer"
              >
                <Heart />
              </Icon>
              <Box fontSize={14} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
                hover it — the stroke thickens because <Mono>strokeWidth</Mono> is a prop, not a value handed to lucide once
              </Box>
            </Flex>
          </Code>

          <Code
            id="name"
            label="Naming"
            language="jsx"
            code={`import { Download, Trash2 } from 'lucide-react';

<Flex gap={8} ai="center">
  {/* Decoration: the label beside it already says everything. */}
  <Icon size={5}><Download /></Icon>
  {/* Carries meaning on its own: name it. */}
  <Icon size={5} label="Delete this row"><Trash2 /></Icon>
</Flex>`}
          >
            <Flex gap={8} ai="center" flexWrap="wrap">
              <Flex ai="center" gap={2} fontSize={14} theme={{ dark: { color: 'slate-300' }, light: { color: 'slate-700' } }}>
                <Icon size={5}>
                  <Download />
                </Icon>
                Download
              </Flex>
              <Icon size={5} label="Delete this row" color="rose-500">
                <Trash2 />
              </Icon>
            </Flex>
          </Code>

          <Section id="a11y" title="Hidden by default, named on purpose">
            <Box>
              An icon nobody named is decoration, and a screen reader should walk straight past it — which is what <Mono>aria-hidden</Mono>{' '}
              says and what saying nothing leaves ambiguous. So <Mono>&lt;Icon&gt;</Mono> hides by default. Give it a <Mono>label</Mono> and
              it becomes <Mono>role=&quot;img&quot;</Mono> with that name instead. Write a <Mono>role</Mono> or an <Mono>aria-*</Mono> of
              your own — on the icon or in <Mono>props</Mono> — and the decision stays yours.
            </Box>
            <Box mt={4}>
              This is the same rule <Mono>&lt;Svg&gt;</Mono> follows, so every <Mono>&lt;svg&gt;</Mono> this library puts on a page answers
              the question the same way. An icon-only button is the case to watch: the button needs the name, and a <Mono>label</Mono> on
              the icon inside it is one way to give it one.
            </Box>
          </Section>

          <Code
            id="sets"
            label="Any icon set"
            language="jsx"
            code={`import { Compass } from 'lucide-react';

{/* lucide, Tabler, react-icons — anything that spreads its props onto an <svg>. */}
<Icon size={6} color="sky-500"><Compass /></Icon>

{/* The <svg> a designer sent you, pasted in as it came. */}
<Icon size={6} color="sky-500">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx={12} cy={12} r={9} />
    <path d="M12 7v5l3 2" />
  </svg>
</Icon>`}
          >
            <Flex gap={8} ai="center">
              <Icon size={8} color="sky-500" theme={{ dark: { color: 'sky-400' } }}>
                <Compass />
              </Icon>
              <Icon size={8} color="sky-500" theme={{ dark: { color: 'sky-400' } }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <circle cx={12} cy={12} r={9} />
                  <path d="M12 7v5l3 2" />
                </svg>
              </Icon>
              <Icon size={8} color="sky-500" theme={{ dark: { color: 'sky-400' } }}>
                <ChartLine />
              </Icon>
            </Flex>
          </Code>

          <Section id="install" title="Install a set, import one icon at a time">
            <Box>
              This library ships no icons and never will — <a href="https://lucide.dev">lucide</a> is at 96M downloads a week with 1,500+
              icons, and it is what AI codegen already emits. Install it beside react-box and import the icons you use, one named import
              each, so a bundler ships only those.
            </Box>
            <Box mt={4}>
              Past thirty or forty icons on one page, weigh the alternative: a sprite or an icon font stops the per-icon cost growing. Below
              that, named imports win and the whole set never reaches the browser.
            </Box>
          </Section>

          <Code id="install-code" label="Install" language="shell" code={`npm install lucide-react`} codeOnly />

          <Section id="own-svg" title="Not for SVG you draw yourself">
            <Box>
              <Mono>&lt;Icon&gt;</Mono> exists because an icon set&apos;s component is not a Box. Yours can be: <Mono>&lt;Svg&gt;</Mono> and
              the nineteen elements beside it in <Mono>components/svg</Mono> take these props directly, and their attributes live in{' '}
              <Mono>props</Mono> the way every component here keeps them. Wrapping one in an <Mono>&lt;Icon&gt;</Mono> adds a class it does
              not need and hands it attributes it will not read.
            </Box>
            <Box mt={4}>
              The line is simply who drew it. Somebody else&apos;s <Mono>&lt;svg&gt;</Mono> — including one pasted in from a designer — goes
              in an <Mono>&lt;Icon&gt;</Mono>. One you are writing out of shapes is a <Mono>&lt;Svg&gt;</Mono>.
            </Box>
          </Section>

          <Code
            id="svg-instead"
            label="Draw it instead"
            language="jsx"
            code={`<Svg viewBox="0 0 24 24" width="2rem" label="Nine o'clock" fill="none" stroke="sky-500" strokeWidth={2}>
  <Circle cx={12} cy={12} r={9} />
  <Path d="M12 7v5l3 2" />
</Svg>`}
          >
            <Svg
              viewBox="0 0 24 24"
              width="2rem"
              label="Nine o'clock"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              theme={{ dark: { stroke: 'sky-400' }, light: { stroke: 'sky-500' } }}
            >
              <Circle cx={12} cy={12} r={9} />
              <Path d="M12 7v5l3 2" />
            </Svg>
          </Code>

          <Section id="use-class-names" title="The hook underneath: useClassNames">
            <Box>
              <Mono>&lt;Icon&gt;</Mono> is a thin thing over one hook, and the hook is public because icons are not the only elements this
              library cannot render. A <Mono>motion.div</Mono>, a router&apos;s <Mono>NavLink</Mono>, a third-party chart — all of them take
              a <Mono>className</Mono> and nothing else. <Mono>useClassNames</Mono> resolves the same props Box would and hands back the
              class list to put on them yourself.
            </Box>
            <Box mt={4}>
              <Mono>styles</Mono> is defined in element mode only, where the CSS travels as hoistable <Mono>&lt;style&gt;</Mono> elements
              rather than going to a stylesheet. In every other mode it is undefined and rendering it costs nothing, so the line below is
              what to write either way.
            </Box>
          </Section>

          <Code
            id="class-names-code"
            label="useClassNames"
            language="jsx"
            code={`import { useClassNames } from '@cronocode/react-box';
import { NavLink } from 'react-router-dom';

function ActiveLink({ to, children }: { to: string; children: React.ReactNode }) {
  const { className, styles } = useClassNames({ color: 'sky-500', hover: { color: 'sky-300' } });

  return (
    <>
      {styles}
      <NavLink to={to} className={className}>
        {children}
      </NavLink>
    </>
  );
}`}
            codeOnly
          />

          <Section id="props" title="The props">
            <Box mb={6}>
              Everything else is a Box prop — every colour, pseudo-class, breakpoint and theme works here exactly as it does on a{' '}
              <Mono>&lt;div&gt;</Mono>.
            </Box>
            <PropTable />
          </Section>
        </Flex>
      </motion.div>
    </Box>
  );
}

const swatches = [
  { icon: <Sun />, color: 'amber-500', dark: 'amber-400' },
  { icon: <Heart />, color: 'rose-500', dark: 'rose-400' },
  { icon: <Star />, color: 'violet-500', dark: 'violet-400' },
  { icon: <Bell />, color: 'sky-500', dark: 'sky-400' },
  { icon: <Search />, color: 'emerald-500', dark: 'emerald-400' },
  { icon: <ChartLine />, color: 'indigo-500', dark: 'indigo-400' },
] as const;

const props = [
  { name: 'children', type: 'ReactElement', description: 'The icon: exactly one element, whose <svg> is being styled.' },
  { name: 'size', type: 'number | string', description: 'Width and height at once, on the ÷4 scale. Defaults to 6 — 24px.' },
  { name: 'label', type: 'string', description: 'Names the icon: role="img" and this text. Without one it is aria-hidden.' },
  { name: 'props', type: 'SVG attributes', description: 'Attributes forwarded to the icon’s element, over what the icon writes itself.' },
  { name: 'className', type: 'ClassNameType', description: 'Merged with the engine’s classes and the icon’s own.' },
  { name: 'ref', type: 'Ref<SVGSVGElement>', description: 'Forwarded to the icon’s element.' },
];

const sidebarLinks = [
  { id: 'icons', label: 'Icons' },
  { id: 'channel', label: 'The one channel' },
  { id: 'size', label: 'Size' },
  { id: 'scale', label: 'The ÷4 scale' },
  { id: 'states', label: 'States' },
  { id: 'name', label: 'Naming' },
  { id: 'a11y', label: 'Hidden by default' },
  { id: 'sets', label: 'Any icon set' },
  { id: 'install', label: 'Installing a set' },
  { id: 'own-svg', label: 'Your own SVG' },
  { id: 'use-class-names', label: 'useClassNames' },
  { id: 'props', label: 'Props' },
];

function PropTable() {
  return (
    <Box overflow="auto">
      <Box tag="table" display="table" width="fit" style={{ borderCollapse: 'collapse' }}>
        <Box tag="thead" display="table-header-group">
          <Box tag="tr" display="table-row">
            <HeadCell>Prop</HeadCell>
            <HeadCell>Type</HeadCell>
            <HeadCell>What it does</HeadCell>
          </Box>
        </Box>
        <Box tag="tbody" display="table-row-group">
          {props.map(({ name, type, description }) => (
            <Box tag="tr" display="table-row" key={name}>
              <Cell>
                <Mono>{name}</Mono>
              </Cell>
              <Cell>
                <Mono>{type}</Mono>
              </Cell>
              <Cell>{description}</Cell>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function HeadCell({ children }: { children: ReactNode }) {
  return (
    <Box
      tag="th"
      display="table-cell"
      textAlign="left"
      fontSize={13}
      fontWeight={600}
      py={2}
      pr={6}
      bb={1}
      theme={{ dark: { color: 'slate-300', borderColor: 'slate-700' }, light: { color: 'slate-700', borderColor: 'slate-200' } }}
    >
      {children}
    </Box>
  );
}

function Cell({ children }: { children: ReactNode }) {
  return (
    <Box
      tag="td"
      display="table-cell"
      fontSize={14}
      py={2}
      pr={6}
      bb={1}
      theme={{ dark: { color: 'slate-400', borderColor: 'slate-800' }, light: { color: 'slate-600', borderColor: 'slate-100' } }}
    >
      {children}
    </Box>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Box id={id}>
      <H2 fontSize={20} fontWeight={600} mb={4} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
        {title}
      </H2>
      <Box fontSize={15} lineHeight={26} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
        {children}
      </Box>
    </Box>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return (
    <Box
      tag="code"
      display="inline"
      px={1}
      borderRadius={1}
      fontSize={13}
      theme={{ dark: { bgColor: 'slate-800', color: 'slate-200' }, light: { bgColor: 'slate-100', color: 'slate-800' } }}
    >
      {children}
    </Box>
  );
}
