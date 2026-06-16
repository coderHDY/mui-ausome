import { useCallback, useState } from 'react';
import type { SlideDeck } from '../types/slide.types';

export function useSlideNavigation(deck: SlideDeck) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = deck.slides.length;
  const currentSlide = deck.slides[currentIndex];

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
