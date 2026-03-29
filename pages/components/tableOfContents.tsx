import Box from '../../src/box';
import Flex from '../../src/components/flex';
import { Link } from '../../src/components/semantics';
import type { TocEntry } from '../pageContext';

export default function TableOfContents({ entries }: { entries: TocEntry[] }) {
  return (
    <Flex d="column" gap={1} pt={10}>
      {entries.map((entry) =>
        'section' in entry ? (
          <Box
            key={entry.label}
            fontSize={11}
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing={1}
            mt={4}
            mb={1}
            theme={{ dark: { color: 'slate-500' }, light: { color: 'slate-400' } }}
          >
            {entry.label}
          </Box>
        ) : (
          <Link
            key={entry.id}
            props={{ href: `#${entry.id}` }}
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
            {entry.label}
          </Link>
        ),
      )}
    </Flex>
  );
}
