import { forwardRef, Ref } from 'react';
import { Svg, SvgProps } from './svg';

type Props = Omit<SvgProps, 'ref'>;

/**
 * `Svg` with the icon preset: a 24×24 viewBox, 1.5rem across, nothing filled in.
 *
 * @deprecated Since SV3 every SVG element has a component, and `Svg` is this one without the presets:
 * `<Svg viewBox="0 0 24 24" width="1.5rem">`. For an icon somebody else renders, `Icon`. Kept so the
 * preset does not vanish from under anyone, and it names itself as `Svg` does.
 */
function BaseSvgImpl(props: Props, ref: Ref<SVGSVGElement>) {
  const { viewBox = '0 0 24 24', width = '1.5rem', props: tagProps, ...restProps } = props;

  return <Svg ref={ref} viewBox={viewBox} width={width} props={{ ...tagProps, fill: 'none' }} {...restProps} />;
}

const BaseSvg = forwardRef(BaseSvgImpl);
BaseSvg.displayName = 'BaseSvg';

export default BaseSvg;

export type BaseSvgProps = React.ComponentProps<typeof BaseSvg>;
