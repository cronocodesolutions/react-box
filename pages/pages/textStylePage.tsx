import { motion } from 'framer-motion';
import { Type } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function TextStylePage() {
  return (
    <Box>
      <PageHeader
        icon={Type}
        title="Text Style"
        description="One prop, multiple CSS properties with different values. Define typography presets using valueFormat with per-property resolution."
        badge="NEW"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code
            label="Define text style variables and prop"
            language="jsx"
            codeOnly
            code={`// extends.ts
Box.extend(
  {
    // Display Large
    'text-display-lg-size': '36px',
    'text-display-lg-weight': '700',
    'text-display-lg-line-height': '1.2',
    'text-display-lg-letter-spacing': '-0.02em',

    // Display Small
    'text-display-sm-size': '28px',
    'text-display-sm-weight': '700',
    'text-display-sm-line-height': '1.25',
    'text-display-sm-letter-spacing': '-0.015em',
  },
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

          <Code label="Display Large" language="jsx">
            <Box textStyle="display-lg" theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
              The quick brown fox jumps over the lazy dog
            </Box>
          </Code>

          <Code label="Display Small" language="jsx">
            <Box textStyle="display-sm" theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
              The quick brown fox jumps over the lazy dog
            </Box>
          </Code>

          <Code label="Combined with other props" language="jsx">
            <Flex d="column" gap={6}>
              <Box textStyle="display-lg" color="indigo-500">
                Heading with color
              </Box>
              <Box textStyle="display-sm" color="slate-500">
                Subheading with muted color
              </Box>
              <Box fontSize={16} lineHeight={28} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
                Regular body text using standard fontSize and lineHeight props for comparison. The textStyle prop sets font-size,
                font-weight, line-height, and letter-spacing all at once from CSS variables.
              </Box>
            </Flex>
          </Code>

          <Code
            label="How it works"
            language="jsx"
            codeOnly
            code={`// One prop generates four CSS properties with different values:
<Box textStyle="display-lg" />

// Generated CSS:
// .textStyle-display-lg {
//   font-size: var(--text-display-lg-size);          /* 36px */
//   font-weight: var(--text-display-lg-weight);      /* 700 */
//   line-height: var(--text-display-lg-line-height);  /* 1.2 */
//   letter-spacing: var(--text-display-lg-letter-spacing); /* -0.02em */
// }

// The key: valueFormat receives the current styleName as the 3rd argument,
// so it can return a different value for each CSS property.`}
          />
        </Flex>
      </motion.div>
    </Box>
  );
}
