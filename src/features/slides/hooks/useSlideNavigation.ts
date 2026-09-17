import { useCallback, useEffect, useState } from 'react';
import {
  getStageRole,
  publishStageView,
  subscribeStageView,
} from '@shared/stage';
import type { SlideDeck } from '../types/slide.types';

const SLIDE_INDEX_VIEW_KEY = 'slides:index';

export function useSlideNavigation(deck: SlideDeck) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = deck.slides.length;
  const currentSlide = deck.slides[currentIndex];
  const role = getStageRole();

  useEffect(() => {
    if (role !== 'controller') {
      return;
    }
    publishStageView(SLIDE_INDEX_VIEW_KEY, currentIndex);
  }, [currentIndex, role]);

  useEffect(() => {
    if (role !== 'stage') {
      return;
    }
    return subscribeStageView(SLIDE_INDEX_VIEW_KEY, (payload) => {
      if (typeof payload !== 'number' || Number.isNaN(payload)) {
        return;
      }
      setCurrentIndex((current) => {
        const next = Math.max(0, Math.min(total - 1, payload));
        return next === current ? current : next;
      });
    });
  }, [role, total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < total - 1;

  return {
    currentIndex,
    currentSlide,
    total,
    goPrev,
    goNext,
    canGoPrev,
    canGoNext,
  };
}
