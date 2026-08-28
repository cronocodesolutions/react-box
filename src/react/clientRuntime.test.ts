import React from 'react';
import { describe, expect, it } from 'vitest';
import assertClientRuntime, { CLIENT_RUNTIME_MESSAGE } from './clientRuntime';

describe('assertClientRuntime', () => {
  it('passes for the client build of React', () => {
    expect(() => assertClientRuntime(React)).not.toThrow();
  });

  it('names the problem and the fix when React is the server build', () => {
    // What `--conditions=react-server` gives: the client-only exports are simply missing.
    expect(() => assertClientRuntime({})).toThrow(CLIENT_RUNTIME_MESSAGE);
  });

  it('points at the package name and the client directive', () => {
    expect(CLIENT_RUNTIME_MESSAGE).toContain('@cronocode/react-box');
    expect(CLIENT_RUNTIME_MESSAGE).toContain("'use client'");
  });
});
