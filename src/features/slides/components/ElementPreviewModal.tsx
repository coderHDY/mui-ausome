import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { spacing } from '@design-system/tokens';
import { VIEWPORT_ZOOM } from '../constants/viewport';
import type { SlidePreviewPayload } from '../types/slide.types';

interface ElementPreviewModalProps {
  open: boolean;
  preview: SlidePreviewPayload | null;
  onClose: () => void;
}

export function ElementPreviewModal({
  open,
  preview,
  onClose,
}: ElementPreviewModalProps) {
  const theme = useTheme();
  const zoom = VIEWPORT_ZOOM.modal;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '90vw',
          maxWidth: 1200,
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: spacing.md,
          py: spacing.sm,
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1" noWrap sx={{ flex: 1, mr: spacing.sm }}>
          {preview?.title ?? '预览'}
        </Typography>
        <IconButton aria-label="关闭预览" onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          flex: 1,
          p: preview?.kind === 'text' ? spacing.lg : 0,
          overflow: preview?.kind === 'text' ? 'auto' : 'hidden',
          touchAction: preview?.kind === 'text' ? 'auto' : 'none',
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
        }}
      >
        {preview?.kind === 'text' && (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
            {preview.content}
          </Typography>
        )}

        {preview?.kind === 'image' && (
          <TransformWrapper
            key={preview.id}
            initialScale={zoom.initialScale}
            minScale={zoom.minScale}
            maxScale={zoom.maxScale}
            centerOnInit
            centerZoomedOut
            limitToBounds
            smooth
            wheel={{ step: zoom.wheelStep }}
            pinch={{ step: zoom.pinchStep }}
            panning={{ velocityDisabled: true }}
            doubleClick={{ disabled: false, mode: 'zoomIn', step: 0.5 }}
          >
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={preview.src}
                alt={preview.alt ?? ''}
                draggable={false}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  userSelect: 'none',
                  touchAction: 'none',
                }}
              />
            </TransformComponent>
          </TransformWrapper>
        )}
      </DialogContent>
    </Dialog>
  );
}
