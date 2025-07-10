/* eslint-disable @typescript-eslint/no-empty-object-type */
import '@cronocode/react-box';
import { extendedProps, extendedPropTypes, components } from './extends';
import { ExtractBoxStyles, ExtractComponentsAndVariants } from '../src/types';

declare module '../src/types' {
  namespace Augmented {
    interface BoxProps extends ExtractBoxStyles<typeof extendedProps> {}
    interface BoxPropTypes extends ExtractBoxStyles<typeof extendedPropTypes> {}
    interface ComponentsTypes extends ExtractComponentsAndVariants<typeof components> {}
  }
}
