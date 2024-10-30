import Box from '../src/box';
import './extends';

Box.themeSetup({
  components: {
    colorBox: {
      styles: {
        width: 15,
        height: 15,
        b: 1,
        borderRadius: 1,
        hover: { outline: 1, outlineOffset: 1 },
        transition: 'none',
      },
    },
    number: {
      styles: {
        borderRadius: 10,
        bgColor: 'violet-50',
        p: 3,
        lineHeight: 8,
        b: 1,
        borderColor: 'violet-600',
        color: 'violet-600',
      },
    },
  },
});
