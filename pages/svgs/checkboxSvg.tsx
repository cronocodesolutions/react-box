import BaseSvg, { BaseSvgProps } from '../../src/components/baseSvg';

interface Props extends BaseSvgProps {
  checked?: boolean;
  noFrame?: boolean;
}

export default function CheckboxSvg(props: Props) {
  const { checked, noFrame, ...restProps } = props;

  return (
    <BaseSvg viewBox="0 0 20 20" width="20" stroke="currentColor" {...restProps}>
      <g fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        {!noFrame && (
          <path d="M3.16 1h13.68A2.16 2.16 0 0 1 19 3.16v13.68A2.16 2.16 0 0 1 16.84 19H3.16A2.16 2.16 0 0 1 1 16.84V3.16A2.16 2.16 0 0 1 3.16 1Z" />
        )}
        {checked && <path d="M5 9.559 9.118 13.5 15 6.5" />}
      </g>
    </BaseSvg>
  );
}
