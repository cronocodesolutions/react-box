import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import Box from '../../src/box';
import Checkbox from '../../src/components/checkbox';
import Flex from '../../src/components/flex';
import { Link } from '../../src/components/semantics';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import usePageContext from '../hooks/usePageContext';

export default function CheckboxPage() {
  usePageContext(<RightSidebar />);

  return (
    <Box>
      <PageHeader icon={CheckSquare} title="Checkbox" description="Use Checkbox component to turn an option on or off." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Checkbox from '@cronocode/react-box/components/checkbox';" />

          <Code id="basic" label="Basic Checkbox" language="jsx">
            <Checkbox defaultChecked />
          </Code>

          <Code id="clean" label="Clean Checkbox" language="jsx">
            <Checkbox clean defaultChecked />
          </Code>

          <Code id="disabled" label="Disabled Checkbox" language="jsx">
            <Checkbox disabled defaultChecked />
          </Code>

          <Code id="indeterminate" label="Indeterminate Checkbox" language="jsx">
            <Checkbox indeterminate />
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}

const sidebarLinks = [
  { id: 'basic', label: 'Basic Checkbox' },
  { id: 'clean', label: 'Clean Checkbox' },
  { id: 'disabled', label: 'Disabled Checkbox' },
  { id: 'indeterminate', label: 'Indeterminate Checkbox' },
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
