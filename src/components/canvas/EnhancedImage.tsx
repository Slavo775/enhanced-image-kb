import { useEffect, useState } from "react";
import { useCanvas } from "../../hooks/canvas/useCanvas";
import { ImageCanvas } from "./Canvas";

export type Props = {
  id: string;
  image: string;
  cropWidth: number;
  cropHeight: number;
  zoom: number;
  rotation: number;
};

export function EnhancedImage({
  id,
  image,
  cropWidth,
  cropHeight,
  zoom,
  rotation,
}: Props) {
  const { initCanvas } = useCanvas(id);
  const [wasInitialized, setWasInitialized] = useState(false);
  useEffect(() => {
    initCanvas({
      image,
      zoom,
      cropHeight,
      cropWidth,
      rotation,
    });
    setWasInitialized(true);
  }, []);

  return <>{wasInitialized && <ImageCanvas id={id} />}</>;
}
