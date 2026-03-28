import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import { Link } from '../../src/components/semantics';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import usePageContext from '../hooks/usePageContext';

export default function TextStylePage() {
  usePageContext(<RightSidebar />);

  return (
    <Box>
      <PageHeader
        icon={Layers}
        title="Style Grouping"
        description="Group multiple CSS properties under a single prop, each with its own value. One prop, one class name, multiple declarations."
        badge="NEW"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code
            id="concept"
            label="The concept"
            language="jsx"
            codeOnly
            code={`// By default, a styleName array applies the SAME value to all CSS properties:
{
  styleName: ['padding-left', 'padding-right'],
  values: [2, 4, 6] as const,
  valueFormat: (value) => \`\${value / 4}rem\`,
}
// px={4} → padding-left: 1rem; padding-right: 1rem  (same value)

// With per-property valueFormat, each CSS property gets a DIFFERENT value.
// The 3rd argument to valueFormat is the current styleName being generated:
{
  styleName: ['font-size', 'font-weight', 'line-height', 'letter-spacing'],
  values: ['display-lg'] as const,
  valueFormat: (value, getVariable, styleName) => {
    // styleName is 'font-size', then 'font-weight', then 'line-height', etc.
    // Return a different value for each one.
  },
}`}
          />

          <Code
            id="generated-css"
            label="Generated CSS"
            language="jsx"
            codeOnly
            code={`// <Box textStyle="display-lg" />
// Generates a single class with four different CSS declarations:

.textStyle-display-lg {
  font-size: var(--text-display-lg-size);            /* 36px */
  font-weight: var(--text-display-lg-weight);        /* 700 */
  line-height: var(--text-display-lg-line-height);   /* 1.2 */
  letter-spacing: var(--text-display-lg-letter-spacing); /* -0.02em */
}`}
          />

          <Code
            id="full-example"
            label="Full example: typography presets"
            language="jsx"
            codeOnly
            code={`// 1. Define CSS variables for each property per variant
Box.extend(
  {
    'text-display-lg-size': '36px',
    'text-display-lg-weight': '700',
    'text-display-lg-line-height': '1.2',
    'text-display-lg-letter-spacing': '-0.02em',

    'text-display-sm-size': '28px',
    'text-display-sm-weight': '700',
    'text-display-sm-line-height': '1.25',
    'text-display-sm-letter-spacing': '-0.015em',
  },
  // 2. Create a prop with styleName array + per-property valueFormat
  {
    textStyle: [
      {
        values: ['display-lg', 'display-sm'] as const,
        styleName: ['font-size', 'font-weight', 'line-height', 'letter-spacing'],
        valueFormat: (value, getVariable, styleName) => {
          const suffixMap = {
            'font-size': 'size',
            'font-weight': 'weight',
            'line-height': 'line-height',
            'letter-spacing': 'letter-spacing',
          };
          return getVariable(\`text-\${value}-\${suffixMap[styleName]}\`);
        },
      },
    ],
  },
  {},
);`}
          />

          <Code id="display-lg" label="Live: display-lg" language="jsx">
            <Box textStyle="display-lg" theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
              The quick brown fox jumps over the lazy dog
            </Box>
          </Code>

          <Code id="display-sm" label="Live: display-sm" language="jsx">
            <Box textStyle="display-sm" theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
              The quick brown fox jumps over the lazy dog
            </Box>
          </Code>

          <Code id="composing" label="Composing with other Box props" language="jsx">
            <Flex d="column" gap={6}>
              <Box textStyle="display-lg" color="indigo-500">
                Display Large in color
              </Box>
              <Box textStyle="display-sm" color="slate-500">
                Display Small muted
              </Box>
              <Box fontSize={16} lineHeight={28} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
                Regular body text for comparison — using individual fontSize and lineHeight props. The textStyle prop above sets four CSS
                properties at once from a single value.
              </Box>
            </Flex>
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}

const sidebarLinks = [
  { id: 'concept', label: 'The concept' },
  { id: 'generated-css', label: 'Generated CSS' },
  { id: 'full-example', label: 'Full example: typography presets' },
  { id: 'display-lg', label: 'Live: display-lg' },
  { id: 'display-sm', label: 'Live: display-sm' },
  { id: 'composing', label: 'Composing with other Box props' },
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
