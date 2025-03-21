import BaseSvg, { BaseSvgProps } from '../../src/components/baseSvg';

export default function CloseSvg(props: BaseSvgProps) {
  return (
    <BaseSvg viewBox="0 0 24 24" {...props}>
      <path d="M4.238 2.988a1.25 1.25 0 0 0-.87 2.147L10.231 12l-6.87 6.87a1.251 1.251 0 1 0 1.769 1.769L12 13.768l6.865 6.865a1.25 1.25 0 1 0 1.768-1.768L13.768 12l6.857-6.857a1.25 1.25 0 1 0-1.768-1.768L12 10.232 5.135 3.367a1.25 1.25 0 0 0-.897-.379z" />
    </BaseSvg>
  );
}
