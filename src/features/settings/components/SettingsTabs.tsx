import { Tabs, Tab, Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { type ReactNode, useState } from 'react';
import { spacing, radius } from '@design-system/tokens';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: spacing.lg }}>{children}</Box>}
    </div>
  );
}

interface SettingsTabsProps {
  tabs: Array<{ label: string; content: ReactNode }>;
}

/**
 * 设置选项卡组件
 * 展示MUI复杂样式技巧：
 * - 自定义Tab样式
 * - 动画过渡
 * - 激活状态指示
 */
export function SettingsTabs({ tabs }: SettingsTabsProps) {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{
          borderBottom: `2px solid ${theme.palette.divider}`,
          mb: spacing.lg,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: `${radius.sm} ${radius.sm} 0 0`,
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            sx={{
              textTransform: 'none',
              fontWeight: theme.typography.fontWeightMedium,
              fontSize: theme.typography.body1.fontSize,
              minHeight: 64,
              color: theme.palette.text.secondary,
              transition: theme.transitions.create(['color', 'background-color'], {
                duration: theme.transitions.duration.short,
              }),
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: theme.typography.fontWeightBold,
              },
            }}
          />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}

