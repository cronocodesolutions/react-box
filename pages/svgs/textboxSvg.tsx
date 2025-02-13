import BaseSvg, { BaseSvgProps } from '../../src/components/baseSvg';

export default function TextboxSvg(props: BaseSvgProps) {
  return (
    <BaseSvg viewBox="0 0 52 52" width="20" fill="currentColor" {...props}>
      <path d="M44.7 49.4H7.3c-2.6 0-4.7-2.1-4.7-4.7V7.3c0-2.6 2.1-4.7 4.7-4.7h37.5c2.6 0 4.7 2.1 4.7 4.7v37.5c-.1 2.5-2.2 4.6-4.8 4.6zm-35.8-39v31.2c0 .9.7 1.6 1.6 1.6h31.2c.9 0 1.6-.7 1.6-1.6V10.4c0-.9-.7-1.6-1.6-1.6H10.5c-.9 0-1.6.7-1.6 1.6z" />
      <path d="M15.2 35.3V16.7c0-.9.7-1.6 1.6-1.6h3.1c.9 0 1.6.7 1.6 1.6v18.6c0 .9-.7 1.6-1.6 1.6h-3.1c-.9 0-1.6-.7-1.6-1.6z" />
    </BaseSvg>
  );
}
