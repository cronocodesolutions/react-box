import { describe, expect, it } from 'vitest';
import Theme from './theme';
import useTheme from './useTheme';
import { render } from '@testing-library/react';
import Box from '../../box';
import { BoxThemeStyles } from '../../types';

describe('useTheme', () => {
  describe('button component', () => {
    it('has default cursor pointer', () => {
      let styles: Maybe<BoxThemeStyles>;

      const Com = () => {
        styles = useTheme({ component: 'button' });

        return (
          <Box>
            <Box>test</Box>
          </Box>
        );
      };

      render(<Com />);

      expect(styles?.cursor).to.eq('pointer');
    });

    it('should have ghost theme', () => {
      Theme.setup({
        test: {
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
        },
      });

      let styles: Maybe<BoxThemeStyles>;

      const Com = () => {
        styles = useTheme({ component: 'button', theme: 'ghost' });

        return (
          <Box>
            <Box>test</Box>
          </Box>
        );
      };

      render(
        <Box.Theme theme="test">
          <Com />
        </Box.Theme>,
      );

      expect(styles?.cursor).to.eq('copy');

      expect(styles?.hover?.cursor).to.eq('crosshair');
    });
  });
});
