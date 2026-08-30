import { motion } from 'framer-motion';
import { Spline } from 'lucide-react';
import { ReactNode } from 'react';
import Box from '../../src/box';
import BaseSvg from '../../src/components/baseSvg';
import Flex from '../../src/components/flex';
import { H2 } from '../../src/components/semantics';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import useTableOfContents from '../hooks/useTableOfContents';

export default function SvgPage() {
  useTableOfContents(sidebarLinks);

  return (
    <Box>
      <PageHeader
        icon={Spline}
        title="SVG"
        description="Fourteen SVG paint and stroke properties as typed props — the same colour variables, the same themes, the same pseudo-classes every other Box prop gets."
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={10}>
          <Code
            id="paint"
            label="Paint"
            language="jsx"
            code={`<BaseSvg viewBox="0 0 120 48" width="120px" fill="violet-500" stroke="violet-300" strokeWidth={2}>
  <circle cx="24" cy="24" r="16" />
  <rect x="52" y="8" width="32" height="32" fillOpacity={0.4} />
  <circle cx="104" cy="24" r="16" fill="none" strokeWidth={4} strokeOpacity={0.5} />
</BaseSvg>`}
          >
            <BaseSvg
              viewBox="0 0 120 48"
              width="120px"
              theme={{ dark: { fill: 'violet-400', stroke: 'violet-200' }, light: { fill: 'violet-500', stroke: 'violet-700' } }}
              strokeWidth={2}
            >
              <circle cx="24" cy="24" r="16" />
              <rect x="52" y="8" width="32" height="32" fillOpacity={0.4} />
              <circle cx="104" cy="24" r="16" fill="none" strokeWidth={4} strokeOpacity={0.5} />
            </BaseSvg>
          </Code>

          <Section id="inheritance" title="Set them once, on the element above">
            <Box>
              Every property here except <Mono>vectorEffect</Mono> is an inherited one, so a value on the <Mono>&lt;svg&gt;</Mono> reaches
              every shape inside it — that is why the demo above sets <Mono>stroke</Mono> once rather than on all three shapes. A shape that
              wants something else states it, and wins for itself.
            </Box>
            <Box mt={4}>
              The one thing inheritance cannot beat is a <Mono>fill</Mono> or <Mono>stroke</Mono> <em>attribute</em> written on the shape
              itself: a presentation attribute on an element outranks a value inherited from its parent. Icon sets that hard-code{' '}
              <Mono>fill=&quot;currentColor&quot;</Mono> on each path are the common case — style those paths, not the wrapper.
            </Box>
          </Section>

          <Section id="units" title="The numbers are user units">
            <Box>
              <Mono>strokeWidth</Mono>, <Mono>strokeDasharray</Mono>, <Mono>strokeDashoffset</Mono> and <Mono>strokeMiterlimit</Mono> take
              the number and pass it straight through — <Mono>strokeWidth={'{2}'}</Mono> is <Mono>stroke-width: 2</Mono>. No divider is
              applied, because an SVG length is measured in the coordinate system the <Mono>viewBox</Mono> sets up, not in rem or in pixels.
              That is the same number you would have written in the attribute.
            </Box>
            <Box mt={4}>
              <Mono>fillOpacity</Mono> and <Mono>strokeOpacity</Mono> use the same 0–1 scale as <Mono>opacity</Mono>, in tenths.
            </Box>
          </Section>

          <Code
            id="dashes"
            label="Dashes"
            language="jsx"
            code={`<BaseSvg viewBox="0 0 200 12" width="200px" stroke="emerald-500" strokeWidth={4} fill="none" strokeLinecap="round">
  <line x1="4" y1="6" x2="196" y2="6" strokeDasharray={12} />
</BaseSvg>`}
          >
            <Flex d="column" gap={4}>
              {dashPatterns.map(({ label, dasharray, linecap }) => (
                <Flex key={label} ai="center" gap={4}>
                  <Box width={28}>
                    <Mono>{label}</Mono>
                  </Box>
                  <BaseSvg
                    viewBox="0 0 200 12"
                    width="200px"
                    height="12px"
                    fill="none"
                    strokeWidth={4}
                    strokeLinecap={linecap}
                    strokeDasharray={dasharray}
                    theme={{ dark: { stroke: 'emerald-400' }, light: { stroke: 'emerald-600' } }}
                  >
                    <line x1="4" y1="6" x2="196" y2="6" />
                  </BaseSvg>
                </Flex>
              ))}
            </Flex>
          </Code>

          <Section id="dash-pattern" title="A pattern is a number or a string">
            <Box>
              <Mono>strokeDasharray={'{12}'}</Mono> is a 12-long dash and a 12-long gap. Anything else is the CSS value as a string —{' '}
              <Mono>&quot;12 4&quot;</Mono> for a long dash and a short gap, <Mono>&quot;1 8&quot;</Mono> with a round cap for a dotted
              line. The space survives the class name: it becomes an underscore there, so <Mono>strokeDasharray=&quot;12 4&quot;</Mono> is
              the class <Mono>strokeDasharray-12_4</Mono> and one rule.
            </Box>
          </Section>

          <Code
            id="drawing"
            label="Drawing a path on hover"
            language="jsx"
            code={`// The track is drawn once. The line over it starts pushed off its own dash and slides back on hover.
<Box position="relative" width={50} height={12}>
  <BaseSvg viewBox="0 0 200 48" width="200px" fill="none" stroke="slate-200" strokeWidth={3} strokeLinecap="round">
    <path d="M8 40 L56 12 L104 34 L152 8 L192 24" />
  </BaseSvg>
  <BaseSvg
    viewBox="0 0 200 48"
    width="200px"
    position="absolute"
    inset={0}
    fill="none"
    stroke="violet-500"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={320}
    strokeDashoffset={320}
    hover={{ strokeDashoffset: 0 }}
  >
    <path d="M8 40 L56 12 L104 34 L152 8 L192 24" />
  </BaseSvg>
</Box>`}
          >
            <Flex d="column" gap={3}>
              <Box position="relative" width={50} height={12}>
                <BaseSvg
                  viewBox="0 0 200 48"
                  width="200px"
                  height="48px"
                  fill="none"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  theme={{ dark: { stroke: 'slate-700' }, light: { stroke: 'slate-200' } }}
                >
                  <path d="M8 40 L56 12 L104 34 L152 8 L192 24" />
                </BaseSvg>
                <BaseSvg
                  viewBox="0 0 200 48"
                  width="200px"
                  height="48px"
                  position="absolute"
                  inset={0}
                  fill="none"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={320}
                  strokeDashoffset={320}
                  hover={{ strokeDashoffset: 0 }}
                  theme={{ dark: { stroke: 'violet-400' }, light: { stroke: 'violet-600' } }}
                >
                  <path d="M8 40 L56 12 L104 34 L152 8 L192 24" />
                </BaseSvg>
              </Box>
              <Box fontSize={13} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-500' } }}>
                Hover the line.
              </Box>
            </Flex>
          </Code>

          <Section id="motion" title="The transition is already there">
            <Box>
              Nothing in that example declares a transition. Every Box transitions on <Mono>--transitionTime</Mono>, and an{' '}
              <Mono>&lt;svg&gt;</Mono> and the shapes inside it transition on <Mono>--svgTransitionTime</Mono> — so moving{' '}
              <Mono>strokeDashoffset</Mono> under <Mono>hover</Mono> is the whole animation.
            </Box>
            <Box mt={4}>
              Which also means it stops when it should: a reader with <Mono>prefers-reduced-motion: reduce</Mono> gets both variables set to{' '}
              <Mono>0s</Mono>, and the line simply appears.
            </Box>
          </Section>

          <Code
            id="joins"
            label="Caps and joins"
            language="jsx"
            code={`<BaseSvg viewBox="0 0 72 40" width="72px" fill="none" stroke="amber-500" strokeWidth={12} strokeLinejoin="round" strokeLinecap="round">
  <path d="M10 32 L36 10 L62 32" />
</BaseSvg>`}
          >
            <Flex gap={8} flexWrap="wrap">
              {joins.map(({ linejoin, linecap }) => (
                <Flex key={linejoin} d="column" gap={2} ai="center">
                  <BaseSvg
                    viewBox="0 0 72 40"
                    width="72px"
                    height="40px"
                    fill="none"
                    strokeWidth={12}
                    strokeLinejoin={linejoin}
                    strokeLinecap={linecap}
                    theme={{ dark: { stroke: 'amber-400' }, light: { stroke: 'amber-500' } }}
                  >
                    <path d="M10 32 L36 10 L62 32" />
                  </BaseSvg>
                  <Mono>{linejoin}</Mono>
                </Flex>
              ))}
            </Flex>
          </Code>

          <Code
            id="fill-rule"
            label="Fill rule"
            language="jsx"
            code={`<BaseSvg viewBox="0 0 64 64" width="64px" fill="sky-500" fillRule="evenodd">
  <path d="M32 4 L39 24 L60 24 L43 37 L50 58 L32 45 L14 58 L21 37 L4 24 L25 24 Z" />
</BaseSvg>`}
          >
            <Flex gap={8}>
              {(['nonzero', 'evenodd'] as const).map((rule) => (
                <Flex key={rule} d="column" gap={2} ai="center">
                  <BaseSvg
                    viewBox="0 0 64 64"
                    width="64px"
                    height="64px"
                    fillRule={rule}
                    theme={{ dark: { fill: 'sky-400' }, light: { fill: 'sky-600' } }}
                  >
                    <path d="M32 4 L39 24 L60 24 L43 37 L50 58 L32 45 L14 58 L21 37 L4 24 L25 24 Z" />
                  </BaseSvg>
                  <Mono>{rule}</Mono>
                </Flex>
              ))}
            </Flex>
          </Code>

          <Code
            id="vector-effect"
            label="A stroke that ignores the scale"
            language="jsx"
            code={`<BaseSvg viewBox="0 0 12 12" width="96px" fill="none" stroke="rose-500" strokeWidth={1} vectorEffect="non-scaling-stroke">
  <path d="M1 11 L6 1 L11 11 Z" />
</BaseSvg>`}
          >
            <Flex gap={8}>
              {([false, true] as const).map((nonScaling) => (
                <Flex key={String(nonScaling)} d="column" gap={2} ai="center">
                  <BaseSvg
                    viewBox="0 0 12 12"
                    width="96px"
                    height="96px"
                    fill="none"
                    strokeWidth={1}
                    vectorEffect={nonScaling ? 'non-scaling-stroke' : 'none'}
                    theme={{ dark: { stroke: 'rose-400' }, light: { stroke: 'rose-600' } }}
                  >
                    <path d="M1 11 L6 1 L11 11 Z" />
                  </BaseSvg>
                  <Mono>{nonScaling ? 'non-scaling-stroke' : 'none'}</Mono>
                </Flex>
              ))}
            </Flex>
          </Code>

          <Section id="not-inherited" title="vectorEffect is the exception">
            <Box>
              Both shapes above are drawn at <Mono>strokeWidth={'{1}'}</Mono> in a 12-unit <Mono>viewBox</Mono> blown up to 96 pixels, so
              the left one comes out eight units thick. <Mono>non-scaling-stroke</Mono> measures the stroke after the transform instead,
              which is what a chart redrawn at any width needs.
            </Box>
            <Box mt={4}>
              Alone among these properties, <Mono>vector-effect</Mono> is not inherited — a value on the <Mono>&lt;svg&gt;</Mono> would
              reach nothing. So this prop, and only this prop, writes a rule that names the element and its descendants:{' '}
              <Mono>.vectorEffect-non-scaling-stroke, .vectorEffect-non-scaling-stroke *</Mono>. Put it wherever it reads best.
            </Box>
          </Section>

          <Code
            id="paint-order"
            label="Outlined text"
            language="jsx"
            code={`<BaseSvg viewBox="0 0 200 48" width="200px" fill="white" stroke="indigo-600" strokeWidth={6} paintOrder="stroke" strokeLinejoin="round">
  <text x="8" y="36" fontSize={36} fontWeight={700}>
    Box
  </text>
</BaseSvg>`}
          >
            <Flex gap={8} flexWrap="wrap">
              {(['normal', 'stroke'] as const).map((order) => (
                <Flex key={order} d="column" gap={2} ai="center">
                  <BaseSvg
                    viewBox="0 0 120 48"
                    width="120px"
                    height="48px"
                    strokeWidth={6}
                    paintOrder={order}
                    strokeLinejoin="round"
                    theme={{ dark: { fill: 'white', stroke: 'indigo-500' }, light: { fill: 'white', stroke: 'indigo-600' } }}
                  >
                    <text x="8" y="36" fontSize={36} fontWeight={700}>
                      Box
                    </text>
                  </BaseSvg>
                  <Mono>{order}</Mono>
                </Flex>
              ))}
            </Flex>
          </Code>

          <Section id="reference" title="Every prop">
            <PropTable />
          </Section>

          <Section id="themes" title="Themes, pseudo-classes, breakpoints">
            <Box>
              These are ordinary Box props, so everything that nests around a Box prop nests around them. A stroke that changes with the
              theme, a fill that reacts to hover and a width that grows at a breakpoint are all one prop each.
            </Box>
            <Box mt={4}>
              <Code
                language="jsx"
                codeOnly
                code={`<BaseSvg
  viewBox="0 0 24 24"
  fill="none"
  strokeWidth={2}
  theme={{ dark: { stroke: 'slate-300' }, light: { stroke: 'slate-700' } }}
  hover={{ strokeWidth: 3 }}
  md={{ strokeWidth: 1.5 }}
>
  <path d="M4 12h16" />
</BaseSvg>`}
              />
            </Box>
          </Section>
        </Flex>
      </motion.div>
    </Box>
  );
}

