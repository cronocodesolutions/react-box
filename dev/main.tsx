import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Box from './../src/box';
import ButtonCore from './../src/components/buttonCore/buttonCore';
import UncontrolledTextboxCore from './../src/components/uncontrolledTextboxCore/uncontrolledTextboxCore';
import Flex from './../src/components/flex/flex';
import FormAsync from '../src/components/formAsync/formAsync';
import UncontrolledCheckboxCore from '../src/components/uncontrolledCheckboxCore/uncontrolledCheckboxCore';
import UncontrolledRadiobuttonCore from '../src/components/uncontrolledRadioButtonCore/uncontrolledRadioButtonCore';
import '/theme.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <TestUncontrolledTextboxCoreRef />
  </React.StrictMode>,
);

function TestUncontrolledTextboxCoreRef() {
  const textBoxRef = useRef<HTMLInputElement>(null);

  return (
    <Box p={6}>
      <UncontrolledTextboxCore b={1} p={2} name="test" ref={textBoxRef} color="purple1" />
      <ButtonCore
        bgColor="purple1"
        bgColorH="gray"
        color="white"
        p={2}
        ml={4}
        onClick={() => {
          textBoxRef.current!.value = '';
          console.log(textBoxRef.current);
        }}
      >
        Clear
      </ButtonCore>
    </Box>
  );
}
