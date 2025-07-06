import {
  FinalImageResult,
  useFinalImageStore,
} from "../../stores/finalImageStore";
import { useStickers } from "../stickers/useStickers";

export const useImageExporter = (canvasId: string) => {
  const { setSelectedSticker } = useStickers(canvasId);

  const exportFinalImage = async (): Promise<FinalImageResult | null> => {
    setSelectedSticker(undefined);
    // počkaj ~50ms aby sa canvas stihol prekresliť
    await new Promise((resolve) => setTimeout(resolve, 50));

    const image = useFinalImageStore.getState().getFinalImage();
    return image;
  };

  return { exportFinalImage };
};
