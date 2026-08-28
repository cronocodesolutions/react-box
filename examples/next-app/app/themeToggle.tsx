'use client';
import Box from '@cronocode/react-box';
import Button from '@cronocode/react-box/components/button';
import { createThemeController, type ThemeController } from '@cronocode/react-box/core';
import { useEffect, useRef, useState } from 'react';
import './elementMode';

/**
 * Theming with no provider. `Box.Theme` needs state, storage and a media-query listener, so it is
 * client-only — but the *rules* are ancestor-scoped, which means all a server component has to do
 * is put the theme name on `<html>` (see `layout.tsx`). Switching it later is a DOM write, and
 * `createThemeController()` from `@cronocode/react-box/core` is that state machine with no React
 * in it: explicit choice wins over the stored one, which wins over the system preference.
 *
 * The controller is created in an effect, and starts on the theme the server rendered, so the
 * first client render matches the HTML exactly.
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
