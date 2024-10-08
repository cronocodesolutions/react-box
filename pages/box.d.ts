import '@cronocode/react-box';
import { ExtractBoxStyles } from '../src/types';
import { extendedProps, extendedPropTypes } from './theme';

declare module '../src/types' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
    interface BoxPropTypes extends ExtractBoxStyles<typeof extendedPropTypes> {}
  }
}
