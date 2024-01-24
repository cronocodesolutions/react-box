import { BoxStyleProps } from './types';

export interface ThemeStyles {
  styles: BoxStyleProps;
  disabled?: BoxStyleProps;
}

export interface ThemeComponentStyles {
  styles: BoxStyleProps;
  disabled?: BoxStyleProps;
  themes?: {
    [name: string]: ThemeStyles;
  };
}

export interface ThemeSetup {
  components?: {
    [name: string]: ThemeComponentStyles;
  };
  button?: ThemeComponentStyles;
  textbox?: ThemeComponentStyles;
  textarea?: ThemeComponentStyles;
  checkbox?: ThemeComponentStyles;
  radioButton?: ThemeComponentStyles;
}

interface BoxAugmentedProps {
  colors: Record<string, string>;
  shadows: Record<string, string>;
  backgrounds: Record<string, string>;
}

// IMPORTANT!!!  DO NOT USE INLINE PROP IN THESE DEFAULT VALUES
const defaultTheme: ThemeSetup = {
  button: {
    styles: {
      display: 'inline-block',
      p: 3,
      cursor: 'pointer',
      b: 1,
      borderRadius: 1,
    },
    disabled: {
      cursor: 'default',
    },
  },
  checkbox: {
    styles: {
      display: 'inline-block',
      b: 1,
      p: 2,
    },
  },
  radioButton: {
    styles: {
      display: 'inline-block',
      b: 1,
      p: 2,
    },
  },
  textbox: {
    styles: {
      display: 'inline-block',
      b: 1,
      borderRadius: 1,
      p: 3,
    },
  },
  textarea: {
    styles: {
      display: 'inline-block',
      b: 1,
      borderRadius: 1,
    },
  },
};

namespace Theme {
  export let Styles: ThemeSetup = defaultTheme;

  export function setup(styles: ThemeSetup) {
    Styles = styles;

    assignDefaultStyles();
  }

  export function setupAugmentedProps(props: BoxAugmentedProps, options?: { namespacePath?: string }) {
    const colorVariables = Object.entries(props.colors)
      .map(([colorName, colorValue]) => `--color${colorName}: ${colorValue};`)
      .join('\n  ');
    const shadowVariables = Object.entries(props.shadows)
      .map(([shadowName, shadowValue]) => `--shadow${shadowName}: ${shadowValue};`)
      .join('\n  ');
    const bgVariables = Object.entries(props.backgrounds)
      .map(([backgroundName, backgroundValue]) => `--background${backgroundName}: ${backgroundValue};`)
      .join('\n  ');

    const variables = [':root {'];
    colorVariables && variables.push(`  ${colorVariables}`);
    shadowVariables && variables.push(`  ${shadowVariables}`);
    bgVariables && variables.push(`  ${bgVariables}`);
    variables.push('}');

    const colorType = Object.keys(props.colors)
      .map((item) => `'${item}'`)
      .join(' | ');
    const backgroundType = Object.keys(props.backgrounds)
      .map((item) => `'${item}'`)
      .join(' | ');
    const shadowType = Object.keys(props.shadows)
      .map((item) => `'${item}'`)
      .join(' | ');

    const boxDts = `import '@cronocode/react-box';
  
  declare module '${options?.namespacePath ?? '@cronocode/react-box/core/types'}' {
    type ColorType = ${colorType};
    type BackgroundType = ${backgroundType};
    type ShadowType = ${shadowType};
  
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
  `;

    return {
      variables: variables.join('\n'),
      boxDts,
    };
  }

  function assignDefaultStyles() {
    const components = Object.keys(defaultTheme) as (keyof ThemeSetup)[];

    components.forEach((component) => {
      const componentStyles = Styles[component];
      const componentDefaultStyles = defaultTheme[component]!;

      if (componentStyles) {
        componentStyles.styles = { ...componentDefaultStyles.styles, ...componentStyles.styles };

        if (componentStyles.disabled && componentDefaultStyles.disabled) {
          componentStyles.disabled = { ...componentDefaultStyles.disabled, ...componentStyles.disabled };
        }
      } else {
        Styles[component] = defaultTheme[component] as any;
      }
    });
  }
}

export default Theme;
