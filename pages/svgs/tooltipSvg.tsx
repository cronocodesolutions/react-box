import BaseSvg, { BaseSvgProps } from '../../src/components/baseSvg';

export default function TooltipSvg(props: BaseSvgProps) {
  return (
    <BaseSvg viewBox="0 0 24 24" width="20" stroke="currentColor" fill="none" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 10h-8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h.93a2 2 0 0 1 1.664.89l.574.862a1 1 0 0 0 1.664 0l.574-.861A2 2 0 0 1 19.07 20H20a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zm-6-3V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h.93a2 2 0 0 1 1.664.89L7 13.5"
      />
    </BaseSvg>
  );
}
