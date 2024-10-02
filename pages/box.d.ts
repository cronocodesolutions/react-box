import '@cronocode/react-box';
import { ExtractBoxStyles } from '../src/types';
import { extendedProps } from './theme';

declare module '../src/types' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
  }
}
