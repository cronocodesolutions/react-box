import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Form from '../../src/components/form';

export default function FlexPage() {
  return (
    <Flex p={10} d="column">
      <Box
        fontSize={50}
        lineHeight="font-size"
        bgColor="violet-100"
        width="3/5"
        textDecoration="underline"
        xl={{ hover: { color: 'violet-500' } }}
      >
        This is Flex page
      </Box>

      <Box component="mycomponent" mt={4} hover={{ bgColor: 'violet-500' }} hoverGroup="group">
        <Box component="mycomponent.item1" hoverGroup={{ group: { color: 'red' } }}>
          this is item 1
        </Box>
        <Box component="mycomponent.item2">this is item 2</Box>
      </Box>

      <Form
        onSubmit={(obj, e) => {
          // e.preventDefault();
          // var formData = new FormData(e.currentTarget);

          // console.log(Object.fromEntries(formData));
          console.log(obj);
        }}
      >
        <input name="test" type="hidden" value="2" />
        <input name="test" type="hidden" value="3" />
        {/* <select name="test" multiple>
          <option>test1</option>
          <option>test2</option>
          <option>test3</option>
          <option>test4</option>
        </select> */}

        <button type="submit">click</button>
      </Form>
    </Flex>
  );
}
