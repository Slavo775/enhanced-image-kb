import { useMemo } from "react";
import { useStickerStore } from "../../stores/stickers";
import { StickerInput } from "../../components/canvas/Canvas";

export const useStickers = (canvasId: string) => {
  const {
    stickers,
    selectedSticker,
    addSticker,
    removeSticker,
    setSelectedSticker,
    updateSticker,
    updateAll,
  } = useStickerStore();

  const currentStickers = useMemo(() => {
    return stickers?.[canvasId]?.stickers;
  }, [stickers]);

  const currentSelectedStickers = useMemo(
    () => selectedSticker?.[canvasId],
    [selectedSticker]
  );

  const addSitckerLocal = async (image: string) => {
    const { width, height } = await getImageSizeFromDataUrl(image);
    const newSticker: StickerInput = {
      id: new Date().toString(),
      type: "sticker",
      src: image,
      x: Math.random() * 200,
      y: Math.random() * 200,
      width: width,
      height: height,
    };

    addSticker(newSticker, canvasId);
  };
  return {
    stickers: currentStickers,
    selectedSticker: currentSelectedStickers,
    addSticker: addSitckerLocal,
    removeSticker: (stickerId: string) => removeSticker(stickerId, canvasId),
    setSelectedSticker: (stickerId?: string) =>
      setSelectedSticker(canvasId, stickerId),
    updateSticker: (sticker: StickerInput) => updateSticker(sticker, canvasId),
    updateAllStickers: (stickers: StickerInput[]) =>
      updateAll(stickers, canvasId),
  };
};

function getImageSizeFromDataUrl(
  dataUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = dataUrl;
  });
}
