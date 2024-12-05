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
import { Routes, Route, NavLink } from 'react-router-dom';
import TextareaPage from '../pages/textareaPage';
import ColorPage from '../pages/colorPage';
import DropdownPage from '../pages/dropdownPage';
import Button from '../../src/components/button';
import { useState } from 'react';
import MenuSvg from '../svgs/menuSvg';
import Sidebar from './sidebar';
import BoxSvg from '../svgs/boxSvg';
import InstallationPage from '../pages/installationPage';
import ThemeSetupPage from '../pages/themeSetupPage';

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <Box color="violet-950" bgImage="body-bg" minHeight="fit-screen" position="relative">
      <Box position="sticky" top={0} lg={{ display: 'none' }} bgImage="body-bg" bgColor="white" zIndex={1}>
        <Flex gap={3} pl={8} py={5}>
          <Button clean onClick={() => setOpen(!open)} borderRadius={1} shadow="small-shadow" px={1} borderColor="violet-950">
            <MenuSvg color="violet-950" />
          </Button>
          <NavLink to="/">
            <BoxSvg />
          </NavLink>
        </Flex>
      </Box>
      <Flex>
        <Box
          style={{ backgroundColor: 'rgba(0,0,0,.3)' }}
          position="absolute"
          inset={open ? 0 : undefined}
          lg={{ position: 'static' }}
          props={{ onClick: () => setOpen(!open) }}
          zIndex={1}
        >
          <Sidebar width={70} position="sticky" top={0} ml={open ? 0 : -70} lg={{ ml: 0 }} />
        </Box>

        <Box flex1 overflow="auto" px={8} pt={6} pb={16} lg={{ pr: 70 }}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/installation" element={<InstallationPage />} />
            <Route path="/theme-setup" element={<ThemeSetupPage />} />
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
    </Box>
  );
}
