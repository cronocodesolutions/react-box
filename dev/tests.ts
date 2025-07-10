import { afterEach, beforeEach, vi } from 'vitest';

// Mock console.log to prevent noise in test output
export function ignoreLogs() {
  const originalConsoleLog = console.log;
  const originalConsoleDebug = console.debug;

  beforeEach(() => {
    console.log = vi.fn();
    console.debug = vi.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.debug = originalConsoleDebug;
  });
}
