import BaseSvg, { BaseSvgProps } from '../components/baseSvg';

export default function DotsIcon(props: BaseSvgProps) {
  return (
    <BaseSvg viewBox="0 0 16 16" width="18" {...props}>
      <path
        strokeWidth={4}
        d="M7.936 12.128a.936.936 0 1 1 0 1.872.936.936 0 0 1 0-1.872ZM7.936 7.052a.936.936 0 1 1 0 1.873.936.936 0 0 1 0-1.873ZM7.936 1.977a.936.936 0 1 1 0 1.872.936.936 0 0 1 0-1.872Z"
      />
    </BaseSvg>
  );
}
