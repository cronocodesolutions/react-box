import { BoxStyle } from '../coreTypes';
import { Keyframes } from '../engine/keyframes';
import { Components } from './boxComponents';
declare namespace BoxExtends {
    function extend<TProps extends Record<string, BoxStyle[]>, TPropTypes extends Record<string, BoxStyle[]>>(variables: Record<string, string>, extendedProps: TProps, extendedPropTypes: TPropTypes): {
        extendedProps: TProps;
        extendedPropTypes: TPropTypes;
    };
    function keyframes<T extends Keyframes>(keyframes: T): T;
    function getComponentsStyles(): Components;
    function components<T extends Components>(components: T): T;
}
export default BoxExtends;
