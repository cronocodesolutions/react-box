import { forwardRef, Ref } from 'react';
import { Svg, SvgProps } from './svg';

type Props = Omit<SvgProps, 'ref'>;

/**
 * `Svg` with the icon preset: a 24×24 viewBox, 1.5rem across, nothing filled in.
 *
 * @deprecated Since SV3 there is a component for every SVG element, and `Svg` is this one without
 * the presets — `<Svg viewBox="0 0 24 24" width="1.5rem">`. For an icon somebody else renders, use
 * `Icon` from `components/icon`. This is kept so the preset does not disappear from under anyone;
 * it is `Svg` underneath, so it names itself the same way — no `label` means `aria-hidden`.
 */
function BaseSvgImpl(props: Props, ref: Ref<SVGSVGElement>) {
  const { viewBox = '0 0 24 24', width = '1.5rem', props: tagProps, ...restProps } = props;

  return <Svg ref={ref} viewBox={viewBox} width={width} props={{ ...tagProps, fill: 'none' }} {...restProps} />;
}

const BaseSvg = forwardRef(BaseSvgImpl);
BaseSvg.displayName = 'BaseSvg';

export default BaseSvg;

export type BaseSvgProps = React.ComponentProps<typeof BaseSvg>;
