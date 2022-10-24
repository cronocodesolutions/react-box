import React from 'react';
import ReactDOM from 'react-dom/client';
import Box from './../src/box';
import ButtonCore from './../src/components/buttonCore/buttonCore';
import UncontrolledTextboxCore from './../src/components/uncontrolledTextboxCore/uncontrolledTextboxCore';
import Flex from './../src/components/flex/flex';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Flex hover jc="center" b={1} inline p={2} ph={4}>
      test
    </Flex>
    <Box>
      <Box styles={{ background: '#ccc', height: '100px' }}>
        <Box fontSize={30}> hello</Box>
        <Box fontSize={30}> hello</Box>
        <Box fontSize={30}> hello</Box>
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
        <Flex width="max-content" className={{ ha: false, max: true }}>
          <Box>
            <Box b={1} bColor="teal" letterSpacing={10}>
              test border
              <Box b={2}>inner text</Box>
            </Box>
          </Box>
        </Flex>
        <ButtonCore p={2} bgColor="blueDark" color="black" tag="span" onClick={() => alert(1)} styles={{ paddingTop: '30px' }}>
          Button
        </ButtonCore>
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
        <ButtonCore bgColor="green" color="white" ml={2}>
          Click me 2
        </ButtonCore>
      </Box>
      <Box mx="auto" b={2}>
        test margin auto
      </Box>

      <Box b={1} bColor="brown">
        Textbox
        <UncontrolledTextboxCore type="email" p={2} b={1} />
      </Box>
    </Box>
  </React.StrictMode>,
);

type Props = React.ComponentProps<typeof ButtonCore>;

function MyButton(props: Props) {
  return <ButtonCore className="button" px={5} py={2} bgColor="blue" color="white" bRadius={2} {...props} />;
}
