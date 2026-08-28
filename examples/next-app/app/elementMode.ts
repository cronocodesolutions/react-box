'use client';
import Box from '@cronocode/react-box';

/**
 * The one line a client component needs in an RSC app: the client bundle resolves the *client*
 * Box, whose default is to insert rules through the CSSOM after hydration — so an island's CSS
 * would be missing from the server-rendered HTML. Element mode puts it back in the markup, and
 * because class names are content-hashed in this mode, the island's classes are the same strings
 * the server produced for the same props.
 *
 * Importing this module for its side effect is how it runs before the first render. Every client
 * component in this app imports it.
 */
Box.configure({ sink: 'element' });
