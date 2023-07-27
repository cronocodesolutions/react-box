import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
// import Box from './../src/box';
import ButtonCore from './../src/components/buttonCore/buttonCore';
// import UncontrolledTextboxCore from '../src/components/textboxCore/textboxCore';
// import Flex from './../src/components/flex/flex';
// import FormAsync from '../src/components/formAsync/formAsync';
// import UncontrolledCheckboxCore from '../src/components/uncontrolledCheckboxCore/uncontrolledCheckboxCore';
// import UncontrolledRadiobuttonCore from '../src/components/uncontrolledRadioButtonCore/uncontrolledRadioButtonCore';
import '/theme.css';
// import BaseSvg from '../src/components/baseSvg/baseSvg';
// import ClassNameUtils from '../src/utils/className/classNameUtils';
import TextboxCore from '../src/components/textboxCore/textboxCore';
import Box from '../src/box';
import Flex from '../src/components/flex/flex';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Flex>
      <Flex flex1 height="fit-screen" focus className="test" b={1} background="1" shadow="2">
        <Flex color="blue6" colorF="purple1" fontSize={20}>
          test
        </Flex>
        <input type="text" />
        {/* <SigninLeftSide /> */}
      </Flex>
      <Flex flex1 height="fit-screen" alignItems="center" flexDirection="column" p={6}>
        {/* <Flex justifyContent="flex-end" width="fit">
          <Flex alignItems="center" position="relative" cursor="pointer" className={styles.language} pb={2} pl={2}>
            <Box mr={1}>{t[`${selectedLanguage}Lang`]}</Box>
            <Image className={styles.selectedLanguageIcon} src={AppUtils.getUrl('/arrow-down.svg')} />
            <Flex
              bgColor="white"
              position="absolute"
              right={0}
              top={6}
              borderRadius={2}
              flexDirection="column"
              className={styles.languagesBox}
            >
              <LanguageItem language="en" selectedLanguage={selectedLanguage} isTop />
              <LanguageItem language="sv" selectedLanguage={selectedLanguage} />
              <LanguageItem language="no" selectedLanguage={selectedLanguage} />
              <LanguageItem language="es" selectedLanguage={selectedLanguage} isBottom />
            </Flex>
          </Flex>
        </Flex>
        <Flex className={styles.content} flexDirection="column" p={8} flex1 justifyContent="center">
          <Box color="black1" fontSize={32} lineHeight={8}>
            PIHR PAY EQUALITY
          </Box>
          <Box mt={16} fontSize={24}>
            {t.signIn}
          </Box>
          <Box mt={1}>{t.signInMessage}</Box>
          <Box mt={6} props={{ id: 'api' }}>
            <Box props={{ style: { backgroundColor: '#ddd', height: '250px' } }}>
              This is the b2c placeholder, for sign in form, provided by azure b2c
            </Box>
          </Box>
        </Flex>
        <Flex width="fit" justifyContent="flex-end">
          <Image className={styles.logo} src={AppUtils.getUrl('/logo.svg')} />
        </Flex> */}
      </Flex>
    </Flex>
  </React.StrictMode>,
);

function TestRef() {
  const boxRef = useRef(null);
  const textboxRef = useRef<HTMLInputElement>(null);

  return (
    <Box ref={boxRef}>
      <Box>test</Box>
      <TextboxCore
        name="test"
        ref={textboxRef}
        type="date"
        props={{
          onClick: () => {
            alert(textboxRef.current!.value);
          },
        }}
        inline={false}
      />
      <ButtonCore onClick={() => alert(1)}>Click me</ButtonCore>
    </Box>
  );
}

// interface TestClassNameProps {
//   className?: string;
// }

// function TestClassName(props: TestClassNameProps) {
//   const { className } = props;

//   const a: ClassNameUtils.ClassNameType = className;

//   return <Box className={a}>TestClassName</Box>;
// }

// function TestFormComplexObject() {
//   return (
//     <FormAsync onSubmit={(obj) => console.log(obj)}>
//       <UncontrolledTextboxCore name="prop" display="block" b={1} placeholder="prop" defaultValue="max" />
//       <UncontrolledTextboxCore name="prop" display="block" b={1} placeholder="prop" />
//       <Box>User</Box>
//       <UncontrolledTextboxCore name="user.firstname" display="block" b={1} placeholder="user.firstname" />
//       <UncontrolledTextboxCore name="user.lastname" display="block" b={1} placeholder="user.lastname" />
//       <Box>User array</Box>
//       {[0, 1].map((item, index) => (
//         <Box key={index}>
//           <UncontrolledTextboxCore name={`user2[${index}].firstname`} b={1} placeholder={`user2[${index}].firstname`} />
//           <UncontrolledTextboxCore name={`user2[${index}].lastname`} b={1} placeholder={`user2[${index}].lastname`} />
//           <UncontrolledTextboxCore name={`user2[${index}].lastname`} b={1} placeholder={`user2[${index}].lastname`} />
//         </Box>
//       ))}

//       <ButtonCore type="submit">Submit</ButtonCore>
//     </FormAsync>
//   );
// }

// function TestUncontrolledTextboxCoreRef() {
//   const textBoxRef = useRef<HTMLInputElement>(null);

//   return (
//     <Box p={6}>
//       <UncontrolledTextboxCore b={1} p={2} name="test" ref={textBoxRef} color="purple1" />
//       <ButtonCore
//         bgColor="purple1"
//         bgColorH="gray"
//         color="white"
//         p={2}
//         ml={4}
//         onClick={() => {
//           textBoxRef.current!.value = '';
//           console.log(textBoxRef.current);
//         }}
//       >
//         Clear
//       </ButtonCore>
//       <Svg1 width="30px" fill="purple1" fillH="gray" rotate={0} flipH="yAxis" />
//       <div></div>
//     </Box>
//   );
// }

// function TestSvgPathChangeAnimation() {
//   const [state, setState] = useState(false);

//   return (
//     <Box p={6}>
//       <ButtonCore
//         bgColor="purple1"
//         bgColorH="gray"
//         color="white"
//         p={2}
//         ml={4}
//         onClick={() => {
//           setState((prev) => !prev);
//         }}
//       >
//         Clear
//       </ButtonCore>
//       <Box>{state ? <Svg1 width="30px" stroke="purple1" /> : <Svg2 width="30px" stroke="purple1" />}</Box>
//       <Box>
//         <BaseSvg viewBox="0 0 10 10" width="30px" stroke="purple1">
//           {state ? <path d="M2,2 L8,8" /> : <path d="M8,2 L2,8" />}
//         </BaseSvg>
//       </Box>
//       <Box>
//         <BaseSvg viewBox="0 0 10 10" width="30px" stroke="purple1">
//           <path d={state ? 'M2,2 L8,8' : 'M8,2 L2,8'} />
//         </BaseSvg>
//       </Box>
//     </Box>
//   );
// }

// function Svg1(props: TestProps) {
//   return (
//     <BaseSvg viewBox="0 0 10 10" {...props}>
//       <path d="M2,2 L8,8" />
//     </BaseSvg>
//   );
// }

// function Svg2(props: TestProps) {
//   return (
//     <BaseSvg viewBox="0 0 10 10" {...props}>
//       <path d="M8,2 L2,8" />
//     </BaseSvg>
//   );
// }

// type TestProps = Omit<React.ComponentProps<typeof BaseSvg>, 'viewBox' | 'children'>;

// function Arrow(props: TestProps) {
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
