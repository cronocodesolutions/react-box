import { pseudoClassSuffixes } from './boxStyles';
import { BoxStyleProps } from './types';
import { BoxThemeProps } from './types';

export interface ThemeStyles<T> {
  styles: T;
}

export interface ThemeComponentStyles<T = BoxStyleProps> extends ThemeStyles<T> {
  themes?: {
    [name: string]: ThemeStyles<T>;
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
}

interface BoxAugmentedProps {
  colors: Record<string, string>;
  shadows: Record<string, string>;
  backgrounds: Record<string, string>;
  backgroundImages: Record<string, string>;
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
  export let Styles: ThemeSetup<BoxStyleProps>;

  export function setup(styles: ThemeSetup<BoxThemeProps>) {
    extractChildren(styles);
    extractPseudoClasses(styles);
    Styles = styles as ThemeSetup<BoxStyleProps>;

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
${getPseudoClassProps('color', 'ColorType')}
${getPseudoClassProps('bgColor', 'ColorType')}
${getPseudoClassProps('borderColor', 'ColorType')}
${getPseudoClassProps('outlineColor', 'ColorType')}
${getPseudoClassProps('background', 'BackgroundType')}
${getPseudoClassProps('backgroundImage', 'BackgroundImageType')}
${getPseudoClassProps('shadow', 'ShadowType')}
      }
  
      interface SvgProps {
${getPseudoClassProps('fill', 'ColorType')}
${getPseudoClassProps('stroke', 'ColorType')}
      }
    }
  }
  `;

    return {
      variables: variables.join('\n'),
      boxDts,
    };
  }

  function getPseudoClassProps(propName: string, propType: string) {
    const pseudoClasses = pseudoClassSuffixes.map((p) => {
      return `        ${propName}${p}?: ${propType};`;
    });
    pseudoClasses.unshift(`        ${propName}?: ${propType};`);

    return pseudoClasses.join('\n');
  }

  function assignDefaultStyles() {
    extractChildren(defaultTheme);
    extractPseudoClasses(defaultTheme);
    const components = Object.keys(defaultTheme) as (keyof ThemeSetup<BoxStyleProps>)[];

    components.forEach((component) => {
      const componentStyles = Styles[component];
      const componentDefaultStyles = (defaultTheme as ThemeSetup<BoxStyleProps>)[component]!;

      if (componentStyles) {
        componentStyles.styles = { ...componentDefaultStyles.styles, ...componentStyles.styles };
      } else {
        Styles[component] = defaultTheme[component] as any;
      }
    });
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
    const { components, ...restStyles } = styles;

    const componentStyles = Object.values(restStyles);
    components && componentStyles.push(...Object.values(components));

    for (const component of componentStyles) {
      [
        ['disabled', 'Disabled'],
        ['indeterminate', 'Indeterminate'],
        ['checked', 'Checked'],
      ].forEach(([name, suffix]) => {
        if (name in component.styles) {
          Object.entries(component.styles[name as keyof typeof component.styles]!).map(([name, value]) => {
            component.styles[`${name}${suffix}` as keyof BoxThemeProps] = value;
          });

          delete component.styles[name as keyof typeof component.styles];
        }
      });
    }
  }
}

export default Theme;
