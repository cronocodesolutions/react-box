'use client';

import Icon from '@cronocode/react-box/components/icon';
import { Icon as IconifyIcon } from '@iconify/react';

/**
 * Iconify's runtime component, styled by `Icon` like any other icon: it spreads its props onto the
 * `<svg>` it renders, which is the whole contract `Icon` needs from an icon source.
 *
 * `'use client'` is Iconify's requirement, not the library's — the lookup is a browser fetch and a
 * state update. `Icon` itself renders on a server (the page around this one is proof), so the
 * boundary is exactly as wide as the icon source makes it.
 */
export default function RuntimeIcon() {
  return (
    <Icon size={10} color="emerald-600" theme={{ dark: { color: 'emerald-400' } }} label="The Vue logo">
      <IconifyIcon icon="simple-icons:vuedotjs" />
    </Icon>
  );
}
