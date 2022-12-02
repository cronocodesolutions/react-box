import React from 'react';
import ReactDOM from 'react-dom/client';
import Box from './../src/box';
import ButtonCore from './../src/components/buttonCore/buttonCore';
import UncontrolledTextboxCore from './../src/components/uncontrolledTextboxCore/uncontrolledTextboxCore';
import Flex from './../src/components/flex/flex';
import FormAsync from '../src/components/formAsync/formAsync';
import UncontrolledCheckboxCore from '../src/components/uncontrolledCheckboxCore/uncontrolledCheckboxCore';
import UncontrolledRadiobuttonCore from '../src/components/uncontrolledRadioButtonCore/uncontrolledRadioButtonCore';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Flex jc="center" ai="center" minHeight="fit-screen" bgColor={1} position="relative">
      <Box styles={{ minWidth: '20rem' }} p={5} bgColor="white" borderRadius={1} color={1}>
        <Box fontSize={18} fontWeight={900} letterSpacing={20}>
          Login
        </Box>
        <FormAsync
          onSubmit={(obj) => {
            console.log(obj);
          }}
        >
          <Box mt={6}>Username</Box>
          <Box mt={3} borderRadius={1}>
            <UncontrolledCheckboxCore name="flagArray" value={3} defaultChecked />
            <UncontrolledCheckboxCore name="flagArray" value="opt 2" />
            <UncontrolledCheckboxCore name="flag" value="opt 3" />
            <UncontrolledRadiobuttonCore name="radio" value="radio 1" />
            <UncontrolledRadiobuttonCore name="radio" value="radio 2" defaultChecked />
            <UncontrolledTextboxCore
              type="number"
              name="username"
              placeholder="Email"
              width="fit"
              bb={2}
              color={1}
              borderColor={1}
              py={3}
              outlineF={2}
              outlineOffset={4}
              outlineColor={1}
              bgColor="white"
            />
          </Box>
          <Box mt={4}>Password</Box>
          <Box mt={3} borderRadius={1} outlineOffset={0}>
            <UncontrolledTextboxCore
              name="password"
              type="password"
              placeholder="Password"
              width="fit"
              bb={2}
              color={1}
              borderColor={1}
              py={3}
              outlineF={2}
              outlineOffset={4}
              outlineColor={1}
              bgColor="white"
            />
          </Box>
          <Flex jc="flex-end" mt={4}>
            <ButtonCore
              type="submit"
              py={2}
              px={4}
              bgColor="teal"
              bgColorH={1}
              color="white"
              // borderRadius={1}
              fontSize={14}
              fontWeight={500}
              outline={3}
              outlineOffset={0}
              outlineColor="teal"
              outlineH={2}
              outlineColorH={1}
              outlineOffsetH={1}
              outlineF={2}
              outlineOffsetF={1}
              outlineColorF={1}
              outlineOffsetA={0}
              outlineA={3}
            >
              Login
            </ButtonCore>
          </Flex>
        </FormAsync>
      </Box>
    </Flex>
    {/* <Box display="grid" minHeight="fit-screen" styles={{ display: 'test', gridTemplateColumns: '200px 1fr' }}>
      <Box inline hover>
        <Box inlineH>content</Box>
        <Box inlineH>content2</Box>
      </Box>
      <Box cursor="pointer" b={1} p={2} hover>
        right
        <Box inline p={2} pH={4} b={2}>
          inner
        </Box>
      </Box>
    </Box>
    <Box p={2}>
      <Box p={2} b={1} borderColor="blue" inline>
        <Box fontWeightF={900} focus>
          <Box textTransformF="uppercase">Name:</Box>
          <UncontrolledTextboxCore name="test1" b={1} p={2} borderRadius={1} outlineF={3} />
        </Box>
      </Box>
      <Box p={2} b={1} borderColor="blue" inline>
        <Box>Super Name:</Box>
        <UncontrolledTextboxCore name="test2" b={1} p={2} borderRadius={1} />
      </Box>
      <Box p={2} b={1} borderColor="blue" inline>
        <ButtonCore b={1} outline={1} p={2} borderRadius={1} outlineF={2} outlineA={3}>
          <Box b={1} colorA="gray" p={2}>
            Click
          </Box>
        </ButtonCore>
      </Box>

      <Box p={2} b={1} borderColor="blue" inline>
        <Box tag="a" props={{ href: '#' }} b={2} p={2} color="red">
          <Box b={1} colorA="gray" p={2}>
            Link
          </Box>
        </Box>
      </Box>
    </Box> */}
    {/* <Flex hover jc="center" b={1} inline p={2}>
      <FormAsync onSubmit={submitHandler}>
        <Box>
          username: <UncontrolledTextboxCore name="userName" bb={1} p={1} outline={2} outlineStyle="dashed" outlineOffset={4} />
        </Box>
        <Box>
          email: <UncontrolledTextboxCore name="email" />
        </Box>
        <Box>
          password: <UncontrolledTextboxCore name="password" type="password" />
        </Box>
      </FormAsync>
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
        <ButtonCore ml={2}>Click me 2</ButtonCore>
      </Box>
      <Box mx="auto" b={2} bg={1} color="navy" shadow={1} shadowh={2} hover>
        test margin auto
      </Box>

      <Box b={1} bColor="brown" boxSizing="content-box">
        Textbox
        <UncontrolledTextboxCore name="email" type="email" p={2} b={1} />
      </Box>
    </Box> */}
  </React.StrictMode>,
);
