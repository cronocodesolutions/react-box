import { Loader2, Sparkles } from 'lucide-react';
import { ReactNode, useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import Icon from '../../src/components/icon';
import { H2 } from '../../src/components/semantics';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import Reveal from '../components/reveal';
import useTableOfContents from '../hooks/useTableOfContents';

// Registered once, at module scope, the way `Box.extend()` is: registration is free — a sequence
// reaches the stylesheet only when a rule names it, and then exactly once.
Box.keyframes({
  'docs-slide-in': {
    from: { opacity: 0, translateY: 3 },
    to: { opacity: 1, translateY: 0 },
  },
  'docs-draw': {
    from: { width: 0 },
    to: { width: 'fit' },
  },
});

export default function AnimationPage() {
  useTableOfContents(sidebarLinks);
  const [runId, setRunId] = useState(0);

  return (
    <Box>
      <PageHeader
        icon={Sparkles}
        title="Animation"
        description="Keyframes, presets and transitions as props — including the durations that stop on their own when the reader asked for less motion."
      />

      <Reveal delay={0.1}>
        <Flex d="column" gap={10}>
          <Section id="presets" title="Four presets, no registration">
            <Mono>animation</Mono> takes one of four names — the ones Tailwind ships, because everybody already knows what they do. Their{' '}
            <Mono>@keyframes</Mono> come with the engine and are written into the stylesheet the first time something asks for one, so an
            unused preset costs nothing at all.
          </Section>

          <Code id="presets-demo" label="Presets" language="jsx">
            <Flex gap={8} ai="center" flexWrap="wrap">
              <Icon size={7} color="sky-500" animation="spin">
                <Loader2 />
              </Icon>
              <Box width={10} height={10} borderRadius={2} bgColor="violet-500" animation="pulse" />
              <Box width={10} height={10} borderRadius={5} bgColor="emerald-500" animation="bounce" />
              <Box width={10} height={10} borderRadius={5} bgColor="rose-500" animation="ping" />
            </Flex>
          </Code>

          <Section id="reduced-motion" title="A preset already knows about reduced motion">
            Every preset's duration is a multiple of <Mono>--transitionTime</Mono>, the variable the base stylesheet zeroes under{' '}
            <Mono>prefers-reduced-motion</Mono> — so the four above stop on their own, with no opt-in and no media query of yours. The
            moment you name a duration in milliseconds you have left that default behind, which is the honest trade: the number you wrote
            wins, and saying when to stop is now your job.
          </Section>

          <Code id="reduced-motion-demo" label="Opting out by name" language="jsx" codeOnly>
            <Box
              animationName="docs-slide-in"
              animationDuration={600}
              animationTimingFunction="ease-out"
              motionReduce={{ animationName: 'none' }}
            />
          </Code>

          <Section id="keyframes" title="Box.keyframes(): the steps are Box props">
            A sequence is declared where component styles are, and its stops hold props rather than CSS — the same ÷4 spacing scale, the
            same colour tokens, the same composed longhands. Register it once at module scope; the name is what <Mono>animationName</Mono>{' '}
            refers to.
          </Section>

          <Code
            id="keyframes-demo"
            label="A sequence of your own"
            language="jsx"
            code={`Box.keyframes({
  'slide-in': {
    from: { opacity: 0, translateY: 3 },
    to: { opacity: 1, translateY: 0 },
  },
});

<Box animationName="slide-in" animationDuration={450} animationTimingFunction="ease-out" />`}
          >
            <Flex d="column" gap={4} ai="flex-start">
              <Flex key={runId} gap={3}>
                {[0, 1, 2].map((index) => (
                  <Box
                    key={index}
                    width={16}
                    height={16}
                    borderRadius={2}
                    bgImage="gradient-primary"
                    animationName="docs-slide-in"
                    animationDuration={450}
                    animationDelay={index * 120}
                    animationTimingFunction="ease-out"
                    animationFillMode="backwards"
                  />
                ))}
              </Flex>
              <Button variant="secondary" onClick={() => setRunId((id) => id + 1)}>
                Play again
              </Button>
            </Flex>
          </Code>

          <Section id="longhands" title="One prop per animation property">
            <Mono>animationName</Mono>, <Mono>animationDuration</Mono>, <Mono>animationDelay</Mono>, <Mono>animationIterationCount</Mono>,{' '}
            <Mono>animationDirection</Mono>, <Mono>animationFillMode</Mono>, <Mono>animationPlayState</Mono> and{' '}
            <Mono>animationTimingFunction</Mono> — declared after <Mono>animation</Mono>, so a longhand overrides whatever a preset chose.
            Times are milliseconds, like every other time in this library. The stagger above is three Boxes and one{' '}
            <Mono>animationDelay</Mono>; each distinct value is one shared class, so a hundred staggered rows generate a hundred one-line
            rules and nothing else.
          </Section>

          <Code id="playstate-demo" label="animationPlayState" language="jsx">
            <Flex
              gap={4}
              ai="center"
              p={4}
              borderRadius={2}
              theme={{ dark: { bgColor: 'slate-900' }, light: { bgColor: 'slate-50' } }}
              className="docs-marquee"
            >
              <Icon size={6} color="amber-500" animation="spin" hoverGroup={{ 'docs-marquee': { animationPlayState: 'paused' } }}>
                <Loader2 />
              </Icon>
              <Box fontSize={14}>Hover to pause</Box>
            </Flex>
          </Code>

          <Section id="transitions" title="Transitions: what changes, and how long it takes">
            Every Box transitions <Mono>all</Mono> its properties over <Mono>--transitionTime</Mono> already, which is why a{' '}
            <Mono>hover</Mono> colour fades without being asked. <Mono>transition</Mono> narrows that to a group — <Mono>colors</Mono>,{' '}
            <Mono>opacity</Mono>, <Mono>shadow</Mono>, <Mono>transform</Mono>, <Mono>size</Mono>, <Mono>filter</Mono> — and{' '}
            <Mono>transitionDuration</Mono>, <Mono>transitionDelay</Mono> and <Mono>transitionTimingFunction</Mono> say the rest. An easing
            can be a keyword or a curve: <Mono>cubic-bezier()</Mono>, <Mono>steps()</Mono> and <Mono>linear()</Mono> are values, and a typo
            in one of them emits no rule rather than a broken declaration.
          </Section>

          <Code id="transition-demo" label="Transition groups" language="jsx">
            <Flex gap={4} flexWrap="wrap">
              <Box
                px={5}
                py={3}
                borderRadius={2}
                fontSize={14}
                cursor="pointer"
                bgColor="slate-200"
                transition="colors"
                transitionDuration={300}
                hover={{ bgColor: 'indigo-500', color: 'white' }}
                theme={{ dark: { bgColor: 'slate-800', color: 'slate-200' } }}
              >
                colours only
              </Box>
              <Box
                px={5}
                py={3}
                borderRadius={2}
                fontSize={14}
                cursor="pointer"
                bgColor="slate-200"
                transition="transform"
                transitionDuration={300}
                transitionTimingFunction="cubic-bezier(0.34, 1.56, 0.64, 1)"
                hover={{ scale: 1.08 }}
                theme={{ dark: { bgColor: 'slate-800', color: 'slate-200' } }}
              >
                transform, overshooting
              </Box>
            </Flex>
          </Code>

          <Section id="transforms" title="The transform props compose">
            <Mono>translateX</Mono>, <Mono>translateY</Mono>, <Mono>rotate</Mono> and <Mono>scale</Mono> are the CSS longhands rather than
            one <Mono>transform</Mono> declaration, so setting several of them means several of them happen. The two translate axes used to
            write the same property and one silently won; each now sets its own custom property and both compose into one{' '}
            <Mono>translate</Mono> — which still transitions, because <Mono>var()</Mono> is substituted before the browser compares the two
            states. The exception worth knowing: <Mono>flip</Mono> and <Mono>scale</Mono> both write <Mono>scale</Mono>, so use one or the
            other.
          </Section>

          <Code id="transforms-demo" label="Two axes and a rotation" language="jsx">
            <Flex gap={6} p={6} flexWrap="wrap">
              <Box
                width={16}
                height={16}
                borderRadius={2}
                bgColor="sky-500"
                cursor="pointer"
                hover={{ translateX: 3, translateY: -3, rotate: 45 }}
              />
              <Box width={16} height={16} borderRadius={2} bgColor="violet-500" cursor="pointer" hover={{ scale: 1.25, rotate: -45 }} />
            </Flex>
          </Code>

          <Section id="drawing" title="A sequence can animate anything a prop can set">
            Because a stop is Box props, a sequence is not limited to the four properties an animation library would give you. This bar
            grows by animating <Mono>width</Mono> from <Mono>0</Mono> to <Mono>fit</Mono> — the size keywords work in a keyframe like they
            do anywhere else.
          </Section>

          <Code
            id="drawing-demo"
            label="Animating width"
            language="jsx"
            code={`Box.keyframes({ draw: { from: { width: 0 }, to: { width: 'fit' } } });

<Box height={2} borderRadius={1} bgImage="gradient-primary" animationName="draw" animationDuration={900} />`}
          >
            <Box width="1/2">
              <Box
                key={runId}
                height={2}
                borderRadius={1}
                bgImage="gradient-primary"
                animationName="docs-draw"
                animationDuration={900}
                animationTimingFunction="ease-in-out"
              />
            </Box>
          </Code>

          <Section id="server" title="On a server, and in a Server Component">
            A sequence is part of the stylesheet, not of a component's markup, so it travels the way every other rule does:{' '}
            <Mono>getStyles()</Mono> returns it for static output, and in element mode it rides the base <Mono>&lt;style&gt;</Mono> element
            every Box carries — which means a Server Component can animate with no client JavaScript anywhere in the page. The loading bar
            in this site's DataGrid is exactly that: <Mono>animationName</Mono> in the grid's component styles, and a sweep that starts
            before hydration.
          </Section>

          <Section id="off" title="Turning the default off">
            <Mono>transition: all</Mono> on every Box is a default, not a law. An engine can be told to narrow it to one group, or to
            declare nothing at all and leave transitions entirely to the props — useful in an app that owns its own motion system.
          </Section>

          <Code
            id="off-demo"
            label="Configuring the base transition"
            language="jsx"
            codeOnly
            code={`// Before the first render — the base block is written once.
Box.configure({ transition: 'colors' });

// Or nothing at all:
Box.configure({ transition: false });`}
          />
        </Flex>
      </Reveal>
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

const sidebarLinks = [
  { id: 'presets', label: 'Four presets' },
  { id: 'reduced-motion', label: 'Reduced motion' },
  { id: 'keyframes', label: 'Box.keyframes()' },
  { id: 'longhands', label: 'One prop per property' },
  { id: 'transitions', label: 'Transitions' },
  { id: 'transforms', label: 'Composing transforms' },
  { id: 'drawing', label: 'Animating any prop' },
  { id: 'server', label: 'On a server' },
  { id: 'off', label: 'Turning it off' },
];
