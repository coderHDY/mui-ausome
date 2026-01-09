import { useState } from 'react';
import { Container, Typography, Box, Button, Stack, Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { SettingsSection, SettingItem, SettingsTabs } from '../components';
import { spacing } from '@design-system/tokens';

/**
 * 设置页面
 * 展示MUI复杂样式技巧的综合应用：
 * - 选项卡导航
 * - 分组表单
 * - 多种输入控件
 * - 自定义样式组件
 */
export function SettingsPage() {
  const theme = useTheme();

  // 通知设置
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // 安全设置
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordPolicy, setPasswordPolicy] = useState('medium');

  // 外观设置
  const [themeMode, setThemeMode] = useState('light');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  // 语言设置
  const [language, setLanguage] = useState('zh-CN');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [timezone, setTimezone] = useState('Asia/Shanghai');

  const handleSave = () => {
    console.log('Settings saved');
  };

  const tabs = [
    {
      label: '通知',
      content: (
        <SettingsSection
          title="通知设置"
          description="管理您接收通知的方式和频率"
          icon={<NotificationsIcon />}
        >
          <SettingItem
            label="邮件通知"
            description="接收重要更新的邮件通知"
            type="switch"
            value={emailNotifications}
            onChange={setEmailNotifications}
          />
          <SettingItem
            label="推送通知"
            description="在浏览器中接收实时推送通知"
            type="switch"
            value={pushNotifications}
            onChange={setPushNotifications}
          />
          <SettingItem
            label="营销邮件"
            description="接收产品更新和营销信息"
            type="switch"
            value={marketingEmails}
            onChange={setMarketingEmails}
          />
        </SettingsSection>
      ),
    },
    {
      label: '安全',
      content: (
        <>
          <SettingsSection
            title="账户安全"
            description="保护您的账户安全设置"
            icon={<SecurityIcon />}
          >
            <SettingItem
              label="双因素认证"
              description="为您的账户添加额外的安全层"
              type="switch"
              value={twoFactorAuth}
              onChange={setTwoFactorAuth}
            />
            <SettingItem
              label="会话超时"
              description="自动登出前的空闲时间"
              type="select"
              value={sessionTimeout}
              onChange={setSessionTimeout}
              options={[
                { label: '15分钟', value: '15' },
                { label: '30分钟', value: '30' },
                { label: '1小时', value: '60' },
                { label: '2小时', value: '120' },
              ]}
            />
            <SettingItem
              label="密码策略"
              description="密码复杂度要求"
              type="select"
              value={passwordPolicy}
              onChange={setPasswordPolicy}
              options={[
                { label: '低', value: 'low' },
                { label: '中', value: 'medium' },
                { label: '高', value: 'high' },
              ]}
            />
          </SettingsSection>
        </>
      ),
    },
    {
      label: '外观',
      content: (
        <SettingsSection
          title="外观设置"
          description="自定义界面外观和显示选项"
          icon={<PaletteIcon />}
        >
          <SettingItem
            label="主题模式"
            description="选择浅色或深色主题"
            type="select"
            value={themeMode}
            onChange={setThemeMode}
            options={[
              { label: '浅色', value: 'light' },
              { label: '深色', value: 'dark' },
              { label: '自定义', value: 'custom' },
            ]}
          />
          <SettingItem
            label="紧凑模式"
            description="减少间距以显示更多内容"
            type="switch"
            value={compactMode}
            onChange={setCompactMode}
          />
          <SettingItem
            label="动画效果"
            description="启用界面动画和过渡效果"
            type="switch"
            value={animations}
            onChange={setAnimations}
          />
          <SettingItem
            label="主题预览"
            description="当前主题设置"
            type="custom"
          >
            <Stack direction="row" spacing={spacing.sm}>
              <Chip
                label={themeMode === 'light' ? '浅色' : themeMode === 'dark' ? '深色' : '自定义'}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              />
              <Chip
                label={compactMode ? '紧凑模式' : '标准模式'}
                sx={{
                  backgroundColor: alpha(theme.palette.secondary?.main || theme.palette.info.main, 0.1),
                  color: theme.palette.secondary?.main || theme.palette.info.main,
                }}
              />
            </Stack>
          </SettingItem>
        </SettingsSection>
      ),
    },
    {
      label: '语言与地区',
      content: (
        <SettingsSection
          title="语言和地区设置"
          description="设置语言、日期格式和时区"
          icon={<LanguageIcon />}
        >
          <SettingItem
            label="语言"
            description="选择界面显示语言"
            type="select"
            value={language}
            onChange={setLanguage}
            options={[
              { label: '简体中文', value: 'zh-CN' },
              { label: '繁体中文', value: 'zh-TW' },
              { label: 'English', value: 'en-US' },
              { label: '日本語', value: 'ja-JP' },
            ]}
          />
          <SettingItem
            label="日期格式"
            description="选择日期显示格式"
            type="select"
            value={dateFormat}
            onChange={setDateFormat}
            options={[
              { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
              { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
              { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
            ]}
          />
          <SettingItem
            label="时区"
            description="选择您所在的时区"
            type="select"
            value={timezone}
            onChange={setTimezone}
            options={[
              { label: 'Asia/Shanghai (UTC+8)', value: 'Asia/Shanghai' },
              { label: 'Asia/Tokyo (UTC+9)', value: 'Asia/Tokyo' },
              { label: 'America/New_York (UTC-5)', value: 'America/New_York' },
              { label: 'Europe/London (UTC+0)', value: 'Europe/London' },
            ]}
          />
        </SettingsSection>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* 页面标题 */}
      <Box
        sx={{
          mb: spacing.xl,
          pb: spacing.lg,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || theme.palette.primary.dark} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: spacing.sm,
          }}
        >
          设置
        </Typography>
        <Typography variant="body2" color="text.secondary">
          管理您的账户偏好和系统设置
        </Typography>
      </Box>

      {/* 选项卡导航 */}
      <SettingsTabs tabs={tabs} />

      {/* 保存按钮 */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          py: spacing.lg,
          mt: spacing.xl,
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: spacing.md,
        }}
      >
        <Button variant="outlined" onClick={() => window.location.reload()}>
          重置
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            px: spacing.xl,
            boxShadow: theme.shadows[4],
            '&:hover': {
              boxShadow: theme.shadows[8],
            },
          }}
        >
          保存更改
        </Button>
      </Box>
    </Container>
  );
}

