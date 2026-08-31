import { useEffect } from 'react';
import { PRERENDERED_STYLE_ID } from '../site/prerender';
import { hydrationFinished } from './hydration';

/**
 * Runs once the prerendered HTML has been adopted. The engine's own stylesheet now holds every rule
 * the page needs, so the build's copy is redundant — and a `Reveal` mounting from here on is a real
 * mount, which is the one that animates.
 */
export default function AfterHydration() {
  useEffect(() => {
    document.getElementById(PRERENDERED_STYLE_ID)?.remove();
    hydrationFinished();
  }, []);

  return null;
}
