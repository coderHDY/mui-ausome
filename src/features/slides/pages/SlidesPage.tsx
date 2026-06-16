import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { spacing } from '@design-system/tokens';
import { sampleDeck } from '../data/sample-deck';
import { useSlideNavigation } from '../hooks/useSlideNavigation';
import { usePreventBrowserZoom } from '../hooks/usePreventBrowserZoom';
import { SlideViewport } from '../components/SlideViewport';
import { SlideControls } from '../components/SlideControls';
import { ElementPreviewModal } from '../components/ElementPreviewModal';
import { resolvePreviewPayload } from '../types/slide.types';

export function SlidesPage() {
  usePreventBrowserZoom(true);

  const {
    currentIndex,
    currentSlide,
    total,
    goPrev,
    goNext,
    canGoPrev,
    canGoNext,
  } = useSlideNavigation(sampleDeck);

  const [previewElementId, setPreviewElementId] = useState<string | null>(null);

  useEffect(() => {
    setPreviewElementId(null);
  }, [currentIndex]);

  const preview = useMemo(
    () =>
      previewElementId
        ? resolvePreviewPayload(currentSlide.elements, previewElementId)
        : null,
    [currentSlide.elements, previewElementId],
  );

  const handleElementClick = useCallback((elementId: string) => {
    setPreviewElementId(elementId);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewElementId(null);
  }, []);

  const modalOpen = previewElementId !== null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px - 16px)',
        mx: -1,
        mb: -1,
      }}
    >
      <Box sx={{ px: spacing.md, pb: spacing.sm, flexShrink: 0 }}>
        <Typography variant="h5" component="h1">
          Slide 演示
        </Typography>
        <Typography variant="body2" color="text.secondary">
          滚轮或双指缩放画布；点击图片或蓝色按钮打开弹窗预览
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <SlideViewport
          slide={currentSlide}
          slideKey={`${currentSlide.id}-${currentIndex}`}
          frozen={modalOpen}
          onElementClick={handleElementClick}
        />

        <SlideControls
          currentIndex={currentIndex}
          total={total}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          slideTitle={currentSlide.title}
          onPrev={goPrev}
          onNext={goNext}
        />
      </Box>

      <ElementPreviewModal
        open={modalOpen}
        preview={preview}
        onClose={handleClosePreview}
      />
    </Box>
  );
}
