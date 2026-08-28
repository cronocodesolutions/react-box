/**
 * The client half of the library needs React APIs the server build does not have — `createContext`
 * for the theme, `useState` for hover children, effects for writing the CSS. Under the
 * `react-server` condition those exports are simply absent, so the first one touched at import time
 * throws `createContext is not a function`: no file, no component, no mention of Server Components
 * and nothing to act on. That was the whole of bug #43.
 *
 * The published build keeps that from happening — the `react-server` export condition hands a
 * Server Component the hook-free Box, the hook-free components resolve Box through the package name
 * so the same condition reaches them, and the stateful ones carry a `'use client'` banner. This is
 * for the ways around all three: a deep import, a bundler configured without the condition, or a
 * framework that puts a client module in the server graph by hand.
 */
export const CLIENT_RUNTIME_MESSAGE =
  '[react-box] The client build was loaded into a React Server Component graph, where React has no createContext. ' +
  "Import '@cronocode/react-box' by its package name — the react-server condition resolves it to a Box that renders on the server — " +
  "and import the components that hold state (Dropdown, Tooltip, DataGrid, Checkbox, Select, Form) from a 'use client' module. " +
  'See https://github.com/box-kite/box-kite#react-server-components-react-19';

/** Throws with something readable if `react` is the server build. Called where the first one is needed. */
export default function assertClientRuntime(react: { createContext?: unknown }): void {
  if (typeof react.createContext === 'function') return;

  throw new Error(CLIENT_RUNTIME_MESSAGE);
}
