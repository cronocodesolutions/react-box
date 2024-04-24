import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from './ssg';
import Box from './box';
import Flex from './components/flex';

describe('SSG', () => {
  it('generates static html', () => {
    const el = <Box>test</Box>;

    const result = renderToStaticMarkup(el);

    expect(result.html).toEqual('<div class="_box">test</div>');
  });

  it('generates static html with hoverGroup', () => {
    const el = (
      <Box hoverGroup="parent">
        <Box hoverGroup={{ parent: { display: 'grid' } }}>test</Box>
      </Box>
    );

    const result = renderToStaticMarkup(el);

    expect(result.html).toEqual('<div class="_box hoverGroupparent"><div class="_box displayHoverparentgrid">test</div></div>');
  });

  it('generates static html with hoverGroup2', () => {
    const el = (
      <html>
        <head>
          <title>my website</title>
        </head>
        <Flex ai="center" position="relative" cursor="pointer" pb={2} pl={2} hoverGroup="parent">
          <Flex
            bgColor="white"
            position="absolute"
            right={0}
            top={6}
            borderRadius={2}
            d="column"
            display="none"
            hoverGroup={{ parent: { display: 'block' } }}
          >
            <Box>test</Box>
          </Flex>
        </Flex>
      </html>
    );

    const result = renderToStaticMarkup(el);

    expect(result.html).toEqual(
      `<html><head><style id="crono-styles">:root{--borderColor: black;--outlineColor: black;--lineHeight: 1.2;--fontSize: 14px;--transitionTime: 0.25s;--svgTransitionTime: 0.3s;#crono-box {position: absolute;top: 0;left: 0;height: 0;}}
html{font-size: 16px;font-family: Arial, sans-serif;}
body{margin: 0;line-height: var(--lineHeight);font-size: var(--fontSize);}
a,ul{all: unset;}
._box{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;background-color: initial;transition: all var(--transitionTime);box-sizing: border-box;font-family: inherit;font-size: inherit;}
._svg{transition: all var(--svgTransitionTime);}._svg path,._svg circle,._svg rect,._svg line {transition: all var(--svgTransitionTime);}
.displayflex{display:flex;}.displaynone{display:none;}.positionrelative{position:relative;}.positionabsolute{position:absolute;}.top6{top:1.5rem;}.right0{right:0rem;}.pb2{padding-bottom:0.5rem;}.pl2{padding-left:0.5rem;}.borderRadius2{border-radius:0.5rem;}.cursorpointer{cursor:pointer;}.aicenter{align-items:center;}.dcolumn{flex-direction:column;}.bgColorwhite{background-color:var(--colorwhite);;}.hoverGroupparent:hover .displayHoverparentblock{display:block;}@media(min-width: 640px){}@media(min-width: 768px){}@media(min-width: 1024px){}@media(min-width: 1280px){}@media(min-width: 1536px){}</style><title>my website</title></head><div class="_box displayflex aicenter positionrelative cursorpointer pb2 pl2 hoverGroupparent"><div class="_box displaynone bgColorwhite positionabsolute right0 top6 borderRadius2 dcolumn displayHoverparentblock"><div class="_box">test</div></div></div></html>`,
    );
  });
});
