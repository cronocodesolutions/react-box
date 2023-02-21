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
import BaseSvg from '../src/components/baseSvg/baseSvg';

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
      <svg></svg>
      <Test width="30px" fill="purple1" fillH="gray" rotate={0} flipH="yAxis" />
      <div></div>
    </Box>
  );
}

type TestProps = Omit<React.ComponentProps<typeof BaseSvg>, 'viewBox' | 'children'>;

function Test(props: TestProps) {
  return (
    <BaseSvg {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.293 8.293a1 1 0 0 1 1.414 0L12 14.586l6.293-6.293a1 1 0 1 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 0 1 0-1.414Z"
        fill="#000"
      />
    </BaseSvg>
  );
}
