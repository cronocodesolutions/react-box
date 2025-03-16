import '@cronocode/react-box';
import { ExtractBoxStyles, ExtractComponentsAndVariants } from '../src/types';
import { extendedProps, extendedPropTypes, components } from './extends';

declare module '../src/types' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
    interface BoxPropTypes extends ExtractBoxStyles<typeof extendedPropTypes> {}
    interface ComponentsTypes extends ExtractComponentsAndVariants<typeof components> {}
  }
}
