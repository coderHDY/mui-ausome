import { Box, Typography, alpha, useTheme } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { spacing } from '@design-system/tokens';
import { SLIDE_INTERACTIVE_CLASS } from '../constants/viewport';
import { useClickWithoutDrag } from '../hooks/useClickWithoutDrag';
import type { HotspotElement } from '../types/slide.types';

interface SlideElementHotspotProps {
  element: HotspotElement;
  onClick: () => void;
}

export function SlideElementHotspot({ element, onClick }: SlideElementHotspotProps) {
  const theme = useTheme();
  const { handlePointerDown } = useClickWithoutDrag(onClick);

  return (
    <Box
      role="button"
      tabIndex={0}
      className={SLIDE_INTERACTIVE_CLASS}
      aria-label={`${element.label}，点击查看详情`}
      onPointerDown={handlePointerDown}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        px: spacing.md,
        borderRadius: 2,
        cursor: 'grab',
        border: `2px dashed ${theme.palette.primary.main}`,
        bgcolor: alpha(theme.palette.primary.main, 0.08),
        color: 'primary.main',
        transition: theme.transitions.create(['background-color', 'box-shadow', 'transform'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:active': {
          cursor: 'grabbing',
        },
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.16),
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    >
      <TouchAppIcon fontSize="small" />
      <Typography variant="subtitle2" fontWeight={600} noWrap>
        {element.label}
      </Typography>
    </Box>
  );
}
