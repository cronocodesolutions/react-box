import '@cronocode/react-box';
  
  declare module '../src/core/types' {
    type ColorType = 'none' | 'white' | 'black' | 'black1' | 'violet' | 'violetLight' | 'violetLighter' | 'violetDark' | 'gray1' | 'gray2' | 'dark' | 'red';
    type BackgroundType = 'none' | 'stripes';
    type BackgroundImageType = 'check' | 'radio';
    type ShadowType = 'none';
  
    namespace Augmented {
      interface BoxProps {
        color?: ColorType;
        colorH?: ColorType;
        colorF?: ColorType;
        colorA?: ColorType;
        colorC?: ColorType;
        bgColor?: ColorType;
        bgColorH?: ColorType;
        bgColorF?: ColorType;
        bgColorA?: ColorType;
        bgColorC?: ColorType;
        borderColor?: ColorType;
        borderColorH?: ColorType;
        borderColorF?: ColorType;
        borderColorA?: ColorType;
        borderColorC?: ColorType;
        outlineColor?: ColorType;
        outlineColorH?: ColorType;
        outlineColorF?: ColorType;
        outlineColorA?: ColorType;
        outlineColorC?: ColorType;
        background?: BackgroundType;
        backgroundH?: BackgroundType;
        backgroundF?: BackgroundType;
        backgroundA?: BackgroundType;
        backgroundC?: BackgroundType;
        backgroundImage?: BackgroundImageType;
        backgroundImageH?: BackgroundImageType;
        backgroundImageF?: BackgroundImageType;
        backgroundImageA?: BackgroundImageType;
        backgroundImageC?: BackgroundImageType;
        shadow?: ShadowType;
        shadowH?: ShadowType;
        shadowF?: ShadowType;
        shadowF?: ShadowType;
        shadowA?: ShadowType;
        shadowC?: ShadowType;
      }
  
      interface SvgProps {
        fill?: ColorType;
        fillH?: ColorType;
        fillF?: ColorType;
        fillA?: ColorType;
        fillC?: ColorType;
        stroke?: ColorType;
        strokeH?: ColorType;
        strokeF?: ColorType;
        strokeA?: ColorType;
        strokeC?: ColorType;
      }
    }
  }
  