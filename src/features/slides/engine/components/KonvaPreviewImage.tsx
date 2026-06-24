import { useMemo } from 'react';
import { Group, Image as KonvaImage } from 'react-konva';
import { useSlideImage } from '../../hooks/useSlideImage';
import { KonvaCameraStage } from './KonvaCameraStage';
import { VIEWPORT_ZOOM } from '../../constants/viewport';

interface KonvaPreviewImageProps {
  src: string;
  alt?: string;
  resetKey: string;
}

export function KonvaPreviewImage({ src, resetKey }: KonvaPreviewImageProps) {
  const [image, status] = useSlideImage(src);

  const contentSize = useMemo(() => {
    if (!image) {
      return { width: 1, height: 1 };
    }
    return { width: image.width, height: image.height };
  }, [image]);

  if (status === 'loading') {
    return null;
  }

  return (
    <KonvaCameraStage
      config={VIEWPORT_ZOOM.modal}
      contentSize={contentSize}
      resetKey={`${resetKey}-${src}`}
      sx={{ width: '100%', height: '100%' }}
    >
      <Group>
        <KonvaImage image={image} width={contentSize.width} height={contentSize.height} />
      </Group>
    </KonvaCameraStage>
  );
}
