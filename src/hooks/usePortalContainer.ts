import { useLayoutEffect, useMemo } from 'react';
import Theme from '../core/theme/theme';

// Reference counter for theme classes to handle multiple hook instances
const themeRefCounts = new Map<string, number>();

export default function usePortalContainer() {
  const [theme] = Theme.useTheme();

  const portalContainer = useMemo(() => {
    const elId = 'crono-box';
    let container = document.getElementById(elId);

    if (!container) {
      container = document.createElement('div');
      container.id = elId;
      document.body.appendChild(container);
    }

    return container;
  }, []);

  // Update theme class when theme changes (with ref counting)
  useLayoutEffect(() => {
    if (!theme) return;

    const count = themeRefCounts.get(theme) ?? 0;
    themeRefCounts.set(theme, count + 1);

    if (count === 0) {
      portalContainer.classList.add(theme);
    }

    return () => {
      const currentCount = themeRefCounts.get(theme) ?? 1;
      const newCount = currentCount - 1;

      if (newCount <= 0) {
        themeRefCounts.delete(theme);
        portalContainer.classList.remove(theme);
      } else {
        themeRefCounts.set(theme, newCount);
      }
    };
  }, [portalContainer, theme]);

  return portalContainer;
}
