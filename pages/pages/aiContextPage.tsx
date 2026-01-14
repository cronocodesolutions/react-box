import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Code2, FileText, Lightbulb, MessageSquare, Rocket, Sparkles, Zap } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function AiContextPage() {
  return (
    <Box>
      <PageHeader
        icon={Bot}
        title="AI Assistant Context"
        description="Supercharge your AI coding assistant with deep knowledge of React Box. Just share one file and watch the magic happen."
      />

      {/* Hero Message */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex
          d="column"
          ai="center"
          textAlign="center"
          py={10}
          px={6}
          mb={10}
          theme={{ dark: { bgImage: 'gradient-hero-dark' }, light: { bgImage: 'gradient-hero' } }}
          borderRadius={4}
        >
          <Flex ai="center" gap={3} mb={4}>
            <Box fontSize={40}>
              <Sparkles size={40} color="#a78bfa" />
            </Box>
          </Flex>
          <Box
            tag="h2"
            fontSize={24}
            sm={{ fontSize: 28 }}
            fontWeight={700}
            theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}
            mb={4}
          >
            One file. Infinite possibilities.
          </Box>
          <Box fontSize={16} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }} maxWidth={140} lineHeight={26}>
            The BOX_AI_CONTEXT.md file contains everything an AI assistant needs to write perfect React Box code. No more guessing, no more
            mistakes.
          </Box>
        </Flex>
      </motion.div>

      {/* Why This Matters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Box mb={12}>
          <Box tag="h3" fontSize={20} fontWeight={600} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }} mb={6}>
            Why does this matter?
          </Box>
          <Flex d="column" gap={4}>
            <ReasonCard
              icon={<Zap size={20} />}
              title="AI assistants don't know your library"
              description="Without context, AI tools make mistakes. They might use wrong prop names, incorrect values, or miss important patterns. BOX_AI_CONTEXT.md fixes this."
            />
            <ReasonCard
              icon={<Lightbulb size={20} />}
              title="Teaching is faster than fixing"
              description="Instead of correcting AI mistakes over and over, give it the knowledge upfront. One-time setup, permanent improvement."
            />
            <ReasonCard
              icon={<Rocket size={20} />}
              title="Write code 10x faster"
              description="When your AI assistant truly understands React Box, it generates production-ready code on the first try. Every time."
            />
          </Flex>
        </Box>
      </motion.div>

      {/* How to Use - Highlighted Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Box
          mb={12}
          p={6}
          borderRadius={4}
          theme={{
            dark: { bgImage: 'gradient-hero-dark', borderColor: 'indigo-800' },
            light: { bgImage: 'gradient-hero', borderColor: 'indigo-200' },
          }}
          b={2}
        >
          <Flex ai="center" gap={3} mb={6}>
            <Box width={10} height={10} display="flex" ai="center" jc="center" bgImage="gradient-primary" borderRadius={2} color="white">
              <Rocket size={20} />
            </Box>
            <Box>
              <Box tag="h3" fontSize={22} fontWeight={700} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
                How to use it
              </Box>
              <Box fontSize={14} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
                3 simple steps to supercharge your AI
              </Box>
            </Box>
          </Flex>

          <Flex d="column" gap={6}>
            <StepCard
              step={1}
              title="Get the context file"
              description="The BOX_AI_CONTEXT.md file is included in the package. Find it in node_modules/@cronocode/react-box/BOX_AI_CONTEXT.md or copy it to your project root."
            >
              <Code language="shell" code="cp node_modules/@cronocode/react-box/BOX_AI_CONTEXT.md ./BOX_AI_CONTEXT.md" />
            </StepCard>

            <StepCard
              step={2}
              title="Share it with your AI assistant"
              description="Simply reference the file in your conversation. Most AI coding tools support file references."
            >
              <Flex d="column" gap={4}>
                <ToolExample
                  tool="Claude Code / Cursor"
                  example='Just type @BOX_AI_CONTEXT.md in your prompt or say "Read the BOX_AI_CONTEXT.md file"'
                />
                <ToolExample tool="GitHub Copilot Chat" example="Attach the file to your conversation or paste the content" />
                <ToolExample tool="ChatGPT / Claude Web" example="Copy and paste the file content into your first message" />
              </Flex>
            </StepCard>

            <StepCard
              step={3}
              title="Start coding"
              description="Your AI assistant now understands React Box deeply. Just describe what you want to build."
            >
              <Box
                p={4}
                borderRadius={2}
                theme={{
                  dark: { bgColor: 'slate-800', borderColor: 'slate-700' },
                  light: { bgColor: 'slate-50', borderColor: 'slate-200' },
                }}
                b={1}
              >
                <Box fontSize={14} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }} mb={3}>
                  Example prompt:
                </Box>
                <Box
                  fontSize={15}
                  lineHeight={24}
                  theme={{ dark: { color: 'slate-200' }, light: { color: 'slate-800' } }}
                  fontStyle="italic"
                >
                  "Create a responsive card component with a header, body, and footer. It should have a subtle shadow, rounded corners, and
                  look good in both light and dark themes."
                </Box>
              </Box>
            </StepCard>
          </Flex>
        </Box>
      </motion.div>

      {/* What's Inside */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Box mb={12}>
          <Box tag="h3" fontSize={20} fontWeight={600} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }} mb={6}>
            What's inside BOX_AI_CONTEXT.md?
          </Box>

          <Flex d="column" gap={3}>
            <FeatureItem
              icon={<Code2 size={18} />}
              title="Complete prop reference"
              description="All 144+ props with their CSS mappings and accepted values"
            />
            <FeatureItem
              icon={<Zap size={18} />}
              title="Critical gotchas"
              description="Like fontSize using divider 16 (not 4) - saves hours of debugging"
            />
            <FeatureItem
              icon={<FileText size={18} />}
              title="Component catalog"
              description="All pre-built components: Flex, Grid, Button, Textbox, and more"
            />
            <FeatureItem
              icon={<Sparkles size={18} />}
              title="Theme system"
              description="How to create light/dark themes with nested pseudo-classes"
            />
            <FeatureItem
              icon={<MessageSquare size={18} />}
              title="Common patterns"
              description="Ready-to-use code snippets for cards, layouts, forms"
            />
            <FeatureItem icon={<Bot size={18} />} title="Extension system" description="How to add custom colors, props, and components" />
          </Flex>
        </Box>
      </motion.div>

      {/* Pro Tip */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Flex
          gap={4}
          p={5}
          mb={10}
          theme={{
            dark: { bgColor: 'indigo-950', borderColor: 'indigo-800' },
            light: { bgColor: 'indigo-50', borderColor: 'indigo-200' },
          }}
          b={1}
          borderRadius={3}
        >
          <Box flexShrink={0}>
            <Box width={10} height={10} display="flex" ai="center" jc="center" bgImage="gradient-primary" borderRadius={2} color="white">
              <Lightbulb size={20} />
            </Box>
          </Box>
          <Box>
            <Box fontSize={16} fontWeight={600} theme={{ dark: { color: 'indigo-200' }, light: { color: 'indigo-900' } }} mb={2}>
              Pro tip: Keep it in your project root
            </Box>
            <Box fontSize={14} lineHeight={22} theme={{ dark: { color: 'indigo-300' }, light: { color: 'indigo-700' } }}>
              Copy BOX_AI_CONTEXT.md to your project root. This way, AI tools like Cursor and Claude Code will automatically include it in
              their context when you work on your project. No need to reference it every time!
            </Box>
          </Box>
        </Flex>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Flex
          d="column"
          ai="center"
          textAlign="center"
          py={10}
          px={6}
          theme={{ dark: { bgImage: 'gradient-hero-dark' }, light: { bgImage: 'gradient-hero' } }}
          borderRadius={4}
        >
          <Box width={14} height={14} display="flex" ai="center" jc="center" bgColor="emerald-500" borderRadius={10} color="white" mb={5}>
            <CheckCircle2 size={28} />
          </Box>
          <Box tag="h3" fontSize={22} fontWeight={700} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }} mb={3}>
            That's it. Seriously.
          </Box>
          <Box fontSize={15} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }} maxWidth={120} lineHeight={24}>
            Your AI assistant is now a React Box expert. Go build something amazing.
          </Box>
        </Flex>
      </motion.div>
    </Box>
  );
}

