import Box from '@box-kite/react';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ThemeToggle from './themeToggle';

export const metadata: Metadata = {
  title: 'Box in a Server Component',
  description: 'The Box Kite element-rendering mode inside the Next.js App Router — no client runtime, no "use client".',
};

/**
 * The root layout is a Server Component, and so is everything it renders except the two islands. The theme
 * is decided here, on the server: theme rules are ancestor-scoped, so the class on `<html>` is the entire
 * mechanism — no provider, no context, nothing to hydrate. `ThemeToggle` rewrites that class in the browser.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body>
        <Box
          minHeight="fit-screen"
          bgColor="white"
          color="slate-800"
          theme={{ dark: { bgColor: 'slate-950', color: 'slate-300' } }}
          px={4}
          py={8}
          md={{ px: 10, py: 12 }}
        >
          <Box tag="header" display="flex" jc="space-between" ai="center" gap={4} maxWidth={240} mx="auto" mb={10}>
            <Box>
              <Box tag="h1" fontSize={20} fontWeight={700} md={{ fontSize: 28 }}>
                Box in a Server Component
              </Box>
              <Box mt={1} fontSize={14} color="slate-500" theme={{ dark: { color: 'slate-400' } }}>
                Next.js App Router · React 19 · zero <code>&apos;use client&apos;</code> on this page
              </Box>
            </Box>
            <ThemeToggle />
          </Box>
          {children}
        </Box>
      </body>
    </html>
  );
}
