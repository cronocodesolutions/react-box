import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export default function PageHeader({ icon: Icon, title, description, badge }: PageHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Box mb={10}>
        <Flex ai="center" gap={4} mb={4}>
          {Icon && (
            <Box width={12} height={12} display="flex" ai="center" jc="center" bgImage="gradient-primary" borderRadius={3} color="white">
              <Icon size={24} />
            </Box>
          )}
          <Box>
            <Flex ai="center" gap={3}>
              <Box
                tag="h1"
                fontSize={28}
                sm={{ fontSize: 36 }}
                fontWeight={700}
                theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}
              >
                {title}
              </Box>
              {badge && (
                <Box
                  px={3}
                  py={1}
                  borderRadius={10}
                  theme={{ dark: { bgColor: 'indigo-900', color: 'indigo-300' }, light: { bgColor: 'indigo-100', color: 'indigo-600' } }}
                  fontSize={12}
                  fontWeight={500}
                >
                  {badge}
                </Box>
              )}
            </Flex>
          </Box>
        </Flex>
        <Box
          fontSize={16}
          sm={{ fontSize: 18 }}
          theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}
          lineHeight={28}
          maxWidth={160}
        >
          {description}
        </Box>
      </Box>
    </motion.div>
  );
}
