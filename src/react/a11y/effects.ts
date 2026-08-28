import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/**
 * A layout effect on the browser, a passive one everywhere else.
 *
 * Focus moves and event registration have to happen before the browser paints, so these hooks want
 * `useLayoutEffect` — but React logs a warning for it during server rendering, where no effect runs
 * at all. Same trade the styling binding makes in `useStyles.ts`, one concern over.
 */
export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

/**
 * A callback with a stable identity that always calls the *latest* function it was given.
 *
 * Without it every hook here would have to list the consumer's handler in its dependency array,
 * and a handler written inline — which is how they are always written — would tear down and
 * re-register the document listeners on every render. The handler is only ever invoked from an
 * event, which is long after the effect that stored it has run.
 */
export function useEventCallback<TArgs extends unknown[], TResult>(
  fn: ((...args: TArgs) => TResult) | undefined,
): (...args: TArgs) => TResult | undefined {
  const ref = useLatest(fn);

  return useCallback((...args: TArgs) => ref.current?.(...args), [ref]);
}

/**
 * The latest value, readable from an event handler that must not be re-registered when it changes.
 *
 * Written from an effect rather than during render, which the lint rules require and which costs
 * nothing here: the value is only ever read from an event, and events fire long after the commit
 * that wrote it.
 */
export function useLatest<T>(value: T): React.RefObject<T> {
  const ref = useRef(value);

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
}
