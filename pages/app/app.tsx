import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import PageContext from '../pageContext';
import BoxPage from '../pages/boxPage';
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
import Sidebar from './sidebar';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebar, setRightSidebar] = useState<React.ReactNode | undefined>();
  const [theme, setTheme] = Box.useTheme();
  const location = useLocation();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <Box
      minHeight="fit-screen"
      position="relative"
      theme={{ dark: { bgColor: 'slate-900', color: 'slate-100' }, light: { bgColor: 'white', color: 'slate-900' } }}
      transition="all"
      transitionDuration={200}
    >
      <ScrollToTop />

      {/* Mobile Header */}
      <Box
        position="sticky"
        top={0}
        zIndex={15}
        lg={{ display: 'none' }}
        className="glass"
        bb={1}
        theme={{ dark: { borderColor: 'slate-800' }, light: { borderColor: 'slate-200' } }}
      >
        <Flex ai="center" jc="space-between" px={4} py={3}>
          <Flex ai="center" gap={3}>
            <Button
              clean
              p={2}
              borderRadius={2}
              theme={{
                dark: { bgColor: 'slate-800', color: 'slate-100' },
                light: { bgColor: 'slate-100', color: 'slate-900' },
              }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <NavLink to="/">
              <Flex ai="center" gap={2}>
                <Box width={8} height={8} borderRadius={2} bgImage="gradient-primary" display="flex" ai="center" jc="center">
                  <Box color="white" fontWeight={700} fontSize={14}>
                    B
                  </Box>
                </Box>
                <Box fontWeight={600} fontSize={18}>
                  React Box
                </Box>
              </Flex>
            </NavLink>
          </Flex>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </Flex>
      </Box>

      <Flex>
        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 40,
              }}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <Box
          position="fixed"
          top={0}
          left={0}
          height="fit-screen"
          zIndex={15}
          width={70}
          translateX={sidebarOpen ? 0 : -70}
          lg={{ position: 'sticky', translateX: 0 }}
          style={{ transition: 'transform 0.3s ease-in-out' }}
        >
          <Sidebar toggleTheme={toggleTheme} onClose={() => setSidebarOpen(false)} />
        </Box>

        {/* Main Content */}
        <Box flex1 overflow="auto" minHeight="fit-screen">
          <Box maxWidth={220} mx="auto" px={4} sm={{ px: 8 }} py={8} lg={{ py: 12 }}>
            <PageContext.Provider value={{ rightSidebar, setRightSidebar }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Routes location={location}>
                    <Route index element={<HomePage />} />
                    <Route path="/installation" element={<InstallationPage />} />
                    <Route path="/theme-setup" element={<ThemeSetupPage />} />
                    <Route path="/box" element={<BoxPage />} />
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
                </motion.div>
              </AnimatePresence>
            </PageContext.Provider>
          </Box>
        </Box>

        {/* Right Sidebar (Desktop) */}
        <Box width={0} overflow="hidden" xl={{ width: 60 }} flexShrink={0}>
          {rightSidebar}
        </Box>
      </Flex>
    </Box>
  );
}

function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <Button
      clean
      p={2}
      borderRadius={2}
      theme={{
        dark: { bgColor: 'slate-800', color: 'slate-100' },
        light: { bgColor: 'slate-100', color: 'slate-900' },
      }}
      onClick={toggleTheme}
      transition="all"
      transitionDuration={150}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return null;
}
