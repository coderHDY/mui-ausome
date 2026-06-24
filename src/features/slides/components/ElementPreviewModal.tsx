import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { spacing } from '@design-system/tokens';
import { KonvaPreviewImage } from '../engine/components/KonvaPreviewImage';
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
          display: preview?.kind === 'image' ? 'flex' : 'block',
          flexDirection: 'column',
        }}
      >
        {preview?.kind === 'text' && (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
            {preview.content}
          </Typography>
        )}

        {preview?.kind === 'image' && (
          <KonvaPreviewImage
            src={preview.src}
            alt={preview.alt}
            resetKey={preview.id}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
