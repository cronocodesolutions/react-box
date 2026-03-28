import { motion } from 'framer-motion';
import { TextCursor } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import { Link } from '../../src/components/semantics';
import Textbox from '../../src/components/textbox';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import usePageContext from '../hooks/usePageContext';

export default function TextboxPage() {
  usePageContext(<RightSidebar />);

  return (
    <Box>
      <PageHeader
        icon={TextCursor}
        title="Textbox"
        description="Input component for collecting user data with support for various states and customization."
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Textbox from '@cronocode/react-box/components/textbox';" />

          <Code id="basic" label="Basic Textbox" language="jsx" code='<Textbox placeholder="Enter your name..." />'>
            <Textbox placeholder="Enter your name..." theme={{ dark: { bgColor: 'slate-800', color: 'white' } }} />
          </Code>

          <Code
            id="label"
            label="With Label"
            language="jsx"
            code={`<Flex d="column" gap={2}>
  <Box tag="label" fontSize={14} fontWeight={500}>
    Email address
  </Box>
  <Textbox placeholder="you@example.com" />
</Flex>`}
          >
            <Flex d="column" gap={2} maxWidth={80}>
              <Box tag="label" fontSize={14} fontWeight={500} theme={{ dark: { color: 'slate-200' }, light: { color: 'slate-700' } }}>
                Email address
              </Box>
              <Textbox placeholder="you@example.com" theme={{ dark: { bgColor: 'slate-800', color: 'white' } }} />
            </Flex>
          </Code>

          <Code
            id="states"
            label="States"
            language="jsx"
            code={`<Textbox placeholder="Default" />
<Textbox placeholder="Focused" />
<Textbox disabled defaultValue="Disabled" />`}
          >
            <Flex gap={4} flexWrap="wrap">
              <Textbox placeholder="Default" theme={{ dark: { bgColor: 'slate-800', color: 'white' } }} />
              <Textbox disabled defaultValue="Disabled" />
            </Flex>
          </Code>

          <Code
            id="sizes"
            label="Sizes"
            language="jsx"
            code={`<Textbox py={2} px={3} fontSize={13} placeholder="Small" />
<Textbox placeholder="Default" />
<Textbox py={4} px={5} fontSize={16} placeholder="Large" />`}
          >
            <Flex gap={4} ai="center" flexWrap="wrap">
              <Textbox py={2} px={3} fontSize={13} placeholder="Small" theme={{ dark: { bgColor: 'slate-800', color: 'white' } }} />
              <Textbox placeholder="Default" theme={{ dark: { bgColor: 'slate-800', color: 'white' } }} />
              <Textbox py={4} px={5} fontSize={16} placeholder="Large" theme={{ dark: { bgColor: 'slate-800', color: 'white' } }} />
            </Flex>
          </Code>

          <Code
            id="custom"
            label="Custom Styling"
            language="jsx"
            code={`<Textbox
  borderColor="indigo-300"
  focus={{ borderColor: 'indigo-500', outlineColor: 'indigo-200' }}
  placeholder="Custom focus color"
/>`}
          >
            <Textbox
              borderColor="indigo-300"
              focus={{ borderColor: 'indigo-500', outlineColor: 'indigo-200' }}
              placeholder="Custom focus color"
              theme={{ dark: { bgColor: 'slate-800', color: 'white' } }}
            />
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}

const sidebarLinks = [
  { id: 'basic', label: 'Basic Textbox' },
  { id: 'label', label: 'With Label' },
  { id: 'states', label: 'States' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'custom', label: 'Custom Styling' },
] as const;

function RightSidebar() {
  return (
    <Flex d="column" gap={1} pt={10}>
      {sidebarLinks.map((link) => (
        <Link
          key={link.id}
          props={{ href: `#${link.id}` }}
          fontSize={13}
          py={1}
          px={2}
          borderRadius={1}
          textDecoration="none"
          theme={{
            dark: { color: 'slate-400', hover: { color: 'white', bgColor: 'slate-800' } },
            light: { color: 'slate-600', hover: { color: 'slate-900', bgColor: 'slate-100' } },
          }}
        >
          {link.label}
        </Link>
      ))}
    </Flex>
  );
}
