import { MotionConfig } from 'framer-motion';
import Box from '../../src/box';
import App from './app';

/**
 * Everything inside the router: the theme provider and the app. The browser entry and the prerender
 * pass share it, so the tree they render is the same one — anything only one of them renders is a
 * hydration mismatch.
 *
 * `reducedMotion="user"` is framer-motion's half of A8: the library stops animating for a user who
 * asked it to, and the site's own animations have to follow.
 */
export default function Root() {
  return (
    <MotionConfig reducedMotion="user">
      <Box.Theme
        use="global"
        globalStyles={{
          scrollbarWidth: 'thin',
          scrollbarColor: ['violet-500', 'transparent'],
          theme: { dark: { scrollbarColor: ['violet-700', 'transparent'] } },
        }}
      >
        <App />
      </Box.Theme>
    </MotionConfig>
  );
}
