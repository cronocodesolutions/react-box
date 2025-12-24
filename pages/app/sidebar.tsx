import { motion } from 'framer-motion';
import {
  BookOpen,
  Box as BoxIcon,
  CheckSquare,
  ChevronDown,
  Circle,
  Download,
  Grid3X3,
  Layers,
  List,
  MessageSquare,
  Moon,
  MousePointer2,
  PanelLeft,
  Settings,
  Square,
  Sun,
  Table2,
  TextCursor,
  Type,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';

interface SidebarProps {
  toggleTheme: () => void;
  onClose?: () => void;
}

export default function Sidebar({ toggleTheme, onClose }: SidebarProps) {
  const [theme] = Box.useTheme();

  return (
    <Box
      height="fit-screen"
      theme={{
        dark: { bgImage: 'gradient-sidebar-dark', bgColor: 'slate-900', borderColor: 'slate-800' },
        light: { bgImage: 'gradient-sidebar', borderColor: 'slate-200' },
      }}
      br={1}
      display="flex"
      d="column"
      overflow="hidden"
    >
      {/* Header */}
      <Flex ai="center" jc="space-between" p={4} bb={1} theme={{ dark: { borderColor: 'slate-800' }, light: { borderColor: 'slate-100' } }}>
        <NavLink to="/">
          <Flex ai="center" gap={3}>
            <Box width={10} height={10} borderRadius={2} bgImage="gradient-primary" display="flex" ai="center" jc="center" shadow="medium">
              <BoxIcon size={20} color="white" strokeWidth={2.5} />
            </Box>
            <Box>
              <Box fontWeight={700} fontSize={16} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
                React Box
              </Box>
              <Box fontSize={11} theme={{ dark: { color: 'slate-500' }, light: { color: 'slate-400' } }}>
                v3.1.3
              </Box>
            </Box>
          </Flex>
        </NavLink>
        <Button
          clean
          p={2}
          borderRadius={2}
          display="none"
          lg={{ display: 'none' }}
          theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-500' } }}
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </Flex>

      {/* Navigation */}
      <Box flex1 overflow="auto" py={4} px={3}>
        {/* Getting Started */}
        <MenuSection label="Getting Started">
          <MenuItem to="/" icon={<BookOpen size={16} />}>
            Introduction
          </MenuItem>
          <MenuItem to="/installation" icon={<Download size={16} />}>
            Installation
          </MenuItem>
          <MenuItem to="/theme-setup" icon={<Settings size={16} />}>
            Theme Setup
          </MenuItem>
        </MenuSection>

        {/* Core */}
        <MenuSection label="Core" defaultOpen>
          <MenuItem to="/box" icon={<Square size={16} />}>
            Box
          </MenuItem>
        </MenuSection>

        {/* Components */}
        <MenuSection label="Components" defaultOpen>
          <MenuItem to="/button" icon={<MousePointer2 size={16} />}>
            Button
          </MenuItem>
          <MenuItem to="/textbox" icon={<TextCursor size={16} />}>
            Textbox
          </MenuItem>
          <MenuItem to="/textarea" icon={<Type size={16} />}>
            Textarea
          </MenuItem>
          <MenuItem to="/checkbox" icon={<CheckSquare size={16} />}>
            Checkbox
          </MenuItem>
          <MenuItem to="/radiobutton" icon={<Circle size={16} />}>
            Radio Button
          </MenuItem>
          <MenuItem to="/tooltip" icon={<MessageSquare size={16} />}>
            Tooltip
          </MenuItem>
          <MenuItem to="/dropdown" icon={<List size={16} />}>
            Dropdown
          </MenuItem>
          <MenuItem to="/datagrid" icon={<Table2 size={16} />}>
            Data Grid
          </MenuItem>
        </MenuSection>

        {/* Layout */}
        <MenuSection label="Layout" defaultOpen>
          <MenuItem to="/flex" icon={<PanelLeft size={16} />}>
            Flex
          </MenuItem>
          <MenuItem to="/grid" icon={<Grid3X3 size={16} />}>
            Grid
          </MenuItem>
        </MenuSection>

        {/* Resources */}
        <MenuSection label="Resources">
          <MenuItem to="/colors" icon={<Layers size={16} />}>
            Colors
          </MenuItem>
        </MenuSection>
      </Box>

      {/* Footer */}
      <Box p={4} bt={1} theme={{ dark: { borderColor: 'slate-800' }, light: { borderColor: 'slate-100' } }}>
        <Flex ai="center" jc="space-between">
          <Box fontSize={12} theme={{ dark: { color: 'slate-500' }, light: { color: 'slate-400' } }}>
            <Flex ai="center" gap={2}>
              <Layers size={14} />
              Theme
            </Flex>
          </Box>
          <Button
            clean
            p={2}
            px={3}
            borderRadius={2}
            theme={{
              dark: { bgColor: 'slate-800', color: 'slate-300' },
              light: { bgColor: 'slate-100', color: 'slate-600' },
            }}
            onClick={toggleTheme}
            transition="all"
            transitionDuration={150}
          >
            <Flex ai="center" gap={2}>
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <Box fontSize={12}>{theme === 'dark' ? 'Light' : 'Dark'}</Box>
            </Flex>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

interface MenuSectionProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function MenuSection({ label, children, defaultOpen = true }: MenuSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Box mb={4}>
      <Flex
        ai="center"
        jc="space-between"
        py={2}
        px={3}
        cursor="pointer"
        borderRadius={2}
        props={{ onClick: () => setIsOpen(!isOpen) }}
        transition="all"
        transitionDuration={150}
      >
        <Box
          fontSize={11}
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing={1}
          theme={{ dark: { color: 'slate-500' }, light: { color: 'slate-400' } }}
        >
          {label}
        </Box>
        <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <Box theme={{ dark: { color: 'slate-500' }, light: { color: 'slate-400' } }}>
            <ChevronDown size={14} />
          </Box>
        </motion.div>
      </Flex>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ overflow: 'hidden' }}
      >
        <Box mt={1}>{children}</Box>
      </motion.div>
    </Box>
  );
}

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function MenuItem({ to, icon, children }: MenuItemProps) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Flex
          ai="center"
          gap={3}
          py={2}
          px={3}
          my={0.5}
          borderRadius={2}
          cursor={isActive ? 'default' : 'pointer'}
          transition="all"
          transitionDuration={150}
          bgImage={isActive ? 'gradient-primary' : 'none'}
          theme={{
            dark: { color: isActive ? 'white' : 'slate-300' },
            light: { color: isActive ? 'white' : 'slate-600' },
          }}
          fontWeight={isActive ? 500 : 400}
          fontSize={14}
        >
          <Box
            theme={{
              dark: { color: isActive ? 'white' : 'slate-500' },
              light: { color: isActive ? 'white' : 'slate-400' },
            }}
          >
            {icon}
          </Box>
          {children}
        </Flex>
      )}
    </NavLink>
  );
}
