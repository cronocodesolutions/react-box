import Box from '@box-kite/react';
import { Suspense } from 'react';
import Counter from './counter';
import StreamedSection, { StreamedFallback } from './streamedSection';

// Streaming is the point of the Suspense boundary below, so the page must be rendered per request
// rather than prerendered at build time — otherwise `next start` serves finished HTML and there is
// nothing to stream. Nothing about the styling mode requires this.
export const dynamic = 'force-dynamic';

const facts = [
  [
    'No client runtime',
    'The CSS is in the HTML because Box rendered it as <style href precedence> elements. Nothing injects it after hydration.',
  ],
  ['No configuration', 'The react-server export condition resolves to a hook-free Box that turns element mode on when it loads.'],
  ['Deduped by content', 'The href of every element is a hash of the rule, so two Boxes with p={4} produce one <style> in <head>.'],
  [
    'Ordered by @layer',
    'React hoists elements in render order; the cascade comes from a layer order declared once, so shorthands still lose to longhands.',
  ],
];

export default function Page() {
  return (
    <Box maxWidth={240} mx="auto" display="flex" d="column" gap={8}>
      <Box
        p={6}
        borderRadius={3}
        bgColor="slate-100"
        b={1}
        borderColor="slate-200"
        theme={{ dark: { bgColor: 'slate-900', borderColor: 'slate-800' } }}
        md={{ p: 8 }}
      >
        <Box tag="h2" fontSize={18} fontWeight={600}>
          This card was styled on the server
        </Box>
        <Box tag="p" mt={3} color="slate-600" theme={{ dark: { color: 'slate-400' } }}>
          View source: every class on this page has its rule in a <code>&lt;style&gt;</code> element in <code>&lt;head&gt;</code>, put there
          by React 19 hoisting what Box rendered. There is no <code>&apos;use client&apos;</code> in this file, no provider above it and no
          stylesheet to import.
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns={1} gap={4} md={{ gridTemplateColumns: 2 }}>
        {facts.map(([title, body]) => (
          <Box
            key={title}
            p={5}
            borderRadius={2}
            b={1}
            borderColor="slate-200"
            hover={{ borderColor: 'sky-500' }}
            theme={{ dark: { borderColor: 'slate-800', hover: { borderColor: 'sky-400' } } }}
          >
            <Box fontSize={14} fontWeight={600} color="sky-600" theme={{ dark: { color: 'sky-400' } }}>
              {title}
            </Box>
            <Box mt={2} fontSize={14} color="slate-600" theme={{ dark: { color: 'slate-400' } }}>
              {body}
            </Box>
          </Box>
        ))}
      </Box>

      <Suspense fallback={<StreamedFallback />}>
        <StreamedSection />
      </Suspense>

      <Counter />
    </Box>
  );
}
