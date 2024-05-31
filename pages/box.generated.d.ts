import '@cronocode/react-box';
  
  declare module '../src/core/types' {
    type ColorType = 'white' | 'black' | 'black1' | 'violet' | 'violetLight' | 'violetLighter' | 'violetDark' | 'gray1' | 'gray2' | 'dark' | 'red' | 'none';
    type BackgroundType = 'stripes' | 'bg' | 'bg2' | 'none';
    type BackgroundImageType = 'bg' | 'check' | 'radio' | 'radio2' | 'indeterminate' | 'none';
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
  