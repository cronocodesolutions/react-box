import BaseSvg, { BaseSvgProps } from '../components/baseSvg';

export default function ExpandIcon(props: BaseSvgProps) {
  return (
    <BaseSvg viewBox="4 2 16 18" width="1rem" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M12.707 14.707a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L12 12.586l4.293-4.293a1 1 0 1 1 1.414 1.414l-5 5Z"
        clipRule="evenodd"
      />
    </BaseSvg>
  );
}
