import { describe, expect, it } from 'vitest';
import Theme from './theme';
import { ThemeInternal } from './useTheme';

describe('Theme', () => {
  describe('button component', () => {
    it('has default cursor pointer', () => {
      Theme.setup({});

      expect(ThemeInternal.components?.button?.styles.cursor).to.eq('pointer');
    });

    it('may have ghost theme', () => {
      Theme.setup({
        button: {
          styles: {
            bgColor: 'violet-950',
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

      expect(ThemeInternal.components?.button?.themes?.ghost.cursor).to.eq('copy');

      expect(ThemeInternal.components?.button?.themes?.ghost.hover?.cursor).to.eq('crosshair');
    });
  });
});
