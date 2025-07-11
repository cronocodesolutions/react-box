import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import PageContext from '../pageContext';
import ButtonPage from '../pages/buttonPage';
import CheckboxPage from '../pages/checkboxPage';
import ColorPage from '../pages/colorPage';
import DataGridPage from '../pages/dataGridPage';
import DropdownPage from '../pages/dropdownPage';
import FlexPage from '../pages/flexPage';
import GridPage from '../pages/gridPage';
import HomePage from '../pages/homePage';
import InstallationPage from '../pages/installationPage';
import RadioButtonPage from '../pages/radioButtonPage';
import TextareaPage from '../pages/textareaPage';
import TextboxPage from '../pages/textboxPage';
import ThemeSetupPage from '../pages/themeSetupPage';
import TooltipPage from '../pages/tooltipPage';
import BoxSvg from '../svgs/boxSvg';
import MenuSvg from '../svgs/menuSvg';
import Sidebar from './sidebar';

export default function App() {
  const [open, setOpen] = useState(false);
  const [rightSidebar, setRightSidebar] = useState<React.ReactNode | undefined>();

  return (
    <Box color="violet-950" minHeight="fit-screen" position="relative">
      <ScrollToTop />
      <Box position="sticky" top={0} lg={{ display: 'none' }} bgImage="body-bg" bgColor="white" zIndex={10}>
        <Flex gap={3} pl={2} sm={{ pl: 8 }} py={5}>
          <Button clean onClick={() => setOpen(!open)} borderRadius={1} shadow="small" px={1} borderColor="violet-950">
            <MenuSvg color="violet-950" />
          </Button>
          <NavLink to="/">
            <BoxSvg />
          </NavLink>
        </Flex>
      </Box>
      <Flex jc="space-between">
        <Box
          style={{ backgroundColor: 'rgba(0,0,0,.3)' }}
          position="absolute"
          inset={open ? 0 : undefined}
          lg={{ position: 'static' }}
          props={{ onClick: () => setOpen(!open) }}
          zIndex={10}
        >
          <Sidebar width={70} position="sticky" top={0} ml={open ? 0 : -70} lg={{ ml: 0 }} />
        </Box>

        <Box flex1 overflow="auto" px={2} sm={{ px: 8 }} pt={6} pb={16} maxWidth={270}>
          <PageContext.Provider value={{ rightSidebar, setRightSidebar }}>
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
          </PageContext.Provider>
        </Box>
        <Box width={0} overflow="hidden" xl={{ width: 70 }}>
          {rightSidebar}
        </Box>
      </Flex>
    </Box>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return null;
}
