import BaseSvg, { BaseSvgProps } from '../../src/components/baseSvg';

export default function RadioSvg(props: BaseSvgProps) {
  return (
    <BaseSvg viewBox="0 0 24 24" width="20" fill="currentColor" {...props}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-6a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    </BaseSvg>
  );
}
