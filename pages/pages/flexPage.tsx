import Box from '../../src/box';
import Checkbox from '../../src/components/checkbox';
import Flex from '../../src/components/flex';
import Form from '../../src/components/form';
import { H1, H2, H3, H4, H5, H6, Label, Nav } from '../../src/components/semantics';

export default function FlexPage() {
  return (
    <Flex d="column">
      <Label>
        tetst <Checkbox />
      </Label>

      <H1>H1</H1>
      <H2>H2</H2>
      <H3>H3</H3>
      <H4>H4</H4>
      <H5>H5</H5>
      <H6>H6</H6>
      <Nav>nav</Nav>

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

      <Box mt={4} hover={{ bgColor: 'violet-500' }} className="group">
        <Box hoverGroup={{ group: { color: 'red' } }}>this is item 1</Box>
        <Box>this is item 2</Box>
      </Box>

      <Form
        onSubmit={(obj, e) => {
          // e.preventDefault();
          // var formData = new FormData(e.currentTarget);
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
