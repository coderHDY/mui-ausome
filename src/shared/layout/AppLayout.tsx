import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { type ReactNode } from "react";
import { useUIStore } from "../state";
import { ThemeToggle } from "../components";
import { spacing } from "@design-system/tokens";

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 64; // PC版本折叠时的宽度

interface AppLayoutProps {
  children: ReactNode;
  sidebarContent?: ReactNode;
  title?: string;
}

/**
 * 应用布局组件
 * 提供统一的页面布局结构，包括顶部栏和侧边栏
 * 纯布局组件，不包含业务逻辑
 */
export function AppLayout({
  children,
  sidebarContent,
  title = "Admin Dashboard",
}: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebarCollapsed = useUIStore(
    (state) => state.toggleSidebarCollapsed
  );

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCollapseToggle = () => {
    toggleSidebarCollapsed();
  };

  // 获取Toolbar高度（用于计算侧边栏位置）
  const toolbarHeight = 64; // MUI默认Toolbar高度

  // PC版本：根据折叠状态决定侧边栏宽度
  // 移动端：始终使用完整宽度
  const drawerWidth = isMobile
    ? DRAWER_WIDTH
    : sidebarCollapsed
    ? DRAWER_WIDTH_COLLAPSED
    : DRAWER_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 顶部应用栏 - 始终全宽，不被侧边栏挤压 */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: "100%",
          left: 0,
        }}
      >
        <Toolbar>
          {/* 菜单按钮 - 移动端始终显示，PC端仅在侧边栏关闭时显示 */}
          <IconButton
            color="inherit"
            aria-label={sidebarOpen ? "关闭菜单" : "打开菜单"}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: spacing.md,
              ml: 0,
              display: { xs: "flex", md: sidebarOpen ? "none" : "flex" },
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          {/* 网站名 */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      {/* 侧边栏 */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          // PC版：persistent drawer 点击外部不关闭（persistent默认没有backdrop，但显式设置更安全）
          keepMounted: !isMobile,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            // PC版：侧边栏从Header下方开始
            // 移动端：全屏覆盖
            ...(isMobile
              ? {
                  top: 0,
                  height: "100%",
                }
              : {
                  top: toolbarHeight,
                  height: `calc(100vh - ${toolbarHeight}px)`,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }),
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {/* 侧边栏头部区域 - 包含标题和关闭/折叠按钮 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              sidebarCollapsed && !isMobile ? "center" : "flex-end",
            // px: sidebarCollapsed && !isMobile ? spacing.xs : spacing.sm,
            py: 0, // 减少高度
            flexShrink: 0, // 防止头部区域被压缩
            minHeight: 40, // 减少最小高度
            pr: sidebarCollapsed && !isMobile ? "0px" : theme.spacing(2) // spacing.xs (4) * 4px = 16px，使用 theme.spacing(1) = 4px
          }}
        >
          {isMobile ? (
            <IconButton
              onClick={handleDrawerToggle}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.5),
                  color: theme.palette.text.primary,
                },
                mr: spacing.md,
                transition: theme.transitions.create(
                  ["background-color", "color"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={handleCollapseToggle}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.5),
                  color: theme.palette.text.primary,
                },
                transition: theme.transitions.create(
                  ["background-color", "color"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
              }}
            >
              {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          )}
        </Box>
        {/* 侧边栏内容区域 */}
        <Box
          sx={{
            overflow: "auto",
            flex: 1,
            // py: sidebarCollapsed && !isMobile ? spacing.xs : spacing.sm,
            py: spacing.xs,
            minHeight: 0, // 确保flex子元素可以正确滚动
          }}
        >
          {sidebarContent || <Typography>导航菜单</Typography>}
        </Box>
      </Drawer>

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: "100%",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
