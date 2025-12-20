import { motion } from 'framer-motion';
import { ArrowRight, Box as BoxIcon, Code2, Layers, Palette, Sparkles, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import Code from '../components/code';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <motion.div initial="initial" animate="animate" variants={staggerContainer}>
        <Flex d="column" ai="center" textAlign="center" py={12} lg={{ py: 16 }}>
          {/* Badge */}
          <motion.div variants={fadeInUp}>
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
              <Box>Version 3.1.3 is here!</Box>
            </Flex>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeInUp}>
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
          </motion.div>

          {/* Description */}
          <motion.div variants={fadeInUp}>
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
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp}>
            <Flex gap={4} d="column" sm={{ d: 'row' }}>
              <NavLink to="/installation">
                <Button px={6} py={3} fontSize={15}>
                  <Flex ai="center" gap={2}>
                    Get Started
                    <ArrowRight size={18} />
                  </Flex>
                </Button>
              </NavLink>
              <a href="https://github.com/cronocodesolutions/react-box" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="secondary"
                  px={6}
                  py={3}
                  fontSize={15}
                  theme={{ dark: { color: 'slate-300' }, light: { color: 'slate-700' } }}
                >
                  <Flex ai="center" gap={2}>
                    <Code2 size={18} />
                    View on GitHub
                  </Flex>
                </Button>
              </a>
            </Flex>
          </motion.div>
        </Flex>
      </motion.div>

      {/* Feature Cards */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Flex flexWrap="wrap" gap={5} py={10} d="column">
          <FeatureCard
            icon={<Zap size={22} />}
            title="Lightning Fast"
            description="Zero runtime overhead. Styles are generated once and cached for optimal performance."
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
            description="Build complex UIs by composing simple components. No CSS conflicts, ever."
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
      </motion.div>

      {/* Quick Start Section */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
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
            <Code label="1. Install the package" language="shell" code="npm install @cronocode/react-box" />

            <Code
              label="2. Import and use"
              language="jsx"
              code={`import Box from '@cronocode/react-box';

function App() {
  return (
    <Box p={4} bgColor="indigo-500" color="white" borderRadius={2}>
      Hello, React Box!
    </Box>
  );
}`}
            />

            <Code
              label="3. Add responsive styles"
              language="jsx"
              code={`<Box
  p={4}
  sm={{ p: 6 }}
  lg={{ p: 8 }}
  display="flex"
  d="column"
  sm={{ d: "row" }}
  gap={4}
>
  <Box flex1>Left</Box>
  <Box flex1>Right</Box>
</Box>`}
            />
          </Flex>
        </Box>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
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
            Join developers who are building faster with React Box.
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
      </motion.div>
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
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Box
        p={5}
        theme={{
          dark: { bgColor: 'slate-800', borderColor: 'slate-700' },
          light: { bgColor: 'white', borderColor: 'slate-200' },
        }}
        b={1}
        borderRadius={3}
        height="fit"
        transition="all"
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
    </motion.div>
  );
}
