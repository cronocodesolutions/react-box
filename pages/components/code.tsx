import { useEffect, useLayoutEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
// import 'prismjs/components/prism-css';
// import 'prismjs/components/prism-csv';
// import 'prismjs/components/prism-docker';
// import 'prismjs/components/prism-git';
// import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
// import 'prismjs/components/prism-markdown';
// import 'prismjs/components/prism-markup';
// import 'prismjs/components/prism-mongodb';
// import 'prismjs/components/prism-python';
// import 'prismjs/components/prism-regex';
// import 'prismjs/components/prism-sql';
// import 'prismjs/components/prism-typescript';
// import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-okaidia.css';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import Box from '../../src/box';
import CopySvg from '../svgs/copySvg';

interface Props {
  language?: 'javascript' | 'shell' | 'jsx' | 'auto';
  children: string;
  label?: string;
  number?: number;
}

export default function Code({ children, language = 'jsx', number, label }: Props) {
  const [copied, setCopied] = useState(false);

  function copyHandler() {
    navigator.clipboard.writeText(children);

    setCopied(true);
  }

  useEffect(() => {
    copied && setTimeout(() => setCopied(false), 2000);
  }, [copied]);

  useLayoutEffect(() => {
    Prism.highlightAll();
  }, [children]);

  return (
    <Box>
      <Flex jc="space-between" ai="center" position="relative">
        <Flex ai="center" gap={2}>
          {number && <Box component="number">{number}</Box>}
          {label && <Box>{label}</Box>}
        </Flex>

        <Button clean cursor="pointer" position="absolute" right={0} bottom={1} onClick={() => copyHandler()}>
          {copied ? <Box>✔️</Box> : <CopySvg width="16px" />}
        </Button>
      </Flex>

      <Box tag="pre">
        <Box mt={1} tag="code" className={`language-${language}`}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
