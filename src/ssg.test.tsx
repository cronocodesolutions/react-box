import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from './ssg';
import Box from './box';
import Flex from './components/flex';

describe('SSG', () => {
  it('generates static html', () => {
    const el = <Box>test</Box>;

    const result = renderToStaticMarkup(el);

    expect(result.html).toEqual('<div class="_b">test</div>');
  });

  it('generates static html with hoverGroup', () => {
    const el = (
      <Box className="parent">
        <Box hoverParent={{ parent: { display: 'grid' } }}>test</Box>
      </Box>
    );

    const result = renderToStaticMarkup(el);

    expect(result.html).toEqual('<div class="_b parent"><div class="_b hover-parent-display-grid">test</div></div>');
  });

  it('generates static html with hoverGroup2', () => {
    const el = (
      <html>
        <head>
          <title>my website</title>
        </head>
        <Flex ai="center" position="relative" cursor="pointer" pb={2} pl={2} className="parent">
          <Flex
            bgColor="white"
            position="absolute"
            right={0}
            top={6}
            borderRadius={2}
            d="column"
            display="none"
            hoverParent={{ parent: { display: 'block' } }}
          >
            <Box>test</Box>
          </Flex>
        </Flex>
      </html>
    );

    const result = renderToStaticMarkup(el);

    const expected = `<html><head><style id="crono-styles">:root{--white: #fff;}:root{--borderColor: black;--outlineColor: black;--lineHeight: 1.2;--fontSize: 14px;--transitionTime: 0.25s;--svgTransitionTime: 0.3s;}#crono-box {position: absolute;top: 0;left: 0;height: 0;}
html{font-size: 16px;font-family: Arial, sans-serif;}
body{margin: 0;line-height: var(--lineHeight);font-size: var(--fontSize);}
a,ul{all: unset;}
._b{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;background-color: initial;transition: all var(--transitionTime);box-sizing: border-box;font-family: inherit;font-size: inherit;}
._s{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;transition: all var(--svgTransitionTime);}._s path,._s circle,._s rect,._s line {transition: all var(--svgTransitionTime);}
.borderRadius-2{border-radius:0.5rem}.position-relative{position:relative}.position-absolute{position:absolute}.top-6{top:1.5rem}.right-0{right:0rem}.cursor-pointer{cursor:pointer}.display-flex{display:flex}.display-none{display:none}.ai-center{align-items:center}.d-column{flex-direction:column}.pb-2{padding-bottom:0.5rem}.pl-2{padding-left:0.5rem}.bgColor-white{background-color:var(--white)}.parent:hover .hover-parent-display-block{display:block}</style><title>my website</title></head><div class="_b display-flex ai-center position-relative cursor-pointer pb-2 pl-2 parent"><div class="_b display-none bgColor-white position-absolute right-0 top-6 borderRadius-2 d-column hover-parent-display-block"><div class="_b">test</div></div></div></html>`;

    expect(result.html).toEqual(expected);
  });

  it('multiple generations of static html', () => {
    const el = (
      <Box className="parent">
        <Box hoverParent={{ parent: { display: 'grid' } }}>test</Box>
      </Box>
    );
    const el2 = (
      <Box inline>
        <Box width={20}>test</Box>
      </Box>
    );

    const result = renderToStaticMarkup(el);
    const result2 = renderToStaticMarkup(el2);

    const expected1 = '<div class="_b parent"><div class="_b hover-parent-display-grid">test</div></div>';
    const expected2 = '<div class="_b inline-true"><div class="_b width-20">test</div></div>';

    expect(result.html).toEqual(expected1);
    expect(result2.html).toEqual(expected2);

    expect(result.styles).includes('display:grid');
    expect(result2.styles).not.includes('display:grid');
    expect(result2.styles).includes('display:inline-block');
  });
});
