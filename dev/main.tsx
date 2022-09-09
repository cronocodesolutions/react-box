import React from 'react';
import ReactDOM from 'react-dom/client';
import Box from './../src/box';
import Button from './../src/components/button/button';
import Flex from './../src/components/flex/flex';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Box>
      <Box props={{ style: { background: '#ccc' } }} inlineHeight="100px">
        hello
        <div>
          <Box b={2}>new test </Box>
        </div>
      </Box>
      <Box
        bRadiusTop={3}
        mx={7}
        ml={5}
        m={3}
        pt={4}
        px={9}
        display="block"
        b={3}
        bStyle="dotted"
        bColor="brown"
        cursor="not-allowed"
        fontWeight={900}
        flex1
        color="green"
        marginHorizontal={20}
      >
        <Flex width="max-content" inlineMinHeight="50px" className={{ ha: false, max: true }}>
          <Box>
            <Box b={1} bColor="teal" letterSpacing={10}>
              test border
              <Box b={2}>inner text</Box>
            </Box>
          </Box>
        </Flex>
        <Button p={2} bgColor="blueDark" color="black" tag="span" onClick={() => alert(1)} props={{ style: { paddingTop: '30px' } }}>
          Button
        </Button>
        <Flex>
          <Box flex1>test1</Box>
          <Box>test2</Box>
        </Flex>
      </Box>
      <Box p={2} bx={5} m={2} position="relative">
        <Box b={1} bColor="gray" inset={1} position="absolute">
          absolute
        </Box>

        <Box mt={8}>Buttons</Box>
        <MyButton>Click me</MyButton>
        <Button bgColor="green" color="white" ml={2}>
          Click me 2
        </Button>
      </Box>
      <Box mx="auto" inlineMaxWidth="1000px" b={2}>
        test margin auto
      </Box>
    </Box>
  </React.StrictMode>,
);

type Props = React.ComponentProps<typeof Button>;

function MyButton(props: Props) {
  return <Button className="button" px={5} py={2} bgColor="blue" color="white" bRadius={2} {...props} />;
}
