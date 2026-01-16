import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { spacing } from '@design-system/tokens';

/**
 * 404 页面 - 处理未找到的路由
 * 提供友好的错误提示和导航返回功能
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: spacing.md,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={12}
          sx={{
            padding: { xs: spacing.lg, md: spacing.xl },
            borderRadius: '24px',
            textAlign: 'center',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* 404 图标动画 */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(33, 150, 243, 0.1)'
                  : 'rgba(102, 126, 234, 0.1)',
              marginBottom: spacing.lg,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
                '50%': {
                  transform: 'scale(1.05)',
                  opacity: 0.8,
                },
              },
            }}
          >
            <SearchOffIcon
              sx={{
                fontSize: 64,
                color: 'primary.main',
              }}
            />
          </Box>

          {/* 404 标题 */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 700,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: spacing.sm,
              letterSpacing: '-0.02em',
            }}
          >
            404
          </Typography>

          {/* 错误描述 */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              marginBottom: spacing.md,
              color: 'text.primary',
            }}
          >
            页面未找到
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: '500px',
              margin: '0 auto',
              marginBottom: spacing.xl,
              lineHeight: 1.7,
            }}
          >
            抱歉，您访问的页面不存在或已被移除。
            <br />
            请检查 URL 是否正确，或返回主页继续浏览。
          </Typography>

          {/* 返回主页按钮 */}
          <Box
            sx={{
              display: 'flex',
              gap: spacing.md,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                paddingX: spacing.lg,
                paddingY: spacing.sm,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              返回主页
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              sx={{
                paddingX: spacing.lg,
                paddingY: spacing.sm,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              返回上一页
            </Button>
          </Box>

          {/* 装饰性元素 */}
          <Box
            sx={{
              marginTop: spacing.xl,
              paddingTop: spacing.lg,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              错误代码: 404 | 页面未找到
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
