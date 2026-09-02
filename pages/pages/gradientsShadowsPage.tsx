import { Layers } from 'lucide-react';
import { ReactNode } from 'react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import { H2, P } from '../../src/components/semantics';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import Reveal from '../components/reveal';
import useTableOfContents from '../hooks/useTableOfContents';

export default function GradientsShadowsPage() {
  useTableOfContents(sidebarLinks);

  return (
    <Box>
      <PageHeader
        icon={Layers}
        title="Gradients & Shadows"
        description="A gradient written as a value, so its stops are palette colours — and four shadows that stack on one box-shadow instead of overwriting each other."
        badge="NEW"
      />

      <Reveal delay={0.1}>
        <Flex d="column" gap={10}>
          <Section id="concept" title="A gradient is a value, not a string">
            Written as CSS a gradient is text, and text cannot be themed, cannot take a token and cannot share a class. Here it is a record:
            the key names the kind and carries its geometry, <Mono>colors</Mono> are the stops in order. Because a stop is an ordinary
            colour value, a gradient follows the palette into dark mode, takes the opacity modifier, and two elements asking for the same
            one still resolve to a single rule.
          </Section>

          <Code
            id="concept-code"
            label="The three kinds"
            language="jsx"
            codeOnly
            code={`<Box bgGradient={{ linear: 'r', colors: ['blue-500', 'pink-500'] }} />
<Box bgGradient={{ linear: 135, colors: ['blue-500', 'pink-500'] }} />
<Box bgGradient={{ radial: 'circle', at: 'top left', colors: ['sky-400', 'indigo-900'] }} />
<Box bgGradient={{ conic: 45, colors: ['red-500', 'yellow-500', 'red-500'] }} />`}
          />

          <Section id="kinds" title="Direction, shape, angle">
            <Mono>linear</Mono> takes one of eight directions — <Mono>t</Mono>, <Mono>tr</Mono>, <Mono>r</Mono>, <Mono>br</Mono>,{' '}
            <Mono>b</Mono>, <Mono>bl</Mono>, <Mono>l</Mono>, <Mono>tl</Mono> — or a number, which is an angle in degrees with <Mono>0</Mono>{' '}
            pointing up. <Mono>radial</Mono> takes a shape, <Mono>conic</Mono> an angle to start from, and either takes <Mono>at</Mono> to
            say where it is centred. A linear gradient runs in a direction rather than out of a point, so <Mono>at</Mono> is not one of its
            keys.
          </Section>

          <Code
            id="kinds-demo"
            label="One of each"
            language="jsx"
            code={`<Flex gap={4} flexWrap="wrap">
  <Box width={40} height={28} borderRadius={2} bgGradient={{ linear: 'r', colors: ['blue-500', 'pink-500'] }} />
  <Box width={40} height={28} borderRadius={2} bgGradient={{ linear: 135, colors: ['emerald-400', 'sky-600'] }} />
  <Box width={40} height={28} borderRadius={2} bgGradient={{ radial: 'circle', at: 'top left', colors: ['amber-300', 'rose-600'] }} />
  <Box width={40} height={28} borderRadius={2} bgGradient={{ conic: 45, colors: ['violet-500', 'cyan-400', 'violet-500'] }} />
</Flex>`}
          >
            <Flex gap={4} flexWrap="wrap">
              <Swatch bgGradient={{ linear: 'r', colors: ['blue-500', 'pink-500'] }} caption="linear: 'r'" />
              <Swatch bgGradient={{ linear: 135, colors: ['emerald-400', 'sky-600'] }} caption="linear: 135" />
              <Swatch bgGradient={{ radial: 'circle', at: 'top left', colors: ['amber-300', 'rose-600'] }} caption="radial at top left" />
              <Swatch bgGradient={{ conic: 45, colors: ['violet-500', 'cyan-400', 'violet-500'] }} caption="conic: 45" />
            </Flex>
          </Code>

          <Section id="stops" title="A stop is a colour, and every colour value works">
            Anything a colour prop takes is a stop: a palette token, a token with an opacity modifier, a system colour, or a{' '}
            <Mono>var(--chart-1)</Mono> somebody else declared. A <Mono>[colour, position]</Mono> pair says how far along the gradient the
            stop sits. Two stops is the minimum, because one stop is a colour rather than a gradient.
          </Section>

          <Code
            id="stops-demo"
            label="Positions and the opacity modifier"
            language="jsx"
            code={`<Flex gap={4} flexWrap="wrap">
  <Box width={40} height={28} borderRadius={2} bgGradient={{ linear: 'r', colors: [['sky-500', '20%'], ['indigo-700', '80%']] }} />
  <Box width={40} height={28} borderRadius={2} bgColor="amber-400" bgGradient={{ linear: 'b', colors: ['black/50', 'transparent'] }} />
</Flex>`}
          >
            <Flex gap={4} flexWrap="wrap">
              <Swatch
                bgGradient={{
                  linear: 'r',
                  colors: [
                    ['sky-500', '20%'],
                    ['indigo-700', '80%'],
                  ],
                }}
                caption="positioned stops"
              />
              <Swatch bgGradient={{ linear: 'b', colors: ['black/50', 'transparent'] }} caption="black/50 to transparent" />
            </Flex>
          </Code>

          <Section id="interpolate" title="The space the colours travel through">
            Two stops are joined by a path, and sRGB — the browser default — runs that path through a desaturated middle. Blue to yellow
            goes grey on the way. <Mono>interpolate</Mono> names a better space: <Mono>oklch</Mono> keeps the chroma up the whole way, and{' '}
            <Mono>oklch-longer</Mono> takes the long way round the hue circle, which is what turns two stops into a spectrum. This is the
            half of OKLCH the palette work deliberately left here.
          </Section>

          <Code
            id="interpolate-demo"
            label="The same two stops, three ways"
            language="jsx"
            code={`<Flex d="column" gap={3}>
  <Box height={12} borderRadius={2} bgGradient={{ linear: 'r', colors: ['blue-600', 'yellow-400'] }} />
  <Box height={12} borderRadius={2} bgGradient={{ linear: 'r', colors: ['blue-600', 'yellow-400'], interpolate: 'oklch' }} />
  <Box height={12} borderRadius={2} bgGradient={{ linear: 'r', colors: ['blue-600', 'yellow-400'], interpolate: 'oklch-longer' }} />
</Flex>`}
          >
            <Flex d="column" gap={3} width="fit">
              <Band bgGradient={{ linear: 'r', colors: ['blue-600', 'yellow-400'] }} caption="default — sRGB, grey in the middle" />
              <Band bgGradient={{ linear: 'r', colors: ['blue-600', 'yellow-400'], interpolate: 'oklch' }} caption="interpolate: 'oklch'" />
              <Band
                bgGradient={{ linear: 'r', colors: ['blue-600', 'yellow-400'], interpolate: 'oklch-longer' }}
                caption="interpolate: 'oklch-longer' — the long way round"
              />
            </Flex>
          </Code>

          <Section id="whole" title="Judged whole, so a typo shows nothing rather than something else">
            A gradient is one value: a bad stop makes the rest of it meaningless, so the whole record is rejected together and emits no rule
            and no class name. Unknown keys are rejected too, which <Mono>vars</Mono> does not do — these names belong to the grammar, and{' '}
            <Mono>interpolat</Mono> misspelt would otherwise paint a silent sRGB gradient with nothing to see.
          </Section>

          <Code
            id="whole-code"
            label="Each of these emits nothing at all"
            language="jsx"
            codeOnly
            check={false}
            code={`<Box bgGradient={{ linear: 'r', colors: ['bleu-500', 'pink-500'] }} />   {/* no such token */}
<Box bgGradient={{ linear: 'r', colors: ['blue-500'] }} />              {/* one stop is a colour */}
<Box bgGradient={{ linear: 'r', radial: true, colors: [...] }} />        {/* two kinds at once */}
<Box bgGradient={{ linear: 'r', colors: [...], interpolat: 'oklch' }} /> {/* misspelt key */}`}
          />

          <Section id="shadows" title="Four shadows, one property">
            CSS gives an element one <Mono>box-shadow</Mono>, which normally means the last rule wins and an elevation and a ring cannot
            coexist. Here each is a layer with a custom property of its own, and all four write the same composed declaration — so they
            compose the way <Mono>translateX</Mono> and <Mono>translateY</Mono> do. <Mono>shadow</Mono> is Tailwind elevation, from{' '}
            <Mono>xxs</Mono> to <Mono>xxl</Mono>; the older <Mono>small</Mono>, <Mono>medium</Mono> and <Mono>large</Mono> presets still
            work and carry their own colour.
          </Section>

          <Code
            id="shadows-demo"
            label="The elevation scale"
            language="jsx"
            code={`<Flex gap={5} flexWrap="wrap">
  <Box width={24} height={16} borderRadius={2} bgColor="white" shadow="xs" />
  <Box width={24} height={16} borderRadius={2} bgColor="white" shadow="sm" />
  <Box width={24} height={16} borderRadius={2} bgColor="white" shadow="md" />
  <Box width={24} height={16} borderRadius={2} bgColor="white" shadow="lg" />
  <Box width={24} height={16} borderRadius={2} bgColor="white" shadow="xl" />
</Flex>`}
          >
            <Flex gap={5} flexWrap="wrap" py={3}>
              {(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map((size) => (
                <Tile key={size} shadow={size} caption={size} />
              ))}
            </Flex>
          </Code>

          <Section id="rings" title="A ring is not an outline">
            <Mono>ring</Mono> and <Mono>insetRing</Mono> are a width in pixels rather than a step on a scale. A ring follows{' '}
            <Mono>borderRadius</Mono>, costs no layout and joins the shadow stack — all three things an <Mono>outline</Mono> does not do —
            so a focus ring, an inner hairline and an elevation can all be on the same element at once.
          </Section>

          <Code
            id="rings-demo"
            label="Stacked, not replaced"
            language="jsx"
            code={`<Flex gap={5} flexWrap="wrap">
  <Box width={28} height={18} borderRadius={3} bgColor="white" ring={2} ringColor="indigo-500" />
  <Box width={28} height={18} borderRadius={3} bgColor="white" insetRing={1} insetRingColor="slate-300" />
  <Box width={28} height={18} borderRadius={3} bgColor="white" shadow="lg" ring={3} ringColor="indigo-500/40" />
</Flex>`}
          >
            <Flex gap={5} flexWrap="wrap" py={3}>
              <Tile ring={2} ringColor="indigo-500" caption="ring={2}" />
              <Tile insetRing={1} insetRingColor="slate-300" caption="insetRing={1}" />
              <Tile insetShadow="sm" caption="insetShadow" />
              <Tile shadow="lg" ring={3} ringColor="indigo-500/40" caption="both at once" />
            </Flex>
          </Code>

          <Section id="colors" title="Every layer has a colour of its own">
            <Mono>shadowColor</Mono>, <Mono>insetShadowColor</Mono>, <Mono>ringColor</Mono> and <Mono>insetRingColor</Mono> take every
            colour value, opacity modifier included. Each shows nothing on its own — a colour with no layer painting it is as inert as{' '}
            <Mono>borderColor</Mono> with no border width. <Mono>none</Mono> on a shadow, or <Mono>0</Mono> on a ring, clears just that one
            layer and leaves the others painting.
          </Section>

          <Code
            id="colors-demo"
            label="A coloured elevation"
            language="jsx"
            code={`<Flex gap={5} flexWrap="wrap">
  <Box width={28} height={18} borderRadius={3} bgColor="white" shadow="lg" shadowColor="indigo-500/40" />
  <Box width={28} height={18} borderRadius={3} bgColor="white" shadow="lg" shadowColor="emerald-500/40" />
</Flex>`}
          >
            <Flex gap={5} flexWrap="wrap" py={3}>
              <Tile shadow="lg" shadowColor="indigo-500/40" caption="indigo-500/40" />
              <Tile shadow="lg" shadowColor="emerald-500/40" caption="emerald-500/40" />
              <Tile shadow="lg" shadowColor="rose-500/40" caption="rose-500/40" />
            </Flex>
          </Code>

          <Section id="text" title="And the same again for text">
            <Mono>textShadow</Mono> runs <Mono>xxs</Mono> to <Mono>lg</Mono> with <Mono>textShadowColor</Mono> beside it. It is one property
            with one contributor, so it needs no composing — but it is in the same transition group, and{' '}
            <Mono>transition=&quot;shadow&quot;</Mono> covers <Mono>box-shadow</Mono> and <Mono>text-shadow</Mono> both.
          </Section>

          <Code
            id="text-demo"
            label="textShadow"
            language="jsx"
            code={`<P fontSize={28} fontWeight={700} textShadow="md" textShadowColor="indigo-500/40">
  Raised type
</P>`}
          >
            <Box fontSize={28} fontWeight={700} textShadow="md" textShadowColor="indigo-500/40" theme={{ dark: { color: 'white' } }}>
              Raised type
            </Box>
          </Code>

          <Section id="layers" title="Why the layers are registered">
            The four custom properties are declared with <Mono>@property</Mono> in the base stylesheet, and the reason is inheritance: a
            custom property inherits by default, so a child asking only for a ring would read its parent value through the fallback and wear
            an elevation nobody gave it. Registering them <Mono>inherits: false</Mono> stops that. The universal syntax with no initial
            value is deliberate too — anything else makes the property always valid, and the fallback carrying each step of its own alpha
            would never be reached.
          </Section>
        </Flex>
      </Reveal>
    </Box>
  );
}

/** A gradient swatch with its shape written under it. */
function Swatch({ caption, ...boxProps }: { caption: string } & Parameters<typeof Box>[0]) {
  return (
    <Flex d="column" gap={2}>
      <Box width={40} height={28} borderRadius={2} {...boxProps} />
      <Box fontSize={12} color="slate-500">
        {caption}
      </Box>
    </Flex>
  );
}

/** A full-width gradient band, for comparing one interpolation against another. */
function Band({ caption, ...boxProps }: { caption: string } & Parameters<typeof Box>[0]) {
  return (
    <Flex d="column" gap={1}>
      <Box width={120} height={10} borderRadius={2} {...boxProps} />
      <Box fontSize={12} color="slate-500">
        {caption}
      </Box>
    </Flex>
  );
}

/** A surface that shows what a shadow layer does to it, in either theme. */
function Tile({ caption, ...boxProps }: { caption: string } & Parameters<typeof Box>[0]) {
  return (
    <Flex d="column" gap={2}>
      <Box width={28} height={18} borderRadius={3} theme={{ dark: { bgColor: 'slate-800' }, light: { bgColor: 'white' } }} {...boxProps} />
      <Box fontSize={12} color="slate-500">
        {caption}
      </Box>
    </Flex>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Box id={id}>
      <H2 fontSize={20} fontWeight={600} mb={4} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
        {title}
      </H2>
      <P fontSize={15} lineHeight={26} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
        {children}
      </P>
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

const sidebarLinks = [
  { id: 'concept', label: 'A gradient is a value' },
  { id: 'kinds', label: 'Direction, shape, angle' },
  { id: 'stops', label: 'Stops are colours' },
  { id: 'interpolate', label: 'The interpolation space' },
  { id: 'whole', label: 'Judged whole' },
  { id: 'shadows', label: 'Four shadows, one property' },
  { id: 'rings', label: 'A ring is not an outline' },
  { id: 'colors', label: 'Recolouring a layer' },
  { id: 'text', label: 'textShadow' },
  { id: 'layers', label: 'Why they are registered' },
];
