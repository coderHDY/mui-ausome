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
import { useSlideEditorStore } from '../model/store/slide-editor-store';
import { useSlideEditorHistory } from '../hooks/useSlideEditorHistory';

export function SlidesPage() {
  usePreventBrowserZoom(true);
  useSlideEditorHistory(true);
  const clearSelection = useSlideEditorStore((s) => s.clearSelection);
  const closeToolbar = useSlideEditorStore((s) => s.closeToolbar);

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
    clearSelection();
    closeToolbar();
  }, [currentIndex, clearSelection, closeToolbar]);

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
        height: 'calc(100vh - 64px)',
        m: -1,
      }}
    >
      {/* <Box sx={{ px: spacing.md, pb: spacing.sm, flexShrink: 0 }}>
        <Typography variant="h5" component="h1">
          Slide 演示
        </Typography>
        <Typography variant="body2" color="text.secondary">
          滚轮缩放画布；右侧画笔编辑；⌘Z / ⌘⇧Z 撤销重做
        </Typography>
      </Box> */}

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
        }}
      >
        <SlideViewport
          slide={currentSlide}
          slideKey={`${currentSlide.id}-${currentIndex}`}
          frozen={modalOpen}
          onElementClick={handleElementClick}
        />

        <SlideControls
          slideId={currentSlide.id}
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
