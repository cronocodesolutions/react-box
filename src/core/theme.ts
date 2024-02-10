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
  children?: {
    [name: string]: ThemeComponentStyles;
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
  backgroundImages: Record<string, string>;
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
      userSelect: 'none',
    },
    disabled: {
      cursor: 'default',
    },
  },
  checkbox: {
    styles: {
      display: 'inline-block',
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
    extractChildren(styles);
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
    const bgImagesVariables = Object.entries(props.backgroundImages)
      .map(([backgroundImageName, backgroundImageValue]) => `--backgroundImage${backgroundImageName}: ${backgroundImageValue};`)
      .join('\n  ');

    const variables = [':root {'];
    colorVariables && variables.push(`  ${colorVariables}`);
    shadowVariables && variables.push(`  ${shadowVariables}`);
    bgVariables && variables.push(`  ${bgVariables}`);
    bgImagesVariables && variables.push(`  ${bgImagesVariables}`);
    variables.push('}');

    const colorType = Object.keys(props.colors)
      .map((item) => `'${item}'`)
      .join(' | ');
    const backgroundType = Object.keys(props.backgrounds)
      .map((item) => `'${item}'`)
      .join(' | ');
    const backgroundImageType = Object.keys(props.backgroundImages)
      .map((item) => `'${item}'`)
      .join(' | ');
    const shadowType = Object.keys(props.shadows)
      .map((item) => `'${item}'`)
      .join(' | ');

    const boxDts = `import '@cronocode/react-box';
  
  declare module '${options?.namespacePath ?? '@cronocode/react-box/core/types'}' {
    type ColorType = ${colorType};
    type BackgroundType = ${backgroundType};
    type BackgroundImageType = ${backgroundImageType};
    type ShadowType = ${shadowType};
  
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
  `;

    return {
      variables: variables.join('\n'),
      boxDts,
    };
  }

  function assignDefaultStyles() {
    extractChildren(defaultTheme);
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

  function extractChildren(styles: ThemeSetup) {
    if (!styles.components) return;

    const componentsNames = Object.keys(styles.components);

    for (const componentName of componentsNames) {
      const component = styles.components[componentName];
      const children = getChildren(componentName, component);
      delete component.children;

      for (const item of children) {
        const [name, childrenStyles] = item;

        styles.components[name] = childrenStyles;
      }
    }
  }

  function getChildren(componentName: string, componentStyles: ThemeComponentStyles): [string, ThemeComponentStyles][] {
    if (!componentStyles.children) return [];

    const childrenNames = Object.keys(componentStyles.children);
    const acc: [string, ThemeComponentStyles][] = [];

    for (const childName of childrenNames) {
      const name = `${componentName}.${childName}`;
      const component = componentStyles.children[childName];
      const children = getChildren(name, component);

      acc.push(...children);
      delete component.children;

      acc.push([name, component]);
    }

    return acc;
  }
}

export default Theme;
