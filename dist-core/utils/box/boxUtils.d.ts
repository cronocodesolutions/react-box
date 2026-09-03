import { BoxStylesWithPseudoClasses } from '../../types';
declare namespace BoxUtils {
    function assignBooleanProp<TProps>(prop: boolean | [boolean, BoxStylesWithPseudoClasses] | undefined, name: string, props: TProps): void;
}
export default BoxUtils;
