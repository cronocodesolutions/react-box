'use client';

import Icon from '@box-kite/react/components/icon';
import { Icon as IconifyIcon } from '@iconify/react';

/**
 * Iconify's runtime component, styled by `Icon` like any other: it spreads its props onto the `<svg>` it
 * renders, which is the whole contract `Icon` needs. The `'use client'` is Iconify's requirement, not the
 * library's — `Icon` renders on a server, so the boundary is only as wide as the icon source makes it.
 */
export default function RuntimeIcon() {
  return (
    <Icon size={10} color="emerald-600" theme={{ dark: { color: 'emerald-400' } }} label="The Vue logo">
      <IconifyIcon icon="simple-icons:vuedotjs" />
    </Icon>
  );
}
