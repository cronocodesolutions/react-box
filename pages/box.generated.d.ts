import '@cronocode/react-box';
  
  declare module '../src/core/types' {
    type ColorType = 'none' | 'white' | 'black' | 'black1' | 'violet' | 'violetLight' | 'violetLighter' | 'violetDark' | 'gray1' | 'gray2' | 'dark' | 'red';
    type BackgroundType = 'none' | 'stripes';
    type BackgroundImageType = 'check' | 'radio' | 'indeterminate';
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
        borderColor?: ColorType;
        borderColorH?: ColorType;
        borderColorF?: ColorType;
        borderColorA?: ColorType;
        outlineColor?: ColorType;
        outlineColorH?: ColorType;
        outlineColorF?: ColorType;
        outlineColorA?: ColorType;
        background?: BackgroundType;
        backgroundH?: BackgroundType;
        backgroundF?: BackgroundType;
        backgroundA?: BackgroundType;
        backgroundImage?: BackgroundImageType;
        backgroundImageH?: BackgroundImageType;
        backgroundImageF?: BackgroundImageType;
        backgroundImageA?: BackgroundImageType;
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
  