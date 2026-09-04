import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from './routes';
import { notFoundMeta, pageMeta, routeFor } from './siteMeta';

/**
 * Keeps the document head in step with the route: title, description, canonical URL and the Open Graph
 * pair. Each route is also served as a static shell carrying the same tags, so the head is right before
 * the app starts; this is what keeps it right afterwards, when navigation happens without a page load.
 */
export default function DocumentHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = routeFor(pathname, routes);
    // An address the router does not serve still renders the app shell, because that is what the
    // 404 page is a copy of. Say so, and keep it out of the index.
    const meta = route ? pageMeta(route) : notFoundMeta;

    document.title = meta.title;
    setMeta('name', 'description', meta.description);
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:url', meta.canonical);
    setMeta('name', 'robots', meta.indexable ? undefined : 'noindex, follow');
    setLink('canonical', meta.canonical);
  }, [pathname]);

  return null;
}

/** Sets a head tag's content, creating the tag when the shell has none — or removes it entirely. */
function setMeta(key: 'name' | 'property', value: string, content: string | undefined) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`);

  if (content === undefined) return tag?.remove();

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(key, value);
    document.head.append(tag);
  }

  tag.content = content;
}

function setLink(rel: string, href: string | undefined) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (href === undefined) return tag?.remove();

  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    document.head.append(tag);
  }

  tag.href = href;
}
