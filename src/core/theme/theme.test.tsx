import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ignoreLogs } from '../../../dev/tests';
import Box from '../../box';
import Theme from './theme';

const testId = 'test-content';

describe('Theme', () => {
  ignoreLogs();

  let matchMediaListeners: ((e: MediaQueryListEvent) => void)[] = [];
  let matchesDark = false;

  const mockMatchMedia = (matches: boolean) => {
    matchesDark = matches;
    return vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? matchesDark : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, callback: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          matchMediaListeners.push(callback);
        }
      }),
      removeEventListener: vi.fn((event: string, callback: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          matchMediaListeners = matchMediaListeners.filter((cb) => cb !== callback);
        }
      }),
      dispatchEvent: vi.fn(),
    }));
  };

  beforeEach(() => {
    matchMediaListeners = [];
    matchesDark = false;
    window.matchMedia = mockMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('getSystemTheme() SSR behavior', () => {
    it('returns light theme when window is undefined (SSR)', () => {
      // We can't truly test SSR in happy-dom, but we can verify
      // the component renders with a default theme
      render(
        <Theme>
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      // In light mode (default), parent should have 'light' class
      expect(content.parentElement?.classList.contains('light')).toBe(true);
    });
  });

  describe('auto-detection with prefers-color-scheme', () => {
    it('detects light mode when system prefers light', () => {
      window.matchMedia = mockMatchMedia(false);

      render(
        <Theme>
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      expect(content.parentElement?.classList.contains('light')).toBe(true);
    });

    it('detects dark mode when system prefers dark', () => {
      window.matchMedia = mockMatchMedia(true);

      render(
        <Theme>
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      expect(content.parentElement?.classList.contains('dark')).toBe(true);
    });
  });

  describe('system theme change listener', () => {
    it('updates theme when system preference changes from light to dark', () => {
      window.matchMedia = mockMatchMedia(false);

      render(
        <Theme>
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      expect(content.parentElement?.classList.contains('light')).toBe(true);

      // Simulate system theme change
      act(() => {
        matchMediaListeners.forEach((listener) => {
          listener({ matches: true } as MediaQueryListEvent);
        });
      });

      expect(content.parentElement?.classList.contains('dark')).toBe(true);
    });

    it('updates theme when system preference changes from dark to light', () => {
      window.matchMedia = mockMatchMedia(true);

      render(
        <Theme>
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      expect(content.parentElement?.classList.contains('dark')).toBe(true);

      // Simulate system theme change
      act(() => {
        matchMediaListeners.forEach((listener) => {
          listener({ matches: false } as MediaQueryListEvent);
        });
      });

      expect(content.parentElement?.classList.contains('light')).toBe(true);
    });

    it('cleans up event listener on unmount', () => {
      window.matchMedia = mockMatchMedia(false);

      const { unmount } = render(
        <Theme>
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      expect(matchMediaListeners.length).toBe(1);

      unmount();

      expect(matchMediaListeners.length).toBe(0);
    });
  });

  describe('explicit theme prop', () => {
    it('uses explicit theme instead of auto-detection', () => {
      window.matchMedia = mockMatchMedia(true); // System prefers dark

      render(
        <Theme theme="light">
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      // Should use explicit 'light' even though system prefers dark
      expect(content.parentElement?.classList.contains('light')).toBe(true);
    });

    it('does not add event listener when theme is explicitly provided', () => {
      window.matchMedia = mockMatchMedia(false);

      render(
        <Theme theme="dark">
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      // No listener should be added when theme is explicit
      expect(matchMediaListeners.length).toBe(0);
    });

    it('ignores system theme changes when theme is explicitly provided', () => {
      window.matchMedia = mockMatchMedia(false);

      render(
        <Theme theme="dark">
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      expect(content.parentElement?.classList.contains('dark')).toBe(true);

      // Simulate system theme change - should have no effect
      act(() => {
        matchMediaListeners.forEach((listener) => {
          listener({ matches: false } as MediaQueryListEvent);
        });
      });

      // Should still be dark (explicit theme)
      expect(content.parentElement?.classList.contains('dark')).toBe(true);
    });
  });

  describe('useTheme hook', () => {
    it('returns current theme and setTheme function', () => {
      let capturedTheme: string | undefined;
      let capturedSetTheme: ((theme: string) => void) | undefined;

      function TestComponent() {
        const [theme, setTheme] = Theme.useTheme();
        capturedTheme = theme;
        capturedSetTheme = setTheme;
        return <Box id={testId}>{theme}</Box>;
      }

      render(
        <Theme theme="light">
          <TestComponent />
        </Theme>,
      );

      expect(capturedTheme).toBe('light');
      expect(typeof capturedSetTheme).toBe('function');
    });

    it('allows programmatic theme change via setTheme', () => {
      let capturedSetTheme: ((theme: string) => void) | undefined;

      function TestComponent() {
        const [theme, setTheme] = Theme.useTheme();
        capturedSetTheme = setTheme;
        return <Box id={testId}>{theme}</Box>;
      }

      render(
        <Theme theme="light">
          <TestComponent />
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      expect(content.textContent).toBe('light');

      act(() => {
        capturedSetTheme?.('dark');
      });

      expect(content.textContent).toBe('dark');
    });
  });

  describe('use prop (local vs global)', () => {
    it('wraps children in Box with theme class when use="local" (default)', () => {
      render(
        <Theme theme="dark">
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      // Parent should be a Box wrapper with 'dark' class
      expect(content.parentElement?.classList.contains('dark')).toBe(true);
      expect(content.parentElement?.classList.contains('_b')).toBe(true); // Box base class
    });

    it('adds theme class to document root when use="global"', () => {
      render(
        <Theme theme="dark" use="global">
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes theme class from document root on unmount when use="global"', () => {
      const { unmount } = render(
        <Theme theme="dark" use="global">
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);

      unmount();

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('does not wrap children in Box when use="global"', () => {
      render(
        <Theme theme="dark" use="global">
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      // Parent should NOT be a Box wrapper (no '_b' class on immediate parent)
      expect(content.parentElement?.classList.contains('_b')).toBe(false);
    });
  });

  describe('custom theme names', () => {
    it('supports custom theme names beyond light/dark', () => {
      render(
        <Theme theme="high-contrast">
          <Box id={testId}>Content</Box>
        </Theme>,
      );

      const content = document.getElementById(testId)!;
      expect(content.parentElement?.classList.contains('high-contrast')).toBe(true);
    });
  });
});
