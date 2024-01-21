import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Textbox from '../../src/components/textbox';
import React, { useState } from 'react';
import Code from '../components/code';

export default function BoxPage() {
  const [props, setProps] = useState({
    border: 0,
    borderRadius: 0,
    margin: 0,
    padding: 0,
  });

  const stringProps = Object.entries(props)
    .map(([key, value]) => `${key}={${value}}`)
    .join(' ');

  return (
    <Flex height="fit-screen">
      <Flex style={{ width: 300 }} br={1} p={2} d="column" gap={3}>
        <Box>
          Border
          <Textbox defaultValue={props.border} type="number" onChange={(e) => setProps((prev) => ({ ...prev, border: +e.target.value }))} />
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
          <Textbox defaultValue={props.margin} type="number" onChange={(e) => setProps((prev) => ({ ...prev, margin: +e.target.value }))} />
        </Box>
        <Box>
          Padding
          <Textbox
            defaultValue={props.padding}
            type="number"
            onChange={(e) => setProps((prev) => ({ ...prev, padding: +e.target.value }))}
          />
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
          <Box {...props}>Hello world</Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
