import Box from '../../src/box';
import Box2 from '../../src/box2';
import Button2 from '../../src/components/button2';

export default function Box2Page() {
  return (
    <Box>
      <Box hover={{ width: 20, m: 5 }} hoverGroup={{ parent: { width: 20 } }}>
        <Box>line 1</Box>
      </Box>

      <Box2
        display="block"
        m={4}
        width={30}
        b={1}
        hover={{ width: 20, m: 5, focus: { m: 5 } }}
        hoverGroup="parent"
        xl={{ width: 30 }}
        md={{ width: 20 }}
      >
        <Box2 hoverGroup={{ parent: { b: 2 } }}>line 1</Box2>
        <Box2 xxl={{ activeGroup: { pp: { display: 'block' } } }}>line 2</Box2>
      </Box2>

      <Button2 width={20}>Click</Button2>

      {/* <Box display="block" mt={10} m={4} width={30} xl={{ width: 30 }} md={{ width: 20 }} b={1} hoverGroup="parent">
        <Box>line 1</Box>
        <Box transition="none" hoverGroup={{ parent: { b: 2 } }} hover={{ b: 3 }}>
          line 2
        </Box>
      </Box> */}
    </Box>
  );
}

// .hoverGroupparent:hover .B{width:5rem;}
