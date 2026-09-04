'use client';
import Box from '@box-kite/react';
import Button from '@box-kite/react/components/button';
import Flex from '@box-kite/react/components/flex';
import { useState } from 'react';
import './elementMode';

/**
 * A client island in the middle of a server-rendered page. It uses `Flex` and `Button` — the
 * pre-built components, which are client components — and its CSS is in the server-rendered HTML
 * anyway, because `./elementMode` switched this bundle's Box to the same emission path the server
 * used. Same props, same content-hashed class names, so hydration finds what it expects.
 */
export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Flex d="column" gap={4} p={6} borderRadius={3} b={1} borderColor="sky-500" theme={{ dark: { borderColor: 'sky-500' } }} md={{ p: 8 }}>
      <Box tag="h2" fontSize={18} fontWeight={600}>
        A client island, styled the same way
      </Box>
      <Flex ai="center" gap={4}>
        <Button
          px={4}
          py={2}
          borderRadius={2}
          bgColor="sky-500"
          color="white"
          fontSize={14}
          fontWeight={600}
          cursor="pointer"
          hover={{ bgColor: 'sky-600' }}
          onClick={() => setCount((value) => value + 1)}
        >
          Clicked {count} {count === 1 ? 'time' : 'times'}
        </Button>
        <Box fontSize={14} color="slate-500">
          Interactive, hydrated, and its rules were already in <code>&lt;head&gt;</code> before it hydrated.
        </Box>
      </Flex>
    </Flex>
  );
}
