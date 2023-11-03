import { useMemo } from 'react';

export default function usePortalContainer() {
  return useMemo(() => {
    const elId = 'crono-box';
    let portalContainer = document.getElementById(elId);

    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = elId;
      document.body.appendChild(portalContainer);
    }

    return portalContainer;
  }, []);
}
