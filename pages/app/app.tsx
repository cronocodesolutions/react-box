import BoxPage from '../pages/boxPage';
import ButtonPage from '../pages/buttonPage';
import CheckboxPage from '../pages/checkboxPage';
import DataGridPage from '../pages/dataGridPage';
import FlexPage from '../pages/flexPage';
import GridPage from '../pages/gridPage';
import HomePage from '../pages/homePage';
import RadioButtonPage from '../pages/radioButtonPage';
import TextboxPage from '../pages/textboxPage';
import TooltipPage from '../pages/tooltipPage';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import MenuItem from './menuItem';
import { Routes, Route } from 'react-router-dom';
import TextareaPage from '../pages/textareaPage';
import ColorPage from '../pages/colorPage';
import DropdownPage from '../pages/dropdownPage';
import PointerSvg from '../svgs/pointerSvg';
import TextboxSvg from '../svgs/textboxSvg';
import TextareaSvg from '../svgs/textareaSvg';
import CheckboxSvg from '../svgs/checkboxSvg';
import TooltipSvg from '../svgs/tooltipSvg';
import GridSvg from '../svgs/gridSvg';
import DropdownSvg from '../svgs/dropdownSvg';
import DataGridSvg from '../svgs/dataGridSvg';
import ColorsSvg from '../svgs/colorsSvg';
import RadioSvg from '../svgs/radioSvg';
import BoxSvg from '../svgs/boxSvg';

export default function App() {
  return (
    <Flex height="fit-screen" color="violet-950" bgImage="body-bg">
      <Box height="fit-screen" md={{ width: 55, px: 2 }} width={14} px={1}>
        <MenuItem to="/" bgColor={undefined} hover={{ bgColor: undefined }} color={undefined} Icon={BoxSvg}>
          <Box fontWeight={700} py={5}>
            React Box
          </Box>
        </MenuItem>
        <MenuItem to="/button" Icon={PointerSvg}>
          Button
        </MenuItem>
        <MenuItem to="/textbox" Icon={TextboxSvg}>
          Textbox
        </MenuItem>
        <MenuItem to="/textarea" Icon={TextareaSvg}>
          Textarea
        </MenuItem>
        <MenuItem to="/checkbox" Icon={CheckboxSvg}>
          Checkbox
        </MenuItem>
        <MenuItem to="/radiobutton" Icon={RadioSvg}>
          Radio Button
        </MenuItem>
        <MenuItem to="/tooltip" Icon={TooltipSvg}>
          Tooltip
        </MenuItem>
        <MenuItem to="/grid" Icon={GridSvg}>
          Grid
        </MenuItem>
        <MenuItem to="/dropdown" Icon={DropdownSvg}>
          Dropdown
        </MenuItem>
        <MenuItem to="/datagrid" Icon={DataGridSvg}>
          Data Grid
        </MenuItem>
        <MenuItem to="/colors" Icon={ColorsSvg}>
          Colors
        </MenuItem>
      </Box>
      <Box flex1 bl={1} borderColor="violet-100" overflow="auto" px={3}>
        <Routes>
          <Route index element={<HomePage />} />
          {/* <Route path="/box" element={<BoxPage />} />
           */}
          <Route path="/flex" element={<FlexPage />} />
          <Route path="/grid" element={<GridPage />} />
          <Route path="/textbox" element={<TextboxPage />} />
          <Route path="/textarea" element={<TextareaPage />} />
          <Route path="/datagrid" element={<DataGridPage />} />
          <Route path="/button" element={<ButtonPage />} />
          <Route path="/checkbox" element={<CheckboxPage />} />
          <Route path="/radiobutton" element={<RadioButtonPage />} />
          <Route path="/tooltip" element={<TooltipPage />} />
          <Route path="/dropdown" element={<DropdownPage />} />
          <Route path="/colors" element={<ColorPage />} />
        </Routes>
      </Box>
    </Flex>
  );
}
