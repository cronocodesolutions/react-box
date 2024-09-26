import Box from '../../src/box';
import Box2 from '../../src/box2';
import Button2 from '../../src/components/button2';

export default function Box2Page() {
  return (
    <Box borderRadiusTop={2} b={2} bx={10}>
      <Box2
        display="block"
        inline
        m={4}
        width={30}
        b={1}
        hover={{ width: 20, m: 5, focus: { m: 5 } }}
        hoverGroup="parent"
        xl={{ width: 30 }}
        md={{ width: 20 }}
        borderRadiusTop={2}
      >
        <Box2 hoverGroup={{ parent: { b: 2 } }}>line 1</Box2>
        <Box2 xxl={{ activeGroup: { pp: { display: 'block' } } }}>line 2</Box2>
      </Box2>

      <Box2 disabled={[false, { b: 5, width: 10 }]}>test</Box2>

      <Button2 color="black" bgColor="violetLight" borderColor="black" hover={{ bgColor: 'violet' }} onClick={() => alert(3)}>
        Click
      </Button2>
    </Box>
  );
}
