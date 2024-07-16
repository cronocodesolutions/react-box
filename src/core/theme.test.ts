import { describe, expect, it } from 'vitest';
import Theme from './theme';

describe('Theme', () => {
  describe('button component', () => {
    it('has default cursor pointer', () => {
      Theme.setup({});

      expect(Theme.Styles.components?.button?.styles.cursor).to.eq('pointer');
    });

    it('may have ghost theme', () => {
      Theme.setup({
        button: {
          styles: {
            bgColor: 'dark',
            cursor: 'alias',
          },
          themes: {
            ghost: {
              cursor: 'copy',
              hover: {
                cursor: 'crosshair',
              },
            },
          },
        },
      });

      expect(Theme.Styles.components?.button?.themes?.ghost.cursor).to.eq('copy');
      // @ts-ignore
      expect(Theme.Styles.components?.button?.themes?.ghost.cursorhover).to.eq('crosshair');
    });
  });
});
