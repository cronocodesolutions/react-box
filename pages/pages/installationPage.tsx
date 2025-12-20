import { motion } from 'framer-motion';
import { CheckCircle2, Download, Package, Rocket } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function InstallationPage() {
  return (
    <Box>
      <PageHeader
        icon={Download}
        title="Installation"
        description="Get started with React Box in your project. Installation takes less than a minute."
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code language="shell" label="Install via npm" code="npm install @cronocode/react-box" />

          <Code language="shell" label="Or with yarn" code="yarn add @cronocode/react-box" />

          <Code language="shell" label="Or with pnpm" code="pnpm add @cronocode/react-box" />
        </Flex>
      </motion.div>

      {/* Success Message */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Flex
          d="column"
          ai="center"
          textAlign="center"
          py={12}
          mt={12}
          theme={{ dark: { bgImage: 'gradient-hero-dark' }, light: { bgImage: 'gradient-hero' } }}
          borderRadius={4}
        >
          <Box
            width={16}
            height={16}
            display="flex"
            ai="center"
            jc="center"
            bgColor="emerald-500"
            borderRadius={10}
            color="white"
            mb={6}
          >
            <CheckCircle2 size={32} />
          </Box>
          <Box tag="h2" fontSize={28} fontWeight={700} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }} mb={3}>
            That's it!
          </Box>
          <Box fontSize={16} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }} maxWidth={120}>
            You're ready to start building beautiful interfaces.
          </Box>
        </Flex>
      </motion.div>

      {/* Next Steps */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Box mt={12}>
          <Box tag="h3" fontSize={20} fontWeight={600} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }} mb={6}>
            Next Steps
          </Box>
          <Flex d="column" gap={4}>
            <StepCard icon={<Package size={20} />} title="Import Box" description="Import the Box component and start using it in your JSX." />
            <StepCard
              icon={<Rocket size={20} />}
              title="Explore Components"
              description="Check out pre-built components like Button, Textbox, and more."
            />
          </Flex>
        </Box>
      </motion.div>
    </Box>
  );
}

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function StepCard({ icon, title, description }: StepCardProps) {
  return (
    <Flex
      ai="center"
      gap={4}
      p={4}
      theme={{
        dark: { bgColor: 'slate-800', borderColor: 'slate-700', hover: { borderColor: 'indigo-500' } },
        light: { bgColor: 'white', borderColor: 'slate-200', hover: { borderColor: 'indigo-200' } },
      }}
      b={1}
      borderRadius={2}
      transition="all"
      transitionDuration={150}
    >
      <Box
        width={10}
        height={10}
        display="flex"
        ai="center"
        jc="center"
        bgImage="gradient-primary"
        borderRadius={2}
        color="white"
        flexShrink={0}
      >
        {icon}
      </Box>
      <Box>
        <Box fontSize={15} fontWeight={600} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }} mb={1}>
          {title}
        </Box>
        <Box fontSize={14} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
          {description}
        </Box>
      </Box>
    </Flex>
  );
}
