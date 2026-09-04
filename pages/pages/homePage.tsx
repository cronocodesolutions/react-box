import { ArrowRight, Box as BoxIcon, Code2, Layers, Palette, Sparkles, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { version } from '../../package.json';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import Icon from '../../src/components/icon';
import Code from '../components/code';
import Reveal from '../components/reveal';
import SiGithub from '~icons/simple-icons/github';

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Flex d="column" ai="center" textAlign="center" py={12} lg={{ py: 16 }}>
        {/* Badge */}
        <Reveal>
          <Flex
            ai="center"
            gap={2}
            px={4}
            py={2}
            borderRadius={10}
            theme={{ dark: { bgColor: 'slate-800', color: 'indigo-400' }, light: { bgColor: 'indigo-50', color: 'indigo-600' } }}
            fontSize={13}
            fontWeight={500}
            mb={6}
          >
            <Sparkles size={14} />
            <Box>Version {version} is here!</Box>
          </Flex>
        </Reveal>

        {/* Title */}
        <Reveal delay={0.1}>
          <Box
            tag="h1"
            fontSize={32}
            sm={{ fontSize: 44, lineHeight: 52 }}
            lg={{ fontSize: 52, lineHeight: 60 }}
            fontWeight={800}
            lineHeight={40}
            mb={6}
            maxWidth={180}
          >
            <Box theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>Build beautiful UIs</Box>
            <Box className="gradient-text">without writing CSS</Box>
          </Box>
        </Reveal>

        {/* Description */}
        <Reveal delay={0.2}>
          <Box
            fontSize={16}
            sm={{ fontSize: 18 }}
            theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}
            maxWidth={140}
            lineHeight={28}
            mb={10}
          >
            A utility-first React component library with type-safe props that map directly to CSS. Build faster, ship sooner.
          </Box>
        </Reveal>

        {/* CTA Buttons */}
        <Reveal delay={0.3}>
          <Flex gap={4} d="column" sm={{ d: 'row' }}>
            <NavLink to="/installation">
              <Button px={6} py={3} fontSize={15}>
                <Flex ai="center" gap={2}>
                  Get Started
                  <ArrowRight size={18} />
                </Flex>
              </Button>
            </NavLink>
            <a href="https://github.com/box-kite/box-kite" target="_blank" rel="noopener noreferrer">
              <Button
                variant="secondary"
                px={6}
                py={3}
                fontSize={15}
                theme={{ dark: { color: 'slate-300' }, light: { color: 'slate-700' } }}
              >
                <Flex ai="center" gap={2}>
                  <Icon size={4.5}>
                    <SiGithub />
                  </Icon>
                  View on GitHub
                </Flex>
              </Button>
            </a>
          </Flex>
        </Reveal>
      </Flex>

      {/* Feature Cards */}
      <Reveal y={40} delay={0.4}>
        <Flex flexWrap="wrap" gap={5} py={10} d="column">
          <FeatureCard
            icon={<Zap size={22} />}
            title="Generated Once, Shared"
            description="Each prop value becomes one atomic class the first time it is used, then every component reuses it."
          />
          <FeatureCard
            icon={<BoxIcon size={22} />}
            title="Type-Safe Props"
            description="Full TypeScript support with autocompletion for all CSS properties and values."
          />
          <FeatureCard
            icon={<Palette size={22} />}
            title="Beautiful Defaults"
            description="Pre-built component styles with variants. Customize everything or use as-is."
          />
          <FeatureCard
            icon={<Layers size={22} />}
            title="Composable"
            description="Build complex UIs by composing simple components. Props merge in order, so there is no specificity to reason about."
          />
          <FeatureCard
            icon={<Code2 size={22} />}
            title="Prop Shortcuts"
            description="Use p for padding, m for margin, jc for justify-content, and more."
          />
          <FeatureCard
            icon={<Sparkles size={22} />}
            title="Responsive"
            description="Built-in breakpoints: sm, md, lg, xl, xxl. Mobile-first by default."
          />
        </Flex>
      </Reveal>

      {/* Quick Start Section */}
      <Reveal y={40} delay={0.6}>
        <Box py={12}>
          <Box textAlign="center" mb={10}>
            <Box
              tag="h2"
              fontSize={24}
              sm={{ fontSize: 32 }}
              fontWeight={700}
              theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}
              mb={4}
            >
              Get started in seconds
            </Box>
            <Box fontSize={16} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
              Install the package and start building beautiful interfaces immediately.
            </Box>
          </Box>

          <Flex d="column" gap={6} maxWidth={170} mx="auto">
            <Code label="1. Install the package" language="shell" code="npm install @box-kite/react" />

            <Code
              label="2. Import and use"
              language="jsx"
              code={`import Box from '@box-kite/react';

function App() {
  return (
    <Box p={4} bgColor="indigo-500" color="white" borderRadius={2}>
      Hello, Box Kite!
    </Box>
  );
}`}
            />

            <Code
              label="3. Add responsive styles"
              language="jsx"
              code={`import Flex from '@box-kite/react/components/flex';

<Flex
  p={4}
  d="column"
  gap={4}
  sm={{ p: 6, d: 'row' }}
  lg={{ p: 8 }}
>
  <Box flex1>Left</Box>
  <Box flex1>Right</Box>
</Flex>`}
            />
          </Flex>
        </Box>
      </Reveal>

      {/* Bottom CTA */}
      <Reveal y={40} delay={0.8}>
        <Flex
          d="column"
          ai="center"
          textAlign="center"
          py={12}
          px={6}
          theme={{ dark: { bgImage: 'gradient-hero-dark' }, light: { bgImage: 'gradient-hero' } }}
          borderRadius={4}
          mb={8}
        >
          <Box
            tag="h2"
            fontSize={24}
            sm={{ fontSize: 28 }}
            fontWeight={700}
            theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}
            mb={4}
          >
            Ready to build something amazing?
          </Box>
          <Box fontSize={16} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }} mb={8} maxWidth={130}>
            Join developers who are building faster with Box Kite.
          </Box>
          <NavLink to="/installation">
            <Button px={8} py={4} fontSize={15}>
              <Flex ai="center" gap={2}>
                Start Building
                <ArrowRight size={18} />
              </Flex>
            </Button>
          </NavLink>
        </Flex>
      </Reveal>
    </Box>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Box hover={{ translateY: -1 }} transition="transform" transitionDuration={200}>
      <Box
        p={5}
        theme={{
          dark: { bgColor: 'slate-800', borderColor: 'slate-700' },
          light: { bgColor: 'white', borderColor: 'slate-200' },
        }}
        b={1}
        borderRadius={3}
        height="fit"
        transitionDuration={200}
      >
        <Box width={11} height={11} display="flex" ai="center" jc="center" bgImage="gradient-primary" borderRadius={2} color="white" mb={4}>
          {icon}
        </Box>
        <Box fontSize={17} fontWeight={600} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }} mb={2}>
          {title}
        </Box>
        <Box fontSize={14} lineHeight={22} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
          {description}
        </Box>
      </Box>
    </Box>
  );
}
