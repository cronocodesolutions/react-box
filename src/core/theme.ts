import { PseudoClassSuffix, boxBreakpoints, pseudoClassSuffixes } from './boxStyles';
import { BoxStyleProps, BoxThemeProps } from './types';

export interface ThemeStyles<T> {
  styles: T;
}

export interface ThemeComponentStyles<T = BoxStyleProps> extends ThemeStyles<T> {
  themes?: {
    [name: string]: T;
  };
  children?: {
    [name: string]: ThemeComponentStyles<T>;
  };
}

export interface ThemeSetup<T = BoxStyleProps> {
  components?: {
    [name: string]: ThemeComponentStyles<T>;
  };
  button?: ThemeComponentStyles<T>;
  textbox?: ThemeComponentStyles<T>;
  textarea?: ThemeComponentStyles<T>;
  checkbox?: ThemeComponentStyles<T>;
  radioButton?: ThemeComponentStyles<T>;
  label?: ThemeComponentStyles<T>;
}

interface BoxAugmentedProps {
  colors?: Record<string, string>;
  shadows?: Record<string, string>;
  backgrounds?: Record<string, string>;
  backgroundImages?: Record<string, string>;
}

// IMPORTANT!!!  DO NOT USE INLINE PROP IN THESE DEFAULT VALUES
const defaultTheme: ThemeSetup<BoxThemeProps> = {
  button: {
    styles: {
      display: 'inline-block',
      p: 3,
      cursor: 'pointer',
      b: 1,
      borderRadius: 1,
      userSelect: 'none',
      disabled: {
        cursor: 'default',
      },
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
  export let Styles = {} as ThemeSetup;

  export function setup(styles: ThemeSetup<BoxThemeProps>) {
    Styles = flattenStyles(defaultTheme);

    assignCustomStyles(styles);
  }

  export function setupAugmentedProps(props: BoxAugmentedProps, options?: { namespacePath?: string }) {
    const { colors = {}, shadows = {}, backgrounds = {}, backgroundImages = {} } = props;
    colors['none'] = 'none';
    shadows['none'] = 'none';
    backgrounds['none'] = 'none';
    backgroundImages['none'] = 'none';

    const colorVariables = Object.entries(colors)
      .map(([colorName, colorValue]) => `--color${colorName}: ${colorValue};`)
      .join('\n  ');
    const shadowVariables = Object.entries(shadows)
      .map(([shadowName, shadowValue]) => `--shadow${shadowName}: ${shadowValue};`)
      .join('\n  ');
    const bgVariables = Object.entries(backgrounds)
      .map(([backgroundName, backgroundValue]) => `--background${backgroundName}: ${backgroundValue};`)
      .join('\n  ');
    const bgImagesVariables = Object.entries(backgroundImages)
      .map(([backgroundImageName, backgroundImageValue]) => `--backgroundImage${backgroundImageName}: ${backgroundImageValue};`)
      .join('\n  ');

    const variables = [':root {'];
    colorVariables && variables.push(`  ${colorVariables}`);
    shadowVariables && variables.push(`  ${shadowVariables}`);
    bgVariables && variables.push(`  ${bgVariables}`);
    bgImagesVariables && variables.push(`  ${bgImagesVariables}`);
    variables.push('}');

    const colorType = Object.keys(colors)
      .map((item) => `'${item}'`)
      .join(' | ');
    const backgroundType = Object.keys(backgrounds)
      .map((item) => `'${item}'`)
      .join(' | ');
    const backgroundImageType = Object.keys(backgroundImages)
      .map((item) => `'${item}'`)
      .join(' | ');
    const shadowType = Object.keys(shadows)
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
  `;

    return {
      variables: variables.join('\n'),
      boxDts,
    };
  }

  function assignCustomStyles(styles: ThemeSetup<BoxThemeProps>) {
    const fStyles = flattenStyles(styles);
    if (!fStyles.components) return;

    Object.entries(fStyles.components).forEach(([name, componentStyles]) => {
      const componentDefaultStyles = Styles.components?.[name];

      if (componentDefaultStyles) {
        Styles.components![name].styles = { ...componentDefaultStyles.styles, ...componentStyles.styles };
      } else {
        Styles.components![name] = componentStyles;
      }
    });

    return fStyles;
  }

  function flattenStyles(styles: ThemeSetup<BoxThemeProps>): ThemeSetup<BoxStyleProps> {
    moveShortcuts(styles);
    extractChildren(styles);
    extractPseudoClasses(styles);

    return styles as ThemeSetup<BoxStyleProps>;
  }

  function moveShortcuts(styles: ThemeSetup<BoxThemeProps>) {
    const { components, ...restStyles } = styles;

    const entries = Object.entries(restStyles);

    if (entries.length && !styles.components) {
      styles.components = {};
    }

    for (const item of entries) {
      const [name, value] = item;

      styles.components![name] = value;

      delete styles[name as keyof typeof styles];
    }
  }

  function extractChildren(styles: ThemeSetup<BoxThemeProps>) {
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

  function getChildren(
    componentName: string,
    componentStyles: ThemeComponentStyles<BoxThemeProps>,
  ): [string, ThemeComponentStyles<BoxThemeProps>][] {
    if (!componentStyles.children) return [];

    const childrenNames = Object.keys(componentStyles.children);
    const acc: [string, ThemeComponentStyles<BoxThemeProps>][] = [];

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

  function extractPseudoClasses(styles: ThemeSetup<BoxThemeProps>) {
    if (!styles.components) return;

    const componentsToFlatten = Object.values(styles.components);

    for (const component of componentsToFlatten) {
      flattenPseudoClasses(component.styles);

      boxBreakpoints.forEach((breakPoint) => {
        if (breakPoint in component.styles) {
          const breakPointStyles = component.styles[breakPoint as keyof typeof component.styles] as BoxThemeProps;

          flattenPseudoClasses(breakPointStyles);
        }
      });

      if (component.themes) {
        Object.values(component.themes).forEach((themeStyles) => {
          flattenPseudoClasses(themeStyles);

          boxBreakpoints.forEach((breakPoint) => {
            if (breakPoint in themeStyles) {
              const breakPointStyles = themeStyles[breakPoint as keyof typeof themeStyles] as BoxThemeProps;

              flattenPseudoClasses(breakPointStyles);
            }
          });
        });
      }
    }
  }

  function flattenPseudoClasses(styles: BoxThemeProps) {
    pseudoClassSuffixes.forEach((suffix) => {
      if (suffix in styles) {
        const pseudoClassStyles = styles[suffix as keyof BoxThemeProps] as BoxThemeProps;

        Object.entries(pseudoClassStyles).map(([name, value]) => {
          styles[`${name}${suffix}` as keyof BoxThemeProps] = value;
        });

        delete styles[suffix as keyof BoxThemeProps];
      }
    });
  }
}

export default Theme;
