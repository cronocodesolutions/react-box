import BaseSvg, { BaseSvgProps } from '../../src/components/baseSvg';

export default function GridSvg(props: BaseSvgProps) {
  return (
    <BaseSvg viewBox="-1 -1 23 23" width="20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M16.8 18h2.1v-2h-2.1v2Zm2.1-4h-2.1c-1.16 0-2.1.895-2.1 2v2c0 1.104.94 2 2.1 2h2.1c1.16 0 2.1-.896 2.1-2v-2c0-1.105-.94-2-2.1-2Zm-9.45 4h2.1v-2h-2.1v2Zm2.1-4h-2.1c-1.16 0-2.1.895-2.1 2v2c0 1.104.94 2 2.1 2h2.1c1.16 0 2.1-.896 2.1-2v-2c0-1.105-.94-2-2.1-2ZM2.1 18h2.1v-2H2.1v2Zm2.1-4H2.1C.94 14 0 14.895 0 16v2c0 1.104.94 2 2.1 2h2.1c1.16 0 2.1-.896 2.1-2v-2c0-1.105-.94-2-2.1-2Zm12.6-3h2.1V9h-2.1v2Zm2.1-4h-2.1c-1.16 0-2.1.895-2.1 2v2c0 1.104.94 2 2.1 2h2.1c1.16 0 2.1-.896 2.1-2V9c0-1.105-.94-2-2.1-2Zm-9.45 4h2.1V9h-2.1v2Zm2.1-4h-2.1c-1.16 0-2.1.895-2.1 2v2c0 1.104.94 2 2.1 2h2.1c1.16 0 2.1-.896 2.1-2V9c0-1.105-.94-2-2.1-2ZM2.1 11h2.1V9H2.1v2Zm2.1-4H2.1C.94 7 0 7.895 0 9v2c0 1.104.94 2 2.1 2h2.1c1.16 0 2.1-.896 2.1-2V9c0-1.105-.94-2-2.1-2Zm12.6-3h2.1V2h-2.1v2Zm2.1-4h-2.1c-1.16 0-2.1.895-2.1 2v2c0 1.104.94 2 2.1 2h2.1c1.16 0 2.1-.896 2.1-2V2c0-1.105-.94-2-2.1-2ZM9.45 4h2.1V2h-2.1v2Zm2.1-4h-2.1c-1.16 0-2.1.895-2.1 2v2c0 1.104.94 2 2.1 2h2.1c1.16 0 2.1-.896 2.1-2V2c0-1.105-.94-2-2.1-2ZM2.1 4h2.1V2H2.1v2Zm2.1-4H2.1C.94 0 0 .895 0 2v2c0 1.104.94 2 2.1 2h2.1c1.16 0 2.1-.896 2.1-2V2c0-1.105-.94-2-2.1-2Z"
      />
    </BaseSvg>
  );
}