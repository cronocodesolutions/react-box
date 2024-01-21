import { useMemo } from 'react';
import { BoxStyles } from './types';

export interface ThemeStyles {
  styles: BoxStyles;
  disabled?: BoxStyles;
}

export interface ThemeComponentStyles {
  styles: BoxStyles;
  disabled?: BoxStyles;
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
let Styles: ThemeSetup = defaultTheme;

namespace Theme {
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

    const colors = Object.keys(props.colors).map((colorName) => {
      return `
  .color_${colorName},
  .color_h_${colorName}:hover,
  ._h:hover>.color_h_${colorName} {
    color: var(--color${colorName});
  }
  
  .color_f_${colorName}:focus-within,
  ._f:focus-within>.color_f_${colorName} {
    color: var(--color${colorName});
  }
  
  .color_a_${colorName}:active {
    color: var(--color${colorName});
  }
  
  .bgColor_${colorName},
  .bgColor_h_${colorName}:hover,
  ._h:hover>.bgColor_h_${colorName} {
    background-color: var(--color${colorName});
  }
  
  .bgColor_f_${colorName}:focus-within,
  ._f:focus-within>.bgColor_f_${colorName} {
    background-color: var(--color${colorName});
  }
  
  .bgColor_a_${colorName}:active {
    background-color: var(--color${colorName});
  }
  
  .borderColor_${colorName},
  .borderColor_h_${colorName}:hover,
  ._h:hover>.borderColor_h_${colorName} {
    border-color: var(--color${colorName});
  }
  
  .borderColor_f_${colorName}:focus-within,
  ._f:focus-within>.borderColor_f_${colorName} {
    border-color: var(--color${colorName});
  }
  
  .borderColor_a_${colorName}:active {
    border-color: var(--color${colorName});
  }
  
  .outlineColor_${colorName},
  .outlineColor_h_${colorName}:hover,
  ._h:hover>.outlineColor_h_${colorName} {
    outline-color: var(--color${colorName});
  }
  
  .outlineColor_f_${colorName}:focus-within,
  ._f:focus-within>.outlineColor_f_${colorName} {
    outline-color: var(--color${colorName});
  }
  
  .outlineColor_a_${colorName}:active {
    outline-color: var(--color${colorName});
  }
  
  .fill_${colorName},
  .fill_h_${colorName}:hover,
  ._h:hover>.fill_h_${colorName} {
    path,
    circle,
    rect,
    line {
      fill: var(--color${colorName});
    }
  }
  
  .fill_f_${colorName}:focus-within,
  ._f:focus-within>.fill_f_${colorName} {
    path,
    circle,
    rect,
    line {
      fill: var(--color${colorName});
    }
  }
  
  .fill_a_${colorName}:active {
    path,
    circle,
    rect,
    line {
      fill: var(--color${colorName});
    }
  }
  
  .stroke_${colorName},
  .stroke_h_${colorName}:hover,
  ._h:hover>.stroke_h_${colorName} {
    path,
    circle,
    rect,
    line {
      stroke: var(--color${colorName});
    }
  }
  
  .stroke_f_${colorName}:focus-within,
  ._f:focus-within>.stroke_f_${colorName} {
    path,
    circle,
    rect,
    line {
      stroke: var(--color${colorName});
    }
  }
  
  .stroke_a_${colorName}:active {
    path,
    circle,
    rect,
    line {
      stroke: var(--color${colorName});
    }
  }`;
    });

    const shadows = Object.keys(props.shadows).map((shadowName) => {
      return `
  .shadow_${shadowName},
  .shadow_h_${shadowName}:hover,
  ._h:hover>.shadow_h_${shadowName} {
    box-shadow: var(--shadow${shadowName});
  }
  
  .shadow_f_${shadowName}:focus-within,
  ._f:focus-within>.shadow_f_${shadowName} {
    box-shadow: var(--shadow${shadowName});
  }
  
  .shadow_a_${shadowName}:active {
    box-shadow: var(--shadow${shadowName});
  }`;
    });

    const backgrounds = Object.keys(props.backgrounds).map((backgroundName) => {
      return `
  .bg_${backgroundName},
  .bg_h_${backgroundName}:hover,
  ._h:hover>.bg_h_${backgroundName} {
    background: var(--background${backgroundName});
  }
  
  .bg_f_${backgroundName}:focus-within,
  ._f:focus-within>.bg_f_${backgroundName} {
    background: var(--background${backgroundName});
  }
  
  .bg_a_${backgroundName}:active {
    background: var(--background${backgroundName});
  }`;
    });

    const themeCss = [...colors, ...shadows, ...backgrounds].join('\n') + '\n';

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
  
  declare module '${options?.namespacePath ?? '@cronocode/react-box/types'}' {
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
      themeCss,
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

type ReservedComponentName = Exclude<string, keyof Omit<ThemeSetup, 'components'>>;
export interface ThemeComponentProps {
  clean?: boolean;
  disabled?: boolean;
  component?: ReservedComponentName;
  theme?: string;
}

export function useTheme(props: ThemeComponentProps): BoxStyles | undefined {
  const { clean, disabled, theme, component } = props;

  return useMemo(() => {
    if (clean) return undefined;

    let componentStyles = (Styles[component as keyof ThemeSetup] ??
      Styles.components?.[component as keyof ThemeSetup['components']]) as ThemeComponentStyles;
    if (!componentStyles) return undefined;

    let themeStyles = theme ? { ...componentStyles.styles, ...componentStyles.themes?.[theme].styles } : componentStyles.styles;

    if (!disabled) return themeStyles;

    return theme
      ? { ...themeStyles, ...componentStyles.disabled, ...componentStyles.themes?.[theme].disabled }
      : { ...themeStyles, ...componentStyles.disabled };
  }, [component, clean, disabled, theme]);
}
