import { useCallback, useMemo, useRef, useState } from 'react';

export interface UseVirtualizationOptions {
  /** Total number of items */
  itemCount: number;
  /** Height of each item in pixels */
  itemHeight: number;
  /** Height of the visible container in pixels */
  containerHeight: number;
  /** Number of items to render outside visible area (default: 3) */
  overscan?: number;
  /** Whether virtualization is enabled (default: true when itemCount > threshold) */
  enabled?: boolean;
  /** Threshold for enabling virtualization (default: 50) */
  threshold?: number;
}

export interface UseVirtualizationResult {
  /** First item index to render */
  startIndex: number;
  /** Last item index to render (inclusive) */
  endIndex: number;
  /** Total height of all items (for scroll container) */
  totalHeight: number;
  /** Y offset for positioning visible items */
  offsetY: number;
  /** Number of visible items */
  visibleCount: number;
  /** Whether virtualization is active */
  isVirtualized: boolean;
  /** Scroll event handler - attach to container's onScroll */
  handleScroll: (e: React.UIEvent<HTMLElement>) => void;
  /** Current scroll position */
  scrollTop: number;
  /** Container style for the scroll area */
  containerStyle: React.CSSProperties;
  /** Inner wrapper style (total height) */
  innerStyle: React.CSSProperties;
  /** Content style (transform offset) */
  contentStyle: React.CSSProperties;
}

/**
 * Hook for virtualizing large lists.
 * Only renders items that are visible in the viewport plus overscan buffer.
 */
export default function useVirtualization(options: UseVirtualizationOptions): UseVirtualizationResult {
  const { itemCount, itemHeight, containerHeight, overscan = 3, enabled, threshold = 50 } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Determine if virtualization should be active
  const isVirtualized = enabled ?? itemCount > threshold;

  // Calculate visible range
  const { startIndex, endIndex, visibleCount } = useMemo(() => {
    if (!isVirtualized) {
      return { startIndex: 0, endIndex: itemCount - 1, visibleCount: itemCount };
    }

    const visible = Math.ceil(containerHeight / itemHeight);
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(itemCount - 1, start + visible + overscan * 2);

    return { startIndex: start, endIndex: end, visibleCount: visible };
  }, [isVirtualized, itemCount, itemHeight, containerHeight, scrollTop, overscan]);

  const totalHeight = itemCount * itemHeight;
  const offsetY = startIndex * itemHeight;

  // Use requestAnimationFrame for smooth scrolling
  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(target.scrollTop);
      rafRef.current = null;
    });
  }, []);

  // Styles for the virtualized container structure
  const containerStyle: React.CSSProperties = useMemo(
    () =>
      isVirtualized
        ? {
            maxHeight: containerHeight,
            overflowY: 'auto',
            willChange: 'scroll-position',
          }
        : { maxHeight: containerHeight, overflowY: 'auto' },
    [isVirtualized, containerHeight],
  );

  const innerStyle: React.CSSProperties = useMemo(
    () => (isVirtualized ? { height: totalHeight, position: 'relative' } : {}),
    [isVirtualized, totalHeight],
  );

  const contentStyle: React.CSSProperties = useMemo(
    () =>
      isVirtualized
        ? {
            transform: `translate3d(0, ${offsetY}px, 0)`,
            willChange: 'transform',
          }
        : {},
    [isVirtualized, offsetY],
  );

  return {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    visibleCount,
    isVirtualized,
    handleScroll,
    scrollTop,
    containerStyle,
    innerStyle,
    contentStyle,
  };
}
