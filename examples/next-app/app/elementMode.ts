'use client';
import Box from '@cronocode/react-box';

/**
 * The one line a client component needs in an RSC app: the client bundle resolves the *client* Box, whose
 * rules go through the CSSOM after hydration, so an island's CSS would be missing from the HTML. Element
 * mode puts it back, and content-hashed class names make the island reuse the strings the server wrote.
 * Imported for its side effect, so it runs before the first render.
 */
Box.configure({ sink: 'element' });
