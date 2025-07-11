import Box, { BoxProps } from '../../src/box';
import BoxSvg from '../svgs/boxSvg';
import ColorsSvg from '../svgs/colorsSvg';
import ComponentSvg from '../svgs/componentSvg';
import ConfigurationSvg from '../svgs/configurationSvg';
import MenuGrouping from './menuGrouping';
import MenuItem from './menuItem';

export default function Sidebar(props: BoxProps) {
  return (
    <Box height="fit-screen" bgColor="white" bgImage="body-bg" px={1} top={0} br={1} borderColor="violet-100" {...props}>
      <MenuItem to="/" bgColor={undefined} hover={{ bgColor: undefined }} color={undefined} Icon={BoxSvg} pl={2} mt={0}>
        <Box fontWeight={700} py={5}>
          React Box
        </Box>
      </MenuItem>
      <MenuGrouping label="Configuration" Icon={ConfigurationSvg}>
        <MenuItem to="/installation">
          {/* <MenuItem to="/theme" Icon={ThemeSetupSvg}> */}
          Installation
        </MenuItem>
        <MenuItem to="/theme-setup">
          {/* <MenuItem to="/theme" Icon={ThemeSetupSvg}> */}
          Theme setup
        </MenuItem>
      </MenuGrouping>
      <MenuGrouping label="Components" Icon={ComponentSvg}>
        <MenuItem to="/button">
          {/* <MenuItem to="/button" Icon={PointerSvg}> */}
          Button
        </MenuItem>
        <MenuItem to="/textbox">
          {/* <MenuItem to="/textbox" Icon={TextboxSvg}> */}
          Textbox
        </MenuItem>
        <MenuItem to="/textarea">
          {/* <MenuItem to="/textarea" Icon={TextareaSvg}> */}
          Textarea
        </MenuItem>
        <MenuItem to="/checkbox">
          {/* <MenuItem to="/checkbox" Icon={() => <CheckboxSvg checked />}> */}
          Checkbox
        </MenuItem>
        <MenuItem to="/radiobutton">
          {/* <MenuItem to="/radiobutton" Icon={RadioSvg}> */}
          Radio Button
        </MenuItem>
        <MenuItem to="/tooltip">
          {/* <MenuItem to="/tooltip" Icon={TooltipSvg}> */}
          Tooltip
        </MenuItem>
        <MenuItem to="/grid">
          {/* <MenuItem to="/grid" Icon={GridSvg}> */}
          Grid
        </MenuItem>
        <MenuItem to="/dropdown">
          {/* <MenuItem to="/dropdown" Icon={DropdownSvg}> */}
          Dropdown
        </MenuItem>
        <MenuItem to="/datagrid">
          {/* <MenuItem to="/datagrid" Icon={DataGridSvg}> */}
          Data Grid
        </MenuItem>
      </MenuGrouping>

      <MenuItem to="/colors" Icon={ColorsSvg} pl={3}>
        Colors
      </MenuItem>
    </Box>
    // </Box>
  );
}