const sidebarLinks = [
  { id: 'paint', label: 'Paint' },
  { id: 'inheritance', label: 'Inheritance' },
  { id: 'units', label: 'User units' },
  { id: 'dashes', label: 'Dashes' },
  { id: 'dash-pattern', label: 'Dash patterns' },
  { id: 'drawing', label: 'Drawing a path' },
  { id: 'motion', label: 'The transition' },
  { id: 'joins', label: 'Caps and joins' },
  { id: 'fill-rule', label: 'Fill rule' },
  { id: 'vector-effect', label: 'Non-scaling stroke' },
  { id: 'not-inherited', label: 'The one exception' },
  { id: 'paint-order', label: 'Outlined text' },
  { id: 'reference', label: 'Every prop' },
  { id: 'themes', label: 'Themes and states' },
] as const;

const dashPatterns: { label: string; dasharray: number | string; linecap: 'butt' | 'round' | 'square' }[] = [
  { label: '12', dasharray: 12, linecap: 'butt' },
  { label: '"12 4"', dasharray: '12 4', linecap: 'butt' },
  { label: '"1 8"', dasharray: '1 8', linecap: 'round' },
];

const joins: { linejoin: 'miter' | 'round' | 'bevel'; linecap: 'butt' | 'round' | 'square' }[] = [
  { linejoin: 'miter', linecap: 'butt' },
  { linejoin: 'round', linecap: 'round' },
  { linejoin: 'bevel', linecap: 'square' },
];

