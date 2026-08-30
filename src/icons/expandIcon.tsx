import { Path, Svg, SvgProps } from '../components/svg';

export default function ExpandIcon(props: SvgProps) {
  return (
    <Svg viewBox="4 2 16 18" width="1rem" fill="currentColor" {...props}>
      <Path
        fillRule="evenodd"
        d="M12.707 14.707a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L12 12.586l4.293-4.293a1 1 0 1 1 1.414 1.414l-5 5Z"
        props={{ clipRule: 'evenodd' }}
      />
    </Svg>
  );
}
