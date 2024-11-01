import BaseSvg, { BaseSvgProps } from '../../src/components/baseSvg';

export default function DataGridSvg(props: BaseSvgProps) {
  return (
    <BaseSvg viewBox="0 0 512 512" width="20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M42.667 192h106.666v42.667H42.667V192Zm0-85.333h106.666v42.666H42.667v-42.666Zm0 170.666h106.666V320H42.667v-42.667Zm0 85.334h106.666v42.666H42.667v-42.666ZM192 192h277.333v42.667H192V192Zm0-85.333h277.333v42.666H192v-42.666Zm0 170.666h277.333V320H192v-42.667Zm0 85.334h277.333v42.666H192v-42.666Z"
      />
    </BaseSvg>
  );
}
