import { dataToEsm } from '@rollup/pluginutils';
import { PluginOption } from 'vite';

export default function moduleCssPlugin(jsonCache: Record<string, Record<string, string>>): PluginOption {
  return {
    name: 'moduleCssPlugin',
    apply: 'build',
    enforce: 'post',
    transform(_code: string, id: string, _options?: { ssr?: boolean }) {
      const json = jsonCache[id];

      if (json) {
        const code = dataToEsm(json, {
          compact: true,
          preferConst: true,
          objectShorthand: true,
          namedExports: false,
        });

        return code;
      }
    },
  };
}
