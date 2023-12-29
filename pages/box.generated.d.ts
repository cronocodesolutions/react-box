import '@cronocode/react-box';

declare module '@cronocode/react-box/types' {
  type ColorType = 'none' | 'white' | 'black' | 'black1' | 'violet' | 'violetLight' | 'violetLighter' | 'gray1';
  type BackgroundType = 'none';
  type ShadowType = 'none';

  namespace Augmented {
    interface BoxProps {
      color?: ColorType;
      colorH?: ColorType;
      colorF?: ColorType;
      colorA?: ColorType;
      bgColor?: ColorType;
      bgColorH?: ColorType;
      bgColorF?: ColorType;
      bgColorA?: ColorType;
      backgroundColor?: ColorType;
      backgroundColorH?: ColorType;
      backgroundColorF?: ColorType;
      backgroundColorA?: ColorType;
      borderColor?: ColorType;
      borderColorH?: ColorType;
      borderColorF?: ColorType;
      borderColorA?: ColorType;
      outlineColor?: ColorType;
      outlineColorH?: ColorType;
      outlineColorF?: ColorType;
      outlineColorA?: ColorType;
      bg?: BackgroundType;
      bgH?: BackgroundType;
      bgF?: BackgroundType;
      bgA?: BackgroundType;
      background?: BackgroundType;
      backgroundH?: BackgroundType;
      backgroundF?: BackgroundType;
      backgroundA?: BackgroundType;
      shadow?: ShadowType;
      shadowH?: ShadowType;
      shadowF?: ShadowType;
      shadowA?: ShadowType;
    }

    interface SvgProps {
      fill?: ColorType;
      fillH?: ColorType;
      fillF?: ColorType;
      fillA?: ColorType;
      stroke?: ColorType;
      strokeH?: ColorType;
      strokeF?: ColorType;
      strokeA?: ColorType;
    }
  }
}
