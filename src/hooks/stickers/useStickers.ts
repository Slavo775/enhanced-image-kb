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

  //   const addSitckerLocal = async (image: string) => {
  //     const { width, height } = await getImageSizeFromDataUrl(image);
  //     const newSticker: StickerInput = {
  //       id: new Date().toString(),
  //       type: "sticker",
  //       src: image,
  //       x: Math.random() * 200,
  //       y: Math.random() * 200,
  //       width: width,
  //       height: height,
  //     };

  //     addSticker(newSticker, canvasId);
  //   };

  function encodeSvgToDataUrl(svg: string): string {
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
  }

  const addStickerLocal = async (input: string) => {
    let src: string = "";
    let width = 100;
    let height = 100;

    if (typeof input === "string") {
      // ✅ Predpokladáme data URL (napr. PNG)
      src = input;

      if (src.startsWith("data:image/svg+xml")) {
        const svgText = atob(src.split(",")[1]);
        const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
        const svg = doc.querySelector("svg");

        const w = svg?.getAttribute("width");
        const h = svg?.getAttribute("height");
        const viewBox = svg?.getAttribute("viewBox");

        if (w && h) {
          width = parseFloat(w);
          height = parseFloat(h);
        } else if (viewBox) {
          const [, , vw, vh] = viewBox.split(" ").map(Number);
          width = vw;
          height = vh;
        }
      } else if (input.includes("<svg")) {
        // ✅ Máme SVG ako string → zabalíme ako data URL
        src = encodeSvgToDataUrl(input);

        const doc = new DOMParser().parseFromString(input, "image/svg+xml");
        const svg = doc.querySelector("svg");

        const w = svg?.getAttribute("width");
        const h = svg?.getAttribute("height");
        const viewBox = svg?.getAttribute("viewBox");

        if (w && h) {
          width = parseFloat(w);
          height = parseFloat(h);
        } else if (viewBox) {
          const [, , vw, vh] = viewBox.split(" ").map(Number);
          width = vw;
          height = vh;
        }
      } else {
        const size = await getImageSizeFromDataUrl(src);
        width = size.width;
        height = size.height;
      }
    }

    const newSticker: StickerInput = {
      id: new Date().toISOString(),
      type: "sticker",
      src,
      x: Math.random() * 200,
      y: Math.random() * 200,
      width,
      height,
    };

    addSticker(newSticker, canvasId);
  };

  return {
    stickers: currentStickers,
    selectedSticker: currentSelectedStickers,
    addSticker: addStickerLocal,
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
