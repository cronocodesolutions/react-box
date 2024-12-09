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

// import 'prismjs/themes/prism-coy.css';
// import 'prismjs/themes/prism-dark.css';
// import 'prismjs/themes/prism-funky.css';
// import 'prismjs/themes/prism-tomorrow.css';
// import 'prismjs/themes/prism-twilight.css';
import 'prismjs/themes/prism-okaidia.css';
import Button from '../../src/components/button';
import Box, { BoxProps } from '../../src/box';
import CopySvg from '../svgs/copySvg';
import Label from '../../src/components/label';
import CheckboxSvg from '../svgs/checkboxSvg';
import Flex from '../../src/components/flex';

interface Props extends BoxProps {
  language?: 'javascript' | 'shell' | 'jsx' | 'auto';
  label?: string;
  number?: number;
  code?: string;
}

export default function Code(props: Props) {
  const { children, language = 'jsx', number, label, code, ...restProps } = props;
  const [copied, setCopied] = useState(false);

  function copyHandler() {
    navigator.clipboard.writeText(code!);

    setCopied(true);
  }

  useEffect(() => {
    copied && setTimeout(() => setCopied(false), 2000);
  }, [copied]);

  useLayoutEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <Box {...restProps}>
      <Label fontSize={22} mb={2}>
        {label}
      </Label>
      <Box shadow="small-shadow" b={1} borderColor="gray-300" borderRadius={1} overflow="hidden">
        <Box position="relative">
          {children && (
            <Box px={3} py={6}>
              {children}
            </Box>
          )}
          <Box tag="pre" className={`language-${language}`}>
            <Flex bb={1} borderColor="white" pb={3}>
              {code && (
                <Button clean cursor={copied ? 'default' : 'pointer'} onClick={() => copyHandler()}>
                  {copied ? <CheckboxSvg noFrame checked stroke="white" width="16px" /> : <CopySvg fill="white" width="16px" />}
                </Button>
              )}
            </Flex>
            <Box tag="code" className={`language-${language}`} mt={3} py={3} maxHeight={100} overflow="auto">
              {code}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
