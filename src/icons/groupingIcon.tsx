import BaseSvg, { BaseSvgProps } from '../components/baseSvg';

export default function GroupingIcon(props: BaseSvgProps) {
  return (
    <BaseSvg viewBox="0 0 24 24" {...props}>
      <path d="M3 5h8v2H3V5zm0 6h8v2H3v-2zm0 6h8v2H3v-2zm12-12h6v6h-6V5zm1 1v4h4V6h-4zm-1 7h6v6h-6v-6zm1 1v4h4v-4h-4z" />
    </BaseSvg>
  );
}
