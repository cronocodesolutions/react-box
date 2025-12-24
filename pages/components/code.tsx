import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Terminal } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism-okaidia.css';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import Box, { BoxProps } from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import reactToJsx from '../utils/reactToJsx';

interface Props extends BoxProps {
  language?: 'javascript' | 'shell' | 'jsx' | 'auto';
  label?: string;
  /** Optional explicit code string. If not provided, children will be converted to JSX string. */
  code?: string;
  /** If true, only show code block without rendering the children demo */
  codeOnly?: boolean;
}

export default function Code(props: Props) {
  const { children, language = 'jsx', label, code: codeProp, codeOnly, ...restProps } = props;
  const [copied, setCopied] = useState(false);

  // Convert children to JSX string if no explicit code prop
  const code = useMemo(() => {
    if (codeProp) return codeProp;
    if (!children) return '';
    return reactToJsx(children as React.ReactNode);
  }, [codeProp, children]);

  function copyHandler() {
    navigator.clipboard.writeText(code);
    setCopied(true);
  }

  useEffect(() => {
    copied && setTimeout(() => setCopied(false), 2000);
  }, [copied]);

  useLayoutEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const isShell = language === 'shell';

  return (
    <Box {...restProps}>
      {label && (
        <Box fontSize={15} fontWeight={600} theme={{ dark: { color: 'slate-200' }, light: { color: 'slate-700' } }} mb={3}>
          {label}
        </Box>
      )}
      <Box
        shadow="large"
        borderRadius={3}
        overflow="hidden"
        b={1}
        theme={{ dark: { borderColor: 'slate-700' }, light: { borderColor: 'slate-200' } }}
      >
        {/* Demo Area */}
        {children && !codeOnly && (
          <Box
            p={6}
            theme={{ dark: { bgColor: 'slate-900', borderColor: 'slate-700' }, light: { bgColor: 'slate-50', borderColor: 'slate-200' } }}
            bb={1}
          >
            {children}
          </Box>
        )}

        {/* Code Block */}
        <Box position="relative" bgColor="code-bg">
          {/* Header */}
          <Flex ai="center" jc="space-between" px={4} py={3} bb={1} borderColor="slate-700" bgColor="code-bg-light">
            <Flex ai="center" gap={2} color="slate-400" fontSize={12}>
              {isShell ? <Terminal size={14} /> : <Box width={3} height={3} borderRadius={10} bgColor="emerald-500" />}
              <Box>{isShell ? 'Terminal' : language.toUpperCase()}</Box>
            </Flex>

            {code && (
              <Button
                clean
                p={2}
                px={3}
                borderRadius={2}
                bgColor={copied ? 'emerald-500' : 'slate-700'}
                color={copied ? 'white' : 'slate-300'}
                hover={{ bgColor: copied ? 'emerald-500' : 'slate-600' }}
                cursor={copied ? 'default' : 'pointer'}
                onClick={() => !copied && copyHandler()}
                transition="all"
                transitionDuration={150}
              >
                <Flex ai="center" gap={2} fontSize={12}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={copied ? 'check' : 'copy'}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.1 }}
                      style={{ height: '14px' }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </motion.div>
                  </AnimatePresence>
                  {copied ? 'Copied!' : 'Copy'}
                </Flex>
              </Button>
            )}
          </Flex>

          {/* Code Content */}
          <Box tag="pre" className={`language-${language}`} m={0}>
            <Box
              tag="code"
              className={`language-${language}`}
              display="block"
              p={4}
              maxHeight={100}
              overflow="auto"
              fontSize={13}
              lineHeight={24}
            >
              {code}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
