import { FunctionComponent, useEffect, useState } from "react";
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

export const EnhancedImage: FunctionComponent<Props> = ({
  id,
  image,
  cropWidth,
  cropHeight,
  zoom,
  rotation,
}) => {
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
};
