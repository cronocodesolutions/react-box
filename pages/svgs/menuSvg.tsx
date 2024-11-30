import BaseSvg, { BaseSvgProps } from '../../src/components/baseSvg';

export default function MenuSvg(props: BaseSvgProps) {
  return (
    <BaseSvg viewBox="0 0 24 24" width="20" fill="currentColor" {...props}>
      <path d="M5 6h14M5 12h14M5 18h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
    </BaseSvg>
  );
}
