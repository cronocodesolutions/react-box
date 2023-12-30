import BoxPage from '../pages/boxPage';
import ButtonPage from '../pages/buttonPage';
import CheckboxPage from '../pages/checkboxPage';
import DataGridPage from '../pages/dataGridPage';
import FlexPage from '../pages/flexPage';
import HomePage from '../pages/homePage';
import RadioButtonPage from '../pages/radioButtonPage';
import TextboxPage from '../pages/textboxPage';
import TooltipPage from '../pages/tooltipPage';
import Box from './../../src/box';
import Flex from './../../src/components/flex/flex';
import MenuItem from './menuItem';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Flex height="fit-screen">
      <Box height="fit-screen" style={{ width: '200px' }} bgColor="violetLighter" px={2}>
        <MenuItem to="/" bgColor={undefined} bgColorH={undefined} color={undefined}>
          <Box fontWeight={700} py={5}>
            React Box
          </Box>
        </MenuItem>
        <MenuItem to="/box">Box</MenuItem>
        <MenuItem to="/flex">Flex</MenuItem>
        <MenuItem to="/textbox">Textbox</MenuItem>
        <MenuItem to="/datagrid">Data Grid</MenuItem>
        <MenuItem to="/button">Button</MenuItem>
        <MenuItem to="/checkbox">Checkbox</MenuItem>
        <MenuItem to="/radiobutton">Radio Button</MenuItem>
        <MenuItem to="/tooltip">Tooltip</MenuItem>
      </Box>
      <Box flex1>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/box" element={<BoxPage />} />
          <Route path="/flex" element={<FlexPage />} />
          <Route path="/textbox" element={<TextboxPage />} />
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
