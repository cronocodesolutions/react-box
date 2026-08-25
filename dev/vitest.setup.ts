import { StylesContext } from '../src/core/useStyles';

// Tests assert readable class names and rule text. Configure the engine explicitly —
// this replaces the NODE_ENV === 'test' sniffing the engine used to do internally.
StylesContext.configure({ classNames: 'readable', sink: 'textContent' });
