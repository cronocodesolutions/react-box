import React, { useState } from 'react';
import Dox from '../../src/components/dox/dox';

type FontSizeType = React.ComponentProps<typeof Dox>['fontSize'];

export default function DoxPage() {
  const [test, setTest] = useState<FontSizeType>(12);

  return (
    <Dox>
      <Dox className={['test2']} props={{ onClick: () => alert(1) }} width={30}>
        test
      </Dox>
      <Dox display="grid" boxSizing="border-box" width="1/2">
        test2
      </Dox>

      <Dox
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
      <Dox bgColor="violet" p={3}>
        <Dox bgColorH="violetLighter" p={4}>
          <Dox tag="input" p={2} border={1} borderRadius={2} bgColorF="violet" />
        </Dox>
      </Dox>
    </Dox>
  );
}