const props: { name: string; css: string; values: string }[] = [
  { name: 'fill', css: 'fill', values: 'any colour variable, or none' },
  { name: 'fillOpacity', css: 'fill-opacity', values: '0 – 1 in tenths' },
  { name: 'fillRule', css: 'fill-rule', values: 'nonzero, evenodd' },
  { name: 'stroke', css: 'stroke', values: 'any colour variable, or none' },
  { name: 'strokeOpacity', css: 'stroke-opacity', values: '0 – 1 in tenths' },
  { name: 'strokeWidth', css: 'stroke-width', values: 'a number, in user units' },
  { name: 'strokeLinecap', css: 'stroke-linecap', values: 'butt, round, square' },
  { name: 'strokeLinejoin', css: 'stroke-linejoin', values: 'miter, round, bevel' },
  { name: 'strokeMiterlimit', css: 'stroke-miterlimit', values: 'a number, 1 or greater' },
  { name: 'strokeDasharray', css: 'stroke-dasharray', values: 'a number, or the pattern as a string' },
  { name: 'strokeDashoffset', css: 'stroke-dashoffset', values: 'a number, or a percentage of the path length' },
  { name: 'paintOrder', css: 'paint-order', values: 'normal, fill, stroke, markers' },
  { name: 'vectorEffect', css: 'vector-effect', values: 'none, non-scaling-stroke' },
  { name: 'shapeRendering', css: 'shape-rendering', values: 'auto, optimizeSpeed, crispEdges, geometricPrecision' },
];

function PropTable() {
  return (
    <Box overflow="auto">
      <Box tag="table" display="table" width="fit" style={{ borderCollapse: 'collapse' }}>
        <Box tag="thead" display="table-header-group">
          <Box tag="tr" display="table-row">
            <HeadCell>Prop</HeadCell>
            <HeadCell>CSS property</HeadCell>
            <HeadCell>Values</HeadCell>
          </Box>
        </Box>
        <Box tag="tbody" display="table-row-group">
          {props.map(({ name, css, values }) => (
            <Box tag="tr" display="table-row" key={name}>
              <Cell>
                <Mono>{name}</Mono>
              </Cell>
              <Cell>{css}</Cell>
              <Cell>{values}</Cell>
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
