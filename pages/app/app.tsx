import BoxPage from '../pages/boxPage';
import DataGridPage from '../pages/dataGridPage';
import FlexPage from '../pages/flexPage';
import HomePage from '../pages/homePage';
import TextboxPage from '../pages/textboxPage';
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
      </Box>
      <Box p={3}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/box" element={<BoxPage />} />
          <Route path="/flex" element={<FlexPage />} />
          <Route path="/textbox" element={<TextboxPage />} />
          <Route path="/datagrid" element={<DataGridPage />} />
        </Routes>
      </Box>
    </Flex>
  );
}
