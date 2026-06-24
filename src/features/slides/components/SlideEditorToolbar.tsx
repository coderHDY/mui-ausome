import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import PanToolIcon from '@mui/icons-material/PanTool';
import NearMeIcon from '@mui/icons-material/NearMe';
import TitleIcon from '@mui/icons-material/Title';
import ApprovalIcon from '@mui/icons-material/Approval';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  EDITOR_SWATCHES,
  EDITOR_TOOLS,
  STAMP_GLYPH,
} from '../constants/tools';
import { useSlideEditorStore } from '../model/store/slide-editor-store';
import type { EditorTool, StampKind } from '../types/annotation.types';

const TOOL_ICONS: Record<EditorTool, typeof BrushIcon> = {
  pan: PanToolIcon,
  select: NearMeIcon,
  brush: BrushIcon,
  text: TitleIcon,
  stamp: ApprovalIcon,
};

const STAMP_KINDS: StampKind[] = ['check', 'cross', 'star', 'arrow'];

interface SlideEditorToolbarProps {
  slideId: string;
}

export function SlideEditorToolbar({ slideId }: SlideEditorToolbarProps) {
  const theme = useTheme();

  const toolbarOpen = useSlideEditorStore((s) => s.toolbarOpen);
  const editorOpen = useSlideEditorStore((s) => s.editorOpen);
  const activeTool = useSlideEditorStore((s) => s.activeTool);
  const strokeColor = useSlideEditorStore((s) => s.strokeColor);
  const strokeWidth = useSlideEditorStore((s) => s.strokeWidth);
  const stampKind = useSlideEditorStore((s) => s.stampKind);
  const selectedId = useSlideEditorStore((s) => s.selectedAnnotationId);
  const toggleToolbar = useSlideEditorStore((s) => s.toggleToolbar);
  const selectTool = useSlideEditorStore((s) => s.selectTool);
  const confirmTool = useSlideEditorStore((s) => s.confirmTool);
  const setStrokeColor = useSlideEditorStore((s) => s.setStrokeColor);
  const setStrokeWidth = useSlideEditorStore((s) => s.setStrokeWidth);
  const setStampKind = useSlideEditorStore((s) => s.setStampKind);
  const applyColorToSelected = useSlideEditorStore((s) => s.applyColorToSelected);
  const removeAnnotation = useSlideEditorStore((s) => s.removeAnnotation);

  const isEditing = editorOpen;
  const brushActive = toolbarOpen || isEditing;

  const handleColorPick = (color: string) => {
    setStrokeColor(color);
    if (selectedId) {
      applyColorToSelected(slideId, color);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedId) {
      removeAnnotation(slideId, selectedId);
    }
  };

  const handleToolPick = (tool: EditorTool) => {
    selectTool(tool);
  };

  const handleStampKindPick = (kind: StampKind) => {
    setStampKind(kind);
    confirmTool();
  };

  /** 图章：第一次点工具栏图标，仅展开子选项，尚未进入画布 */
  const isStampPending =
    toolbarOpen && activeTool === 'stamp' && !editorOpen;

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <Tooltip
        title={
          toolbarOpen
            ? '关闭工具面板'
            : isEditing
              ? '切换工具'
              : '打开工具面板'
        }
        placement="left"
      >
        <IconButton
          aria-label="编辑工具"
          aria-expanded={toolbarOpen}
          aria-pressed={isEditing}
          onClick={toggleToolbar}
          size="large"
          color={brushActive ? 'primary' : 'default'}
          sx={{
            bgcolor: brushActive
              ? alpha(theme.palette.primary.main, 0.12)
              : 'transparent',
          }}
        >
          <BrushIcon />
        </IconButton>
      </Tooltip>

      {toolbarOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            right: 'calc(100% + 8px)',
            top: 0,
            zIndex: theme.zIndex.modal,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'visible',
          }}
        >
          <Stack spacing={0.5} sx={{ p: 0.75, minWidth: 48, alignItems: 'center' }}>
            {EDITOR_TOOLS.map(({ id, label }) => {
              const Icon = TOOL_ICONS[id];
              const selected =
                activeTool === id && (toolbarOpen || isEditing);
              return (
                <Tooltip key={id} title={label} placement="left">
                  <IconButton
                    size="small"
                    aria-label={label}
                    aria-pressed={selected}
                    onClick={() => handleToolPick(id)}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: selected
                        ? alpha(theme.palette.primary.main, 0.14)
                        : 'transparent',
                      color: selected ? 'primary.main' : 'text.secondary',
                      '&:hover': {
                        bgcolor: selected
                          ? alpha(theme.palette.primary.main, 0.2)
                          : alpha(theme.palette.action.hover, 0.08),
                      },
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                </Tooltip>
              );
            })}

            <Divider flexItem sx={{ my: 0.5, width: '100%' }} />

            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
              颜色
            </Typography>
            <Stack spacing={0.5} alignItems="center">
              {EDITOR_SWATCHES.map((color) => (
                <Box
                  key={color}
                  component="button"
                  type="button"
                  aria-label={`颜色 ${color}`}
                  onClick={() => handleColorPick(color)}
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    bgcolor: color,
                    border: 2,
                    borderColor:
                      strokeColor === color ? 'primary.main' : 'transparent',
                    cursor: 'pointer',
                    p: 0,
                    outline: 'none',
                    boxShadow:
                      strokeColor === color
                        ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                        : 'none',
                    '&:hover': { transform: 'scale(1.08)' },
                  }}
                />
              ))}
            </Stack>

            {toolbarOpen && (
              <>
                <Divider flexItem sx={{ my: 0.5, width: '100%' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                  粗细
                </Typography>
                {[2, 4, 6].map((w) => (
                  <IconButton
                    key={w}
                    size="small"
                    aria-label={`线宽 ${w}`}
                    aria-pressed={strokeWidth === w}
                    onClick={() => setStrokeWidth(w)}
                    sx={{
                      width: 36,
                      height: 28,
                      fontSize: 12,
                      fontWeight: 600,
                      color: strokeWidth === w ? 'primary.main' : 'text.secondary',
                      bgcolor:
                        strokeWidth === w
                          ? alpha(theme.palette.primary.main, 0.12)
                          : 'transparent',
                    }}
                  >
                    {w}
                  </IconButton>
                ))}
              </>
            )}

            {isStampPending && (
              <>
                <Divider flexItem sx={{ my: 0.5, width: '100%' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                  图章
                </Typography>
                {STAMP_KINDS.map((kind) => (
                  <IconButton
                    key={kind}
                    size="small"
                    aria-label={`图章 ${kind}`}
                    aria-pressed={stampKind === kind}
                    onClick={() => handleStampKindPick(kind)}
                    sx={{
                      width: 36,
                      height: 36,
                      fontSize: 18,
                      color: stampKind === kind ? 'primary.main' : 'text.primary',
                      bgcolor:
                        stampKind === kind
                          ? alpha(theme.palette.primary.main, 0.12)
                          : 'transparent',
                    }}
                  >
                    {STAMP_GLYPH[kind]}
                  </IconButton>
                ))}
              </>
            )}

            {selectedId && (
              <>
                <Divider flexItem sx={{ my: 0.5, width: '100%' }} />
                <Tooltip title="删除选中" placement="left">
                  <IconButton
                    size="small"
                    aria-label="删除选中元素"
                    onClick={handleDeleteSelected}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
