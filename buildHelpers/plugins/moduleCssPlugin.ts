import { dataToEsm } from '@rollup/pluginutils';
import { PluginOption } from 'vite';
import { styleVariables } from '../../src/types';

export default function moduleCssPlugin(jsonCache: Record<string, Record<string, string>>, mode: string): PluginOption {
  return {
    name: 'moduleCssPlugin',
    enforce: 'post',
    transform(_code: string, id: string, _options?: { ssr?: boolean }) {
      const json = jsonCache[id];

      if (json) {
        let code = _code;

        if (mode !== 'dev') {
          code = dataToEsm(json, {
            compact: true,
            preferConst: true,
            objectShorthand: true,
            namedExports: false,
          });
        }

        styleVariables.widthHeightStringSizes.forEach((value) => {
          ['', 'H', 'F', 'A'].forEach((pseudoClass) => {
            ['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight'].forEach((prop) => {
              const modifiedValue = value.replace('/', '-');

              code = code.replaceAll(`${prop}${pseudoClass}${modifiedValue}":`, `${prop}${pseudoClass}${value}":`);
            });
          });
        });

        return code;
      }
    },
  };
}
