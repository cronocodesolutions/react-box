'use client';
import { createThemeController, type ThemeController } from '@box-kite/core';
import Box from '@box-kite/react';
import Button from '@box-kite/react/components/button';
import { useEffect, useRef, useState } from 'react';
import './elementMode';

/**
 * Theming with no provider. `Box.Theme` needs state, storage and a media-query listener, but the rules are
 * ancestor-scoped, so a server component only has to put the theme name on `<html>` (see `layout.tsx`).
 * `createThemeController()` is that state machine with no React in it; it is created in an effect and
 * starts on the theme the server rendered, so the first client render matches the HTML.
 */
const STORAGE_KEY = 'box-next-app-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  const [isFollowingSystem, setIsFollowingSystem] = useState(false);
  const controller = useRef<ThemeController>(null);

  useEffect(() => {
    const instance = createThemeController({ storageKey: STORAGE_KEY, theme: document.documentElement.className || 'dark' });
    controller.current = instance;
    const unsubscribe = instance.subscribe(setTheme);

    return () => {
      unsubscribe();
      controller.current = null;
      instance.destroy();
    };
  }, []);

  return (
    <Box display="flex" ai="center" gap={2}>
      <Button
        px={3}
        py={2}
        borderRadius={2}
        b={1}
        borderColor="slate-300"
        fontSize={13}
        cursor="pointer"
        theme={{ dark: { borderColor: 'slate-700' } }}
        hover={{ borderColor: 'sky-500' }}
        onClick={() => {
          controller.current?.set(theme === 'dark' ? 'light' : 'dark');
          setIsFollowingSystem(false);
        }}
      >
        {theme === 'dark' ? 'Light theme' : 'Dark theme'}
      </Button>
      <Button
        px={3}
        py={2}
        borderRadius={2}
        b={1}
        borderColor="slate-300"
        fontSize={13}
        cursor="pointer"
        opacity={isFollowingSystem ? 1 : 0.6}
        theme={{ dark: { borderColor: 'slate-700' } }}
        hover={{ borderColor: 'sky-500' }}
        onClick={() => {
          controller.current?.set(null);
          setIsFollowingSystem(true);
        }}
      >
        System
      </Button>
    </Box>
  );
}
