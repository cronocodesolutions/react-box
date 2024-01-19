import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Dox from '../../src/components/dox';
import DoxSvg from '../../src/components/doxSvg';
import Button from '../../src/components/button';
import Grid from '../../src/components/grid';
import Box from '../../src/box';
import Flex from '../../src/components/flex';

type FontSizeType = React.ComponentProps<typeof Dox>['fontSize'];

export default function DoxPage() {
  const [test, setTest] = useState<FontSizeType>(12);

  const ref = useRef<SVGSVGElement>(null);

  // useLayoutEffect(() => {
  //   console.log(ref.current);
  // }, [ref]);

  return (
    <Dox w="2/3">
      <Button>Click</Button>
      <Box inline>test</Box>
      <Box inline>test2</Box>
      <Flex>flex1</Flex>
      <Flex inline>flex2</Flex>
      <Grid>Grid1</Grid>
      <Grid inline>Grid2</Grid>
      <Dox hover>
        <DoxSvg viewBox="0 0 16 16" className="test" rotateH={90} fill="violet" fillH="red" width="2rem" ref={ref}>
          <path
            d="M14.972 9.778a.75.75 0 0 0-1.5 0h1.5Zm-12.444 0a.75.75 0 0 0-1.5 0h1.5Zm1.157-4.715a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm4.339-3.278.53-.53a.75.75 0 0 0-1.06 0l.53.53Zm3.278 4.339a.75.75 0 1 0 1.06-1.061l-1.06 1.06ZM7.274 10.66a.75.75 0 0 0 1.5 0h-1.5Zm1.5-8.865a.75.75 0 1 0-1.5 0h1.5Zm4.698 7.983v2.031h1.5V9.778h-1.5Zm0 2.031c0 .69-.56 1.25-1.25 1.25v1.5a2.75 2.75 0 0 0 2.75-2.75h-1.5Zm-1.25 1.25H3.778v1.5h8.444v-1.5Zm-8.444 0c-.69 0-1.25-.56-1.25-1.25h-1.5a2.75 2.75 0 0 0 2.75 2.75v-1.5Zm-1.25-1.25V9.778h-1.5v2.031h1.5Zm2.217-5.685 3.809-3.809-1.06-1.06-3.81 3.808 1.061 1.06Zm2.748-3.809 3.809 3.809 1.06-1.061-3.808-3.809-1.06 1.061Zm1.28 8.345V1.795h-1.5v8.865h1.5Z"
            fill="#000"
          />
        </DoxSvg>
      </Dox>
      <Dox display="grid" boxSizing="border-box" width="1/2">
        test2
      </Dox>

      <Dox
        p={4}
        width="2/4"
        margin={2}
        marginVertical={4}
        marginTop={6}
        top={0}
        left={10}
        flexWrap="wrap"
        display="flex"
        flex1
        fontSize={test}
        fontSizeH={30}
        props={{ onClick: () => setTest(20) }}
      >
        test2
      </Dox>
      <Dox bgColor="violet" p={3} component="test" hover>
        <Dox bgColorH="violetLighter" p={4} bgColorF="red" focus>
          <Dox tag="input" p={2} border={1} borderRadius={2} bgColorF="violet" />
          <DoxSvg viewBox="0 0 16 16" rotateH={90} fill="black1" fillF="violet">
            <path
              d="M14.972 9.778a.75.75 0 0 0-1.5 0h1.5Zm-12.444 0a.75.75 0 0 0-1.5 0h1.5Zm1.157-4.715a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm4.339-3.278.53-.53a.75.75 0 0 0-1.06 0l.53.53Zm3.278 4.339a.75.75 0 1 0 1.06-1.061l-1.06 1.06ZM7.274 10.66a.75.75 0 0 0 1.5 0h-1.5Zm1.5-8.865a.75.75 0 1 0-1.5 0h1.5Zm4.698 7.983v2.031h1.5V9.778h-1.5Zm0 2.031c0 .69-.56 1.25-1.25 1.25v1.5a2.75 2.75 0 0 0 2.75-2.75h-1.5Zm-1.25 1.25H3.778v1.5h8.444v-1.5Zm-8.444 0c-.69 0-1.25-.56-1.25-1.25h-1.5a2.75 2.75 0 0 0 2.75 2.75v-1.5Zm-1.25-1.25V9.778h-1.5v2.031h1.5Zm2.217-5.685 3.809-3.809-1.06-1.06-3.81 3.808 1.061 1.06Zm2.748-3.809 3.809 3.809 1.06-1.061-3.808-3.809-1.06 1.061Zm1.28 8.345V1.795h-1.5v8.865h1.5Z"
              fill="#000"
            />
          </DoxSvg>
        </Dox>
      </Dox>
    </Dox>
  );
}
