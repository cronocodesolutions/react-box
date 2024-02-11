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
        colorChecked?: ColorType;
        colorIndeterminate?: ColorType;
        colorValid?: ColorType;
        colorInvalid?: ColorType;
        colorRequired?: ColorType;
        colorOptional?: ColorType;
        bgColor?: ColorType;
        bgColorH?: ColorType;
        bgColorF?: ColorType;
        bgColorA?: ColorType;
        bgColorChecked?: ColorType;
        bgColorIndeterminate?: ColorType;
        bgColorValid?: ColorType;
        bgColorInvalid?: ColorType;
        bgColorRequired?: ColorType;
        bgColorOptional?: ColorType;
        borderColor?: ColorType;
        borderColorH?: ColorType;
        borderColorF?: ColorType;
        borderColorA?: ColorType;
        borderColorChecked?: ColorType;
        borderColorIndeterminate?: ColorType;
        borderColorValid?: ColorType;
        borderColorInvalid?: ColorType;
        borderColorRequired?: ColorType;
        borderColorOptional?: ColorType;
        outlineColor?: ColorType;
        outlineColorH?: ColorType;
        outlineColorF?: ColorType;
        outlineColorA?: ColorType;
        outlineColorChecked?: ColorType;
        outlineColorIndeterminate?: ColorType;
        outlineColorValid?: ColorType;
        outlineColorInvalid?: ColorType;
        outlineColorRequired?: ColorType;
        outlineColorOptional?: ColorType;
        background?: BackgroundType;
        backgroundH?: BackgroundType;
        backgroundF?: BackgroundType;
        backgroundA?: BackgroundType;
        backgroundChecked?: BackgroundType;
        backgroundIndeterminate?: BackgroundType;
        backgroundValid?: BackgroundType;
        backgroundInvalid?: BackgroundType;
        backgroundRequired?: BackgroundType;
        backgroundOptional?: BackgroundType;
        backgroundImage?: BackgroundImageType;
        backgroundImageH?: BackgroundImageType;
        backgroundImageF?: BackgroundImageType;
        backgroundImageA?: BackgroundImageType;
        backgroundImageChecked?: BackgroundImageType;
        backgroundImageIndeterminate?: BackgroundImageType;
        backgroundImageValid?: BackgroundImageType;
        backgroundImageInvalid?: BackgroundImageType;
        backgroundImageRequired?: BackgroundImageType;
        backgroundImageOptional?: BackgroundImageType;
        shadow?: ShadowType;
        shadowH?: ShadowType;
        shadowF?: ShadowType;
        shadowA?: ShadowType;
        shadowChecked?: ShadowType;
        shadowIndeterminate?: ShadowType;
        shadowValid?: ShadowType;
        shadowInvalid?: ShadowType;
        shadowRequired?: ShadowType;
        shadowOptional?: ShadowType;
      }
  
      interface SvgProps {
        fill?: ColorType;
        fillH?: ColorType;
        fillF?: ColorType;
        fillA?: ColorType;
        fillChecked?: ColorType;
        fillIndeterminate?: ColorType;
        fillValid?: ColorType;
        fillInvalid?: ColorType;
        fillRequired?: ColorType;
        fillOptional?: ColorType;
        stroke?: ColorType;
        strokeH?: ColorType;
        strokeF?: ColorType;
        strokeA?: ColorType;
        strokeChecked?: ColorType;
        strokeIndeterminate?: ColorType;
        strokeValid?: ColorType;
        strokeInvalid?: ColorType;
        strokeRequired?: ColorType;
        strokeOptional?: ColorType;
      }
    }
  }
  