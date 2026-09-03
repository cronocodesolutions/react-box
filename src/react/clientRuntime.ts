/**
 * The client half of the library needs React APIs the server build does not have. Under the `react-server`
 * condition they are absent, so the first one touched at import time throws `createContext is not a
 * function` — no file, no component, nothing to act on (bug #43). The published build prevents that; this
 * is for the ways around it: a deep import, a bundler with no condition, a framework mixing the graphs.
 */
export const CLIENT_RUNTIME_MESSAGE =
  '[box-kite] The client build was loaded into a React Server Component graph, where React has no createContext. ' +
  "Import '@box-kite/react' by its package name — the react-server condition resolves it to a Box that renders on the server — " +
  "and import the components that hold state (Dropdown, Tooltip, DataGrid, Checkbox, Select, Form) from a 'use client' module. " +
  'See https://github.com/box-kite/box-kite#react-server-components-react-19';

/** Throws with something readable if `react` is the server build. Called where the first one is needed. */
export default function assertClientRuntime(react: { createContext?: unknown }): void {
  if (typeof react.createContext === 'function') return;

  throw new Error(CLIENT_RUNTIME_MESSAGE);
}
