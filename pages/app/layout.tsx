import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import TableOfContents from '../components/tableOfContents';
import PageContext, { TocEntry } from '../pageContext';
import Sidebar from './sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tocEntries, setTocEntries] = useState<TocEntry[]>([]);
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
      theme={{
        dark: { bgColor: 'slate-900', color: 'slate-100', bgImage: 'gradient-aurora-dark' },
        light: { bgColor: 'white', color: 'slate-900', bgImage: 'gradient-aurora-light' },
      }}
    >
      <ScrollToTop />

      {/* Mobile Header */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        lg={{ display: 'none' }}
        bb={1}
        theme={{
          dark: { borderColor: 'slate-800' },
          light: { borderColor: 'slate-200' },
        }}
        backdropFilter="blur(12px)"
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
                zIndex: 4,
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
          zIndex={5}
          width={70}
          translateX={sidebarOpen ? 0 : -70}
          lg={{ position: 'sticky', translateX: 0, zIndex: 3 }}
          style={{ transition: 'transform 0.3s ease-in-out' }}
        >
          <Sidebar toggleTheme={toggleTheme} onClose={() => setSidebarOpen(false)} />
        </Box>

        {/* Main Content + Right Sidebar */}
        <PageContext.Provider value={{ tocEntries, setTocEntries }}>
          <Box flex1 minWidth={0} minHeight="fit-screen">
            <Box maxWidth={300} mx="auto" px={4} sm={{ px: 8 }} py={8} lg={{ py: 12 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>
          {tocEntries.length > 0 && (
            <Box width={50} flexShrink={0} display="none" xl={{ display: 'block' }}>
              <Box position="sticky" top={0} maxHeight="fit-screen" overflow="auto" py={8} pr={4}>
                <TableOfContents entries={tocEntries} />
              </Box>
            </Box>
          )}
        </PageContext.Provider>
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
