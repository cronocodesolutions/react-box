import React, { useRef, useState } from 'react';
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
    <TestSvgPathChangeAnimation />
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
      <Svg1 width="30px" fill="purple1" fillH="gray" rotate={0} flipH="yAxis" />
      <div></div>
    </Box>
  );
}

function TestSvgPathChangeAnimation() {
  const [state, setState] = useState(false);

  return (
    <Box p={6}>
      <ButtonCore
        bgColor="purple1"
        bgColorH="gray"
        color="white"
        p={2}
        ml={4}
        onClick={() => {
          setState((prev) => !prev);
        }}
      >
        Clear
      </ButtonCore>
      <Box>{state ? <Svg1 width="30px" stroke="purple1" /> : <Svg2 width="30px" stroke="purple1" />}</Box>
      <Box>
        <BaseSvg viewBox="0 0 10 10" width="30px" stroke="purple1">
          {state ? <path d="M2,2 L8,8" /> : <path d="M8,2 L2,8" />}
        </BaseSvg>
      </Box>
      <Box>
        <BaseSvg viewBox="0 0 10 10" width="30px" stroke="purple1">
          <path d={state ? 'M2,2 L8,8' : 'M8,2 L2,8'} />
        </BaseSvg>
      </Box>
    </Box>
  );
}

function Svg1(props: TestProps) {
  return (
    <BaseSvg viewBox="0 0 10 10" {...props}>
      <path d="M2,2 L8,8" />
    </BaseSvg>
  );
}

function Svg2(props: TestProps) {
  return (
    <BaseSvg viewBox="0 0 10 10" {...props}>
      <path d="M8,2 L2,8" />
    </BaseSvg>
  );
}

type TestProps = Omit<React.ComponentProps<typeof BaseSvg>, 'viewBox' | 'children'>;

function Arrow(props: TestProps) {
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

// function Test(props: TestProps) {
//   return (
//     <BaseSvg {...props}>
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M4.293 8.293a1 1 0 0 1 1.414 0L12 14.586l6.293-6.293a1 1 0 1 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 0 1 0-1.414Z"
//         fill="#000"
//       />
//     </BaseSvg>
//   );
// }
