import '@cronocode/react-box';
  
  declare module '../src/core/types' {
    type ColorType = 'none' | 'white' | 'black' | 'black1' | 'violet' | 'violetLight' | 'violetLighter' | 'violetDark' | 'gray1' | 'gray2' | 'dark' | 'red';
    type BackgroundType = 'none' | 'stripes';
    type BackgroundImageType = 'check' | 'radio' | 'indeterminate';
    type ShadowType = 'none';
  
    namespace Augmented {
      interface BoxProps {
        color?: ColorType;
        bgColor?: ColorType;
        borderColor?: ColorType;
        outlineColor?: ColorType;
        background?: BackgroundType;
        backgroundImage?: BackgroundImageType;
        shadow?: ShadowType;
      }
  
      interface SvgProps {
        fill?: ColorType;
        stroke?: ColorType;
      }
    }
  }
  