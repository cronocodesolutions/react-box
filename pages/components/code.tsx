import { useEffect, useLayoutEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import Button from '../../src/components/button/button';
import Flex from '../../src/components/flex/flex';
import Box from '../../src/box';

interface Props {
  language: 'javascript' | 'shell' | 'auto';
  children: string;
}

export default function Code({ children, language }: Props) {
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
      <Flex jc="end" ai="center">
        {copied && <Box>✔️</Box>}
        <Button py={1} onClick={() => copyHandler()}>
          Copy
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
