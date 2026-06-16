export type SlideElement =
  | {
      type: 'image';
      id: string;
      src: string;
      x: number;
      y: number;
      width: number;
      height: number;
      alt?: string;
    }
  | {
      type: 'hotspot';
      id: string;
      label: string;
      x: number;
      y: number;
      width: number;
      height: number;
      previewTitle?: string;
      previewImage?: string;
      previewText?: string;
    }
  | {
      type: 'text';
      id: string;
      content: string;
      x: number;
      y: number;
      width?: number;
      fontSize?: number;
      fontWeight?: number;
      color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary';
    };

export type Slide = {
  id: string;
  title?: string;
  width: number;
  height: number;
  elements: SlideElement[];
};

export type SlideDeck = {
  slides: Slide[];
};

export type ImageElement = Extract<SlideElement, { type: 'image' }>;
export type HotspotElement = Extract<SlideElement, { type: 'hotspot' }>;

export type SlidePreviewPayload = {
  id: string;
  title: string;
} & (
  | { kind: 'image'; src: string; alt?: string }
  | { kind: 'text'; content: string }
);

export function resolvePreviewPayload(
  elements: SlideElement[],
  elementId: string,
): SlidePreviewPayload | null {
  const element = elements.find((el) => el.id === elementId);
  if (!element) return null;

  if (element.type === 'image') {
    return {
      id: element.id,
      title: element.alt ?? '图片预览',
      kind: 'image',
      src: element.src,
      alt: element.alt,
    };
  }

  if (element.type === 'hotspot') {
    if (element.previewImage) {
      return {
        id: element.id,
        title: element.previewTitle ?? element.label,
        kind: 'image',
        src: element.previewImage,
        alt: element.label,
      };
    }
    if (element.previewText) {
      return {
        id: element.id,
        title: element.previewTitle ?? element.label,
        kind: 'text',
        content: element.previewText,
      };
    }
  }

  return null;
}
