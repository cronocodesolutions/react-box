import { Path, Svg, SvgProps } from '../components/svg';

export default function SortIcon(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" width="1.5rem" {...props}>
      <Path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
    </Svg>
  );
}
