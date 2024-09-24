import '@cronocode/react-box';
import { ExtractBoxStyles, extendedProps } from '../src/core/boxStyles2';

declare module '../src/core/boxStyles2' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
  }
}