interface ReasonCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ReasonCard({ icon, title, description }: ReasonCardProps) {
  return (
    <Flex
      gap={4}
      p={4}
      theme={{
        dark: { bgColor: 'slate-800', borderColor: 'slate-700' },
        light: { bgColor: 'white', borderColor: 'slate-200' },
      }}
      b={1}
      borderRadius={2}
    >
      <Box flexShrink={0}>
        <Box width={10} height={10} display="flex" ai="center" jc="center" bgImage="gradient-primary" borderRadius={2} color="white">
          {icon}
        </Box>
      </Box>
      <Box>
        <Box fontSize={15} fontWeight={600} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }} mb={1}>
          {title}
        </Box>
        <Box fontSize={14} lineHeight={22} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
          {description}
        </Box>
      </Box>
    </Flex>
  );
}

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

function StepCard({ step, title, description, children }: StepCardProps) {
  return (
    <Box
      p={5}
      theme={{
        dark: { bgColor: 'slate-800', borderColor: 'slate-700' },
        light: { bgColor: 'white', borderColor: 'slate-200' },
      }}
      b={1}
      borderRadius={3}
    >
      <Flex ai="center" gap={3} mb={3}>
        <Box
          width={8}
          height={8}
          display="flex"
          ai="center"
          jc="center"
          bgImage="gradient-primary"
          borderRadius={10}
          color="white"
          fontSize={14}
          fontWeight={700}
        >
          {step}
        </Box>
        <Box fontSize={17} fontWeight={600} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
          {title}
        </Box>
      </Flex>
      <Box fontSize={14} lineHeight={22} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }} mb={4}>
        {description}
      </Box>
      {children}
    </Box>
  );
}

