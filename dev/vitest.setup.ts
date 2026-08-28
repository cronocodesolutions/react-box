// DOM matchers (toBeChecked, toHaveFocus, toHaveAccessibleName, ...). The accessibility tests lean
// on them heavily, and they read better than hand-rolled attribute assertions everywhere else too.
import '@testing-library/jest-dom/vitest';
import { StylesContext } from '../src/react/useStyles';

// Tests assert readable class names and rule text. Configure the engine explicitly —
// this replaces the NODE_ENV === 'test' sniffing the engine used to do internally.
StylesContext.configure({ classNames: 'readable', sink: 'textContent' });
