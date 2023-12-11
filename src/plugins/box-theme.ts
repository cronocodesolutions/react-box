interface BoxThemeOptions {
  colors: Record<string, string>;
  shadows: Record<string, string>;
  backgrounds: Record<string, string>;
}

interface BoxThemeResources {
  themeCss: string;
  boxDts: string;
}

export function boxTheme(options: BoxThemeOptions): BoxThemeResources {
  const colorVariables = Object.entries(options.colors)
    .map(([colorName, colorValue]) => `--color${colorName}: ${colorValue};`)
    .join('\n');
  const shadowVariables = Object.entries(options.shadows)
    .map(([shadowName, shadowValue]) => `--shadow${shadowName}: ${shadowValue};`)
    .join('\n');
  const bgVariables = Object.entries(options.backgrounds)
    .map(([backgroundName, backgroundValue]) => `--background${backgroundName}: ${backgroundValue};`)
    .join('\n');

  const variables = `:root {
  ${colorVariables}
  ${shadowVariables}
  ${bgVariables}
}`;

  const colors = Object.keys(options.colors).map((colorName) => {
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

  const shadows = Object.keys(options.shadows).map((shadowName) => {
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

  const backgrounds = Object.keys(options.backgrounds).map((backgroundName) => {
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

  const colorType = Object.keys(options.colors)
    .map((item) => `'${item}'`)
    .join(' | ');
  const backgroundType = Object.keys(options.backgrounds)
    .map((item) => `'${item}'`)
    .join(' | ');
  const shadowType = Object.keys(options.shadows)
    .map((item) => `'${item}'`)
    .join(' | ');

  const boxTypings = `import {ColorType} from '@cronocode/react-box';

declare module '@cronocode/react-box' {
  type ColorType = ${colorType};
  type BackgroundType = ${backgroundType};
  type ShadowType = ${shadowType};

  namespace Augmented {
    interface Props {
      color?: ColorType;
      colorH?: ColorType;
      colorF?: ColorType;
      colorA?: ColorType;
      bgColor?: ColorType;
      bgColorH?: ColorType;
      bgColorF?: ColorType;
      bgColorA?: ColorType;
      backgroundColor?: ColorType;
      backgroundColorH?: ColorType;
      backgroundColorF?: ColorType;
      backgroundColorA?: ColorType;
      borderColor?: ColorType;
      borderColorH?: ColorType;
      borderColorF?: ColorType;
      borderColorA?: ColorType;
      outlineColor?: ColorType;
      outlineColorH?: ColorType;
      outlineColorF?: ColorType;
      outlineColorA?: ColorType;
      bg?: BackgroundType;
      bgH?: BackgroundType;
      bgF?: BackgroundType;
      bgA?: BackgroundType;
      background?: BackgroundType;
      backgroundH?: BackgroundType;
      backgroundF?: BackgroundType;
      backgroundA?: BackgroundType;
      shadow?: ShadowType;
      shadowH?: ShadowType;
      shadowF?: ShadowType;
      shadowA?: ShadowType;
    }
  }
}

declare module '@cronocode/react-box/components/baseSvg' {
  namespace Augmented {
    interface Props {
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
    themeCss: [variables, ...colors, ...shadows, ...backgrounds].join('\n'),
    boxDts: boxTypings,
  };
}