interface ToolExampleProps {
  tool: string;
  example: string;
}

function ToolExample({ tool, example }: ToolExampleProps) {
  return (
    <Box
      p={3}
      borderRadius={2}
      theme={{
        dark: { bgColor: 'slate-900', borderColor: 'slate-700' },
        light: { bgColor: 'slate-50', borderColor: 'slate-200' },
      }}
      b={1}
    >
      <Box
        tag="span"
        display="inline-block"
        px={2}
        py={0.5}
        borderRadius={1}
        fontSize={12}
        fontWeight={600}
        bgImage="gradient-primary"
        color="white"
        mb={2}
      >
        {tool}
      </Box>
      <Box fontSize={14} theme={{ dark: { color: 'slate-300' }, light: { color: 'slate-700' } }}>
        {example}
      </Box>
    </Box>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <Flex
      ai="center"
      gap={4}
      py={3}
      px={4}
      theme={{
        dark: { bgColor: 'slate-800', borderColor: 'slate-700' },
        light: { bgColor: 'white', borderColor: 'slate-200' },
      }}
      b={1}
      borderRadius={2}
    >
      <Box theme={{ dark: { color: 'indigo-400' }, light: { color: 'indigo-500' } }} flexShrink={0}>
        {icon}
      </Box>
      <Box>
        <Flex ai="center" gap={2} flexWrap="wrap">
          <Box fontSize={14} fontWeight={600} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
            {title}
          </Box>
          <Box fontSize={13} theme={{ dark: { color: 'slate-500' }, light: { color: 'slate-500' } }}>
            {description}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
