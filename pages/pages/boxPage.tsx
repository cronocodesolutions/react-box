import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Textbox from '../../src/components/textbox';
import { useState } from 'react';
import Code from '../components/code';

export default function BoxPage() {
  const [props, setProps] = useState({
    b: 0,
    borderRadius: 0,
    m: 0,
    p: 0,
  });

  const stringProps = Object.entries(props)
    .map(([key, value]) => `${key}={${value}}`)
    .join(' ');

  return (
    <Flex height="fit-screen">
      <Flex style={{ width: 300 }} br={1} p={2} d="column" gap={3}>
        <Box>
          Border
          <Textbox defaultValue={props.b} type="number" onChange={(e) => setProps((prev) => ({ ...prev, b: +e.target.value }))} />
        </Box>
        <Box>
          Border radius
          <Textbox
            defaultValue={props.borderRadius}
            type="number"
            onChange={(e) => setProps((prev) => ({ ...prev, borderRadius: +e.target.value }))}
          />
        </Box>
        <Box>
          Margin
          <Textbox defaultValue={props.m} type="number" onChange={(e) => setProps((prev) => ({ ...prev, m: +e.target.value }))} />
        </Box>
        <Box>
          Padding
          <Textbox defaultValue={props.p} type="number" onChange={(e) => setProps((prev) => ({ ...prev, p: +e.target.value }))} />
        </Box>
      </Flex>
      <Flex flex1 d="column">
        <Flex flex1 ai="center" jc="center" bb={1}>
          <Code language="javascript">
            {`import Box from '@cronocode/react-box';

function Component () {
  <Box ${stringProps}>Hello world</Box>;
}`}
          </Code>
        </Flex>
        <Flex flex1 ai="center" jc="center">
          {/* @ts-ignore */}
          <Box {...props}>Hello world</Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
