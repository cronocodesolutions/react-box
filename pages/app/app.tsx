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

export default function App() {
  return (
    <Flex height="fit-screen" color="violetDark" backgroundImage="bg">
      <Box height="fit-screen" width={60} px={2}>
        <MenuItem to="/" bgColor={undefined} hover={{ bgColor: undefined }} color={undefined}>
          <Box fontWeight={700} py={5}>
            React Box
          </Box>
        </MenuItem>
        <Box ml={4} color="black" fontWeight={500}>
          Components
        </Box>
        {/* <MenuItem to="/box">Box</MenuItem> */}
        {/* <MenuItem to="/flex">Flex</MenuItem> */}
        <MenuItem to="/button">Button</MenuItem>
        <MenuItem to="/textbox">Textbox</MenuItem>
        <MenuItem to="/textarea">Textarea</MenuItem>
        <MenuItem to="/checkbox">Checkbox</MenuItem>
        <MenuItem to="/radiobutton">Radio Button</MenuItem>
        <MenuItem to="/tooltip">Tooltip</MenuItem>
        <MenuItem to="/grid">Grid</MenuItem>
        <MenuItem to="/datagrid">Data Grid</MenuItem>
      </Box>
      <Box flex1 bl={1} borderColor="violet">
        <Routes>
          <Route index element={<HomePage />} />
          {/* <Route path="/box" element={<BoxPage />} /> */}
          {/* <Route path="/box" element={<BoxPage />} />
          <Route path="/flex" element={<FlexPage />} /> */}
          <Route path="/grid" element={<GridPage />} />
          <Route path="/textbox" element={<TextboxPage />} />
          <Route path="/textarea" element={<TextareaPage />} />
          <Route path="/datagrid" element={<DataGridPage />} />
          <Route path="/button" element={<ButtonPage />} />
          <Route path="/checkbox" element={<CheckboxPage />} />
          <Route path="/radiobutton" element={<RadioButtonPage />} />
          <Route path="/tooltip" element={<TooltipPage />} />
        </Routes>
      </Box>
    </Flex>
  );
}
